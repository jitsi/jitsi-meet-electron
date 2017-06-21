
const {ipcRenderer} = require('electron');


let pc2;
let video = document.createElement('video');
video.setAttribute('id', 'remoteVideo');
video.setAttribute('autoplay', true);
video.setAttribute('width', '100%');
video.setAttribute('height', '100%');
document.body.appendChild(video);

ipcRenderer.on('IceCandidate', () => {
  createPeerConnection();
});
ipcRenderer.on('setpc2Description', (event, desc) => {
  createAnswer(desc);
});

function createPeerConnection() {
  let servers = null;
  pc2 = new RTCPeerConnection(servers);
  ipcRenderer.send('log', Date.now()%1000 + ": " +"Created peer remote peer connection pc2");

  ipcRenderer.on('pc1IceCandidateCreated', (event, candidate) => {
    pc2.addIceCandidate(candidate)
    .then(
      function() {
        ipcRenderer.send('log', Date.now()%1000 + ": " +'pc1 addIceCandidate success');
      },
      function(err) {
        ipcRenderer.send('log', Date.now()%1000 + ": " +'pc1 failed to add ICE Candidate: ' + err.toString());
      });
  });

  pc2.onicecandidate = function(event) {
    if(event.candidate !== null) {
      ipcRenderer.send('log', Date.now()%1000 + ": " +"pc2 ICE CANDIDATE PUSHED: " + event.candidate);
      let newIceCandidate = {
        candidate: event.candidate.candidate,
        sdpMLineIndex: event.candidate.sdpMLineIndex,
        sdpMid: event.candidate.sdpMid
      };
      ipcRenderer.send('pc1IceCandidateCreated', newIceCandidate);
    }
  };
  pc2.oniceconnectionstatechange = function(event) {
    if (pc2) {
      ipcRenderer.send('log', Date.now()%1000 + ": " +"ICE state change event: " + event);
    }
  };
  pc2.ontrack = gotRemoteStream;

  ipcRenderer.send("pc2Created");
}

function gotRemoteStream(event) {
  if (video.srcObject !== event.streams[0]) {
    video.srcObject = event.streams[0];
  }

}

function createAnswer(data) {
  ipcRenderer.send('log', Date.now()%1000 + ": " +"pc2 setRemoteDescription start");
  let desc = new RTCSessionDescription(data);
  pc2.setRemoteDescription(desc).then(
    function() {
      ipcRenderer.send('log', Date.now()%1000 + ": " +"pc2 setRemoteDescription complete");
    },
    function(error) {
      ipcRenderer.send('log', Date.now()%1000 + ": " +"Failed to set session description: " + error.toString());
    }
  );

  ipcRenderer.send('log', Date.now()%1000 + ": " +'pc2 createAnswer start');
  pc2.createAnswer().then(
    onCreateAnswerSuccess,
    onCreateSessionDescriptionError
  );
}

function onCreateAnswerSuccess(desc) {
  ipcRenderer.send('log', Date.now()%1000 + ": " +"Answer from pc2:\n" + desc.sdp);
  ipcRenderer.send('log', Date.now()%1000 + ": " +'pc2 setLocalDescription start');
  pc2.setLocalDescription(desc).then(
    function() {
      ipcRenderer.send('log', Date.now()%1000 + ": " +"pc2 setLocalDescription complete");
    },
    function(error) {
      ipcRenderer.send('log', Date.now()%1000 + ": " +"Failed to set session description: " + error.toString());
    }
  );

  ipcRenderer.send('setpc1Description', {type: desc.type, sdp: desc.sdp});
}

function onCreateSessionDescriptionError(error) {
  ipcRenderer.send('log', Date.now()%1000 + ": " +"Failed to create session description: " + error.toString());
}
