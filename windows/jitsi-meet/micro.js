const WindowPeerConnection = require("../../modules/micromodeconnection").WindowPeerConnection;
const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;

/**
 * The remote video from main window.
 */
let largeVideo = document.getElementById("remoteVideo");

/**
 * Toolbar Buttons.
 */
let audioButton = document.getElementById('button-audioMute');
audioButton.onclick = toggleAudio;
let videoButton = document.getElementById('button-videoMute');
videoButton.onclick = toggleVideo;
let hangupButton = document.getElementById('button-hangup');
hangupButton.onclick = hangup;

/**
 * Update toolbar buttons status.
 */
ipcRenderer.on('videoStatus', (event, status) => {
    if (status.audioMuted) {
        audioButton.classList.add('toggled');
    } else {
        audioButton.classList.remove('toggled');
    }
    if (status.videoMuted) {
        videoButton.classList.add('toggled');
    } else {
        videoButton.classList.remove('toggled');
    }
});

/**
 * Peer-to-peer connection on Micro window side.
 */
let microWindow = new WindowPeerConnection('microWindow');
microWindow.onReceivedStream(function (stream) {
    // videoFadeOut(largeVideo);
    largeVideo.srcObject = stream;
    // videoFadeIn(largeVideo);
});

// /**
//  * Fade in HTMLVideoElement.
//  */
// function videoFadeIn (video) {
//     let op = 0;
//     let timer = setInterval(function() {
//         if (op >= 1) clearInterval(timer);
//         largeVideo.style.opacity = op;
//         largeVideo.style.filter = 'alpha(opacity=' + op * 100 + ")";
//         op += op * 0.1 || 0.1;
//     }, 15);
// }

// /**
//  * Fade out HTMLVideoElement.
//  */
// function videoFadeOut (video) {
//     let op = 1;
//     let timer = setInterval(function() {
//         if (op <= 0) clearInterval(timer);
//         largeVideo.style.opacity = op;
//         largeVideo.style.filter = 'alpha(opacity=' + op * 100 + ")";
//         op -= op * 0.1 || 0.1;
//     }, 15);
// }

/**
 * Toggle audio in main jitsi-meet iframe.
 */
function toggleAudio () {
    audioButton.classList.toggle('toggled');
    ipcRenderer.send('external_api', 'toggleAudio');
}

/**
 * Toggle video in main jitsi-meet iframe.
 */
function toggleVideo () {
    videoButton.classList.toggle('toggled');
    ipcRenderer.send('external_api', 'toggleVideo');
}

/**
 * Hang up the call in main jitsi-meet iframe.
 */
function hangup () {
    ipcRenderer.send('external_api', 'hangup');
    ipcRenderer.send('microWindowHangup');
    remote.getCurrentWindow().close();
}
