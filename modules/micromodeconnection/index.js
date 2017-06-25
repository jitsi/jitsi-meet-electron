const {ipcRenderer} = require('electron');

module.exports.main = connectToMicroWindow;
module.exports.micro = initMicroConnection;

/**
 * Log in main process terminal
 */
function log(message) {
    ipcRenderer.send('log', message);
}

/*-------------------------------Main Window----------------------------------*/
let peerConnectionMain;
let localStream;

/**
 * Connects main window's components to micro mode window.
 * @param {object} stream - MediaStream object from the jitsi-meet conference
 */
function connectToMicroWindow(stream) {
    log("received local stream and sending");
    localStream = stream;

    setUpMainConnection();

    ipcRenderer.on('microWindowPeerCreated', () => {
        localStream.getTracks().forEach(
            function(track) {
                peerConnectionMain.addTrack(
                    track,
                    localStream
                );
            }
        );
        log("added local stream to peer connection");
        createAndSendOffer();
    });

    ipcRenderer.on('microWindowLocalDescriptionSet', (event, data) => {
        const desc = new RTCSessionDescription(data);
        log('main window setRemoteDescription start');
        peerConnectionMain.setRemoteDescription(desc).then(
            function() {
                log("main window setRemoteDescription complete");
            },
            function(err) {
                log('main window failed to set session description: '+err.toString());
            }
        );
    });
}

/**
 * Creates main window's RTCPeerConnection object and set ice candidate listneres.
 */
function setUpMainConnection() {
    peerConnectionMain = new RTCPeerConnection();
    log("created main window peer connection object");

    ipcRenderer.on('microWindowIceCandidate', (event, candidate) => {
        peerConnectionMain.addIceCandidate(candidate)
        .then(
            function() {
                log('main window addIceCandidate success');
            },
            function(err) {
                log('main window failed to add ICE Candidate: '+err.toString());
            }
        );
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
            log("main window iceCandidateState change event: ", event);
        }
    };

    sendMessageToMicroWindow('mainWindowPeerCreated', null);
}

/**
 * Creates peer connection offer to micro window.
 */
function createAndSendOffer() {
    log("main window createOffer start");

    const offerOptions = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
    };
    peerConnectionMain.createOffer(
        offerOptions
    ).then(
        onCreateOfferSuccess,
        onCreateOfferError
    );
}
function onCreateOfferError(error) {
    log("main window failed to create session description: "+error.toString());
}

/**
 * Sends peer connection offer created to micro window.
 */
function onCreateOfferSuccess(desc) {
    log("offer from main window\n" + desc.sdp);
    log("main window setLocalDescription start");
    peerConnectionMain.setLocalDescription(desc).then(
        function() {
            log("main window setLocalDescription complete");
        },
        function(error) {
            log("failed to set session description: "+error.toString());
        }
    );

    const data = {type: desc.type, sdp: desc.sdp};
    sendMessageToMicroWindow('mainWindowLocalDescriptionSet', data);
}

/**
 * Sends message from main window to mircro window.
 */
function sendMessageToMicroWindow(message, data) {
  args = [];
  args[0] = message;
  args[1] = data;
    ipcRenderer.send('mainWindowEvent', args);
}


/*------------------------------Micro Window----------------------------------*/
let peerConnectionMicro;
let remoteVideo;

/**
 * Initiates ipc listners for messages from the main window.
 * @param {object} video - video object on the micro window.
 */
function initMicroConnection(video) {
    remoteVideo = video;
    ipcRenderer.on('mainWindowPeerCreated', () => {
        setupMicroConnection();
    });
    ipcRenderer.on('mainWindowLocalDescriptionSet', (event, desc) => {
        createAnswer(desc);
    });
}

/**
 * Creates micro window's RTCPeerConnection object and set ice candidate listneres.
 */
function setupMicroConnection() {
    peerConnectionMicro = new RTCPeerConnection();
    log("created micro window peer connection object");

    ipcRenderer.on('mainWindowIceCandidate', (event, candidate) => {
        peerConnectionMicro.addIceCandidate(candidate)
        .then(
            function() {
                log('micro window addIceCandidate success');
            },
            function(err) {
                log('micro window failed to add ICE Candidate: '+err.toString());
            });
    });

    peerConnectionMicro.onicecandidate = function(event) {
        if(event.candidate !== null) {
            const newIceCandidate = {
                candidate: event.candidate.candidate,
                sdpMLineIndex: event.candidate.sdpMLineIndex,
                sdpMid: event.candidate.sdpMid
            };
            sendMessageToMainWindow('microWindowIceCandidate', newIceCandidate);
        }
    };
    peerConnectionMicro.oniceconnectionstatechange = function(event) {
        if (peerConnectionMicro) {
            log("micro window iceCandidateState change event: " + event);
        }
    };
    peerConnectionMicro.ontrack = gotRemoteStream;

    sendMessageToMainWindow('microWindowPeerCreated', null);
}

/**
 * Attaches MediaStream object received from main window on remoteVideo.
 */
function gotRemoteStream(event) {
    if (remoteVideo.srcObject !== event.streams[0]) {
        remoteVideo.srcObject = event.streams[0];
    }
}

/**
 * Creates peer connection answer to main window.
 */
function createAnswer(data) {
    log("micro window setRemoteDescription start");
    let desc = new RTCSessionDescription(data);
    peerConnectionMicro.setRemoteDescription(desc).then(
      function() {
        log("micro window setRemoteDescription complete");
      },
      function(error) {
        log("micro window failed to set session description: "+error.toString());
      }
    );

    log('micro window createAnswer start');
    peerConnectionMicro.createAnswer().then(
      onCreateAnswerSuccess,
      onCreateAnswerError
    );
}
function onCreateAnswerError(error) {
    log("micro window failed to create session description: "+error.toString());
}

/**
 * Sends peer connection answer to main window.
 */
function onCreateAnswerSuccess(desc) {
    log("answer from main window:\n" + desc.sdp);
    log('micro window setLocalDescription start');
    peerConnectionMicro.setLocalDescription(desc).then(
      function() {
        log("micro window setLocalDescription complete");
      },
      function(error) {
        log("micro window failed to set session description: "+error.toString());
      }
    );

    const data = {type: desc.type, sdp: desc.sdp};
    sendMessageToMainWindow('microWindowLocalDescriptionSet', data);
}

/**
 * Sends message from micro window to main window.
 */
function sendMessageToMainWindow(message, data) {
    args = [];
    args[0] = message;
    args[1] = data;
    ipcRenderer.send('microWindowEvent', args);
}
