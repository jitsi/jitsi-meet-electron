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

let localStream;
let pc1;
function connectToPeer(stream) {
    ipcRenderer.send('log', Date.now()%1000 + ": " +"Received local stream and Sending");
    localStream = stream;
    let videoTracks = localStream.getVideoTracks();
    let audioTracks = localStream.getAudioTracks();
    if (videoTracks.length > 0) {
      ipcRenderer.send('log', Date.now()%1000 + ": " +'Using video device: ' + videoTracks[0].label);
    }
    if (audioTracks.length > 0) {
      ipcRenderer.send('log', Date.now()%1000 + ": " +'Using audio device: ' + audioTracks[0].label);
    }

    let servers = null;
    pc1 = new RTCPeerConnection(servers);
    ipcRenderer.send('log', Date.now()%1000 + ": " +"Created local peer connection object pc1");

    ipcRenderer.on('pc2IceCandidateCreated', (event, candidate) => {
      pc1.addIceCandidate(candidate)
      .then(
        function() {
          ipcRenderer.send('log', Date.now()%1000 + ": " +'pc1 addIceCandidate success');
        },
        function(err) {
          ipcRenderer.send('log', Date.now()%1000 + ": " +'pc1 failed to add ICE Candidate: ' + err.toString());
        });
    });

    pc1.onicecandidate = function(event) {
      if(event.candidate !== null) {
        ipcRenderer.send('log', Date.now()%1000 + ": " +"pc1 ICE CANDIDATE PUSHED: " + event.candidate);
        let newIceCandidate = {
          candidate: event.candidate.candidate,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          sdpMid: event.candidate.sdpMid
        };
        ipcRenderer.send('pc1IceCandidateCreated', newIceCandidate);
      }
    };
    pc1.oniceconnectionstatechange = function(event) {
      if (pc1) {
        ipcRenderer.send('log', Date.now()%1000 + ": " +"ICE state change event: ", event);
      }
    };
    ipcRenderer.send('IceCandidate');

    ipcRenderer.on('pc2Created', () => {
      localStream.getTracks().forEach(
        function(track) {
          pc1.addTrack(
            track,
            localStream
          );
        }
      );

      ipcRenderer.send('log', Date.now()%1000 + ": " +"Added local stream to pc1");

      ipcRenderer.send('log', Date.now()%1000 + ": " +"pc1 createOffer start");
      let offerOptions = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
      };
      pc1.createOffer(
        offerOptions
      ).then(
        onCreateOfferSuccess,
        onCreateSessionDescriptionError
      );
    });

  function onCreateOfferSuccess(desc) {
    ipcRenderer.send('log', Date.now()%1000 + ": " +"Offer from pc1\n" + desc.sdp);
    ipcRenderer.send('log', Date.now()%1000 + ": " +"pc1 setLocalDescription start");
    pc1.setLocalDescription(desc).then(
      function() {
        ipcRenderer.send('log', Date.now()%1000 + ": " +"pc1 setLocalDescription complete");
      },
      function(error) {
        ipcRenderer.send('log', Date.now()%1000 + ": " +"Failed to set session description: " + error.toString());
      }
    );

    ipcRenderer.send('setpc2Description', {type: desc.type, sdp: desc.sdp});
  }

  ipcRenderer.on('setpc1Description', (event, data) => {
    let desc = new RTCSessionDescription(data);
    ipcRenderer.send('log', Date.now()%1000 + ": " +'pc1 setRemoteDescription start');
    pc1.setRemoteDescription(desc).then(
      function() {
        ipcRenderer.send('log', Date.now()%1000 + ": " +"pc1 setRemoteDescription complete");
      },
      function(error) {
        ipcRenderer.send('log', Date.now()%1000 + ": " +'Failed to set session description: ' + error.toString());
      }
    );

  });

  function onCreateSessionDescriptionError(error) {
    ipcRenderer.send('log', Date.now()%1000 + ": " +"Failed to create session description: " + error.toString());
  }

}

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
    connectToPeer(largeVideo.srcObject);

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
