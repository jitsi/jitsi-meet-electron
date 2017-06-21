const {ipcRenderer} = require('electron');

/**
 * The RTCPeerConnection to main window.
 */
let peerConnectionMicro;

/**
 * The remote video from main window.
 */
let largeVideo = document.createElement('video');
largeVideo.setAttribute('id', 'remoteVideo');
largeVideo.setAttribute('autoplay', true);
largeVideo.setAttribute('width', '100%');
largeVideo.setAttribute('height', '100%');
document.body.appendChild(largeVideo);

//Prepares micro mode once main window is ready.
initMicroMode();

/**
 * Initiates ipc listners for messages from the main window.
 */
function initMicroMode() {
  ipcRenderer.on('mainWindowPeerCreated', () => {
    createPeerConnection();
  });
  ipcRenderer.on('mainWindowLocalDescriptionSet', (event, desc) => {
    createAnswer(desc);
  });
}

/**
 * Creates RTCPeerConnection object and set ice candidate listneres.
 */
function createPeerConnection() {
  peerConnectionMicro = new RTCPeerConnection();
  ipcRenderer.send('log', "created micro window peer connection object");

  ipcRenderer.on('mainWindowIceCandidate', (event, candidate) => {
    peerConnectionMicro.addIceCandidate(candidate)
    .then(
      function() {
        ipcRenderer.send('log', 'micro window addIceCandidate success');
      },
      function(err) {
        ipcRenderer.send('log', 'micro window failed to add ICE Candidate: '
                                + err.toString());
      });
  });

  peerConnectionMicro.onicecandidate = function(event) {
    if(event.candidate !== null) {
      let newIceCandidate = {
        candidate: event.candidate.candidate,
        sdpMLineIndex: event.candidate.sdpMLineIndex,
        sdpMid: event.candidate.sdpMid
      };
      ipcRenderer.send('microWindowIceCandidate', newIceCandidate);
    }
  };
  peerConnectionMicro.oniceconnectionstatechange = function(event) {
    if (peerConnectionMicro) {
      ipcRenderer.send('log', "micro window iceCandidateState change event: " + event);
    }
  };
  peerConnectionMicro.ontrack = gotRemoteStream;

  ipcRenderer.send("microWindowPeerCreated");
}

/**
 * Attaches MediaStream object received from peer connection on local largeVideo.
 */
function gotRemoteStream(event) {
  if (largeVideo.srcObject !== event.streams[0]) {
    largeVideo.srcObject = event.streams[0];
  }
}

/**
 * Creates peer connection answer to main window.
 */
function createAnswer(data) {
  ipcRenderer.send('log', "micro window setRemoteDescription start");
  let desc = new RTCSessionDescription(data);
  peerConnectionMicro.setRemoteDescription(desc).then(
    function() {
      ipcRenderer.send('log', "micro window setRemoteDescription complete");
    },
    function(error) {
      ipcRenderer.send('log', "micro window failed to set session description: "
                              + error.toString());
    }
  );

  ipcRenderer.send('log', 'micro window createAnswer start');
  peerConnectionMicro.createAnswer().then(
    onCreateAnswerSuccess,
    onCreateSessionDescriptionError
  );
}
function onCreateSessionDescriptionError(error) {
  ipcRenderer.send('log', "micro window failed to create session description: " + error.toString());
}

/**
 * Sends peer connection answer to main window.
 */
function onCreateAnswerSuccess(desc) {
  ipcRenderer.send('log', "answer from main window:\n" + desc.sdp);
  ipcRenderer.send('log', 'micro window setLocalDescription start');
  peerConnectionMicro.setLocalDescription(desc).then(
    function() {
      ipcRenderer.send('log', "micro window setLocalDescription complete");
    },
    function(error) {
      ipcRenderer.send('log', "micro window failed to set session description: " + error.toString());
    }
  );

  const data = {type: desc.type, sdp: desc.sdp};
  ipcRenderer.send('microWindowLocalDescriptionSet', data);
}
