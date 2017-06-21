/* global process */
const remoteControl = require("../../modules/remotecontrol");
let postis = require("postis");
const setupScreenSharingForWindow = require("../../modules/screensharing");
const config = require("../../config.js");
const {dialog} = require('electron').remote;
const {ipcRenderer} = require('electron');

/**
 * The postis channel.
 */
let channel;

/**
 * Cteates the iframe that will load Jitsi Meet.
 */
let iframe = document.createElement('iframe');
iframe.src = process.env.JITSI_MEET_URL || config.jitsiMeetURL;
iframe.allowFullscreen = true;
iframe.onload = onload;
document.body.appendChild(iframe);

/**
 * The jitsi-meet largeVideo MediaStream.
 */
let localStream;

/**
 * The RTCPeerConnection to micro window.
 */
let peerConnectionMain;

/**
 * Factory for dialogs.
 */
class DialogFactory {
    /**
     * Creates new instance
     * @constructor
     */
    constructor() { }

    /**
     * Shows message box dialog for request for remote control permissions
     * @param {object} userInfo - information about the user that has sent the
     * request:
     * @param {string} userInfo.displayName - display name
     * @param {string} userInfo.userJID - the JID of the user.
     * @param {boolean} userInfo.screenSharing - true if the screen sharing
     * is started.
     */
    requestRemoteControlPermissions(userInfo) {
        return new Promise( resolve =>
            dialog.showMessageBox({
                type: "question",
                buttons: [
                    "Yes",
                    "No"
                ],
                defaultId: 0,
                title: "Request for permission for remote control",
                message: "Would you like to allow " + userInfo.displayName
                    + " to remotely control your desktop?"
                    + (userInfo.screenSharing ? ""
                        : "\nNote: If you press \"Yes\" the screen sharing "
                            + "will start!"),
                detail: "userId: " + userInfo.userJID,
                cancelId: 1
            }, response => resolve(response === 0? true : false))
        );
    }
}

/**
 * Dialog factory instance.
 */
const dialogFactory = new DialogFactory();

/**
 * Handles loaded event for iframe:
 * Enables screen sharing functionality to the iframe webpage.
 * Initializes postis.
 * Initializes remote control.
 */
function onload() {
    let largeVideo = iframe.contentWindow.document.getElementById("largeVideo");
    connectToMicroWindow(largeVideo.srcObject);

    setupScreenSharingForWindow(iframe.contentWindow);
    iframe.contentWindow.onunload = onunload;
    channel = postis({
        window: iframe.contentWindow,
        windowForEventListening: window
    });
    remoteControl.init(
        channel,
        dialogFactory,
        config.handleRemoteControlAuthorization);
}

/**
 * Clears the postis objects and remoteControl.
 */
function onunload() {
    channel.destroy();
    channel = null;
    remoteControl.dispose();
}

/**
 * Connects main window's components to micro mode window.
 * @param {object} stream - MediaStream object from the jitsi-meet conference
 */
function connectToMicroWindow(stream) {
    ipcRenderer.send('log', "received local stream and sending");
    localStream = stream;

    setUpPeerConnection();

    ipcRenderer.on('microWindowPeerCreated', () => {
      localStream.getTracks().forEach(
        function(track) {
          peerConnectionMain.addTrack(
            track,
            localStream
          );
        }
      );
      ipcRenderer.send('log', "added local stream to peer connection");
      createAndSendOffer();
    });

    ipcRenderer.on('microWindowLocalDescriptionSet', (event, data) => {
      const desc = new RTCSessionDescription(data);
      ipcRenderer.send('log', 'main window setRemoteDescription start');
      peerConnectionMain.setRemoteDescription(desc).then(
        function() {
          ipcRenderer.send('log', "main window setRemoteDescription complete");
        },
        function(error) {
          ipcRenderer.send('log', 'main window failed to set session description: '
                                  + error.toString());
        }
      );
    });
}

/**
 * Creates RTCPeerConnection object and set ice candidate listneres.
 */
function setUpPeerConnection() {
  peerConnectionMain = new RTCPeerConnection();
  ipcRenderer.send('log', "created main window peer connection object");

  ipcRenderer.on('microWindowIceCandidate', (event, candidate) => {
    peerConnectionMain.addIceCandidate(candidate)
    .then(
      function() {
        ipcRenderer.send('log', 'main window addIceCandidate success');
      },
      function(err) {
        ipcRenderer.send('log', 'main window failed to add ICE Candidate: '
                                + err.toString());
      });
  });

  peerConnectionMain.onicecandidate = function(event) {
    if(event.candidate !== null) {
      let newIceCandidate = {
        candidate: event.candidate.candidate,
        sdpMLineIndex: event.candidate.sdpMLineIndex,
        sdpMid: event.candidate.sdpMid
      };
      ipcRenderer.send('mainWindowIceCandidate', newIceCandidate);
    }
  };
  peerConnectionMain.oniceconnectionstatechange = function(event) {
    if (peerConnectionMain) {
      ipcRenderer.send('log', "main window iceCandidateState change event: ", event);
    }
  };

  ipcRenderer.send('mainWindowPeerCreated');
}

/**
 * Creates peer connection offer to micro window.
 */
function createAndSendOffer() {
  ipcRenderer.send('log', "main window createOffer start");

  const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
  };
  peerConnectionMain.createOffer(
    offerOptions
  ).then(
    onCreateOfferSuccess,
    onCreateSessionDescriptionError
  );
}
function onCreateSessionDescriptionError(error) {
  ipcRenderer.send('log', "failed to create session description: " + error.toString());
}

/**
 * Send peer connection offer created to micro window.
 */
function onCreateOfferSuccess(desc) {
  ipcRenderer.send('log', "offer from main window\n" + desc.sdp);
  ipcRenderer.send('log', "main window setLocalDescription start");
  peerConnectionMain.setLocalDescription(desc).then(
    function() {
      ipcRenderer.send('log', "main window setLocalDescription complete");
    },
    function(error) {
      ipcRenderer.send('log', "failed to set session description: " + error.toString());
    }
  );

  const data = {type: desc.type, sdp: desc.sdp};
  ipcRenderer.send('mainWindowLocalDescriptionSet', data);
}
