// const WindowPeerConnection = require("electron-peer-connection").WindowPeerConnection;
const WindowPeerConnection = require("../../modules/micromodeconnection").WindowPeerConnection;
const ipcRenderer = require('electron').ipcRenderer;

/**
 * The remote video from main window.
 */
let largeVideo = document.querySelector("video");

//Prepares micro mode once main window is ready.
let microWindow = new WindowPeerConnection('microWindow');
microWindow.onReceivedStream(function (stream) {
    largeVideo.srcObject = stream;
});

let audioButton = document.getElementById('button-audioMute');
audioButton.onclick = toggleAudio;

let videoButton = document.getElementById('button-videoMute');
videoButton.onclick = toggleVideo;

let hangupButton = document.getElementById('button-hangup');
hangupButton.onclick = hangup;

function toggleAudio () {
    audioButton.classList.toggle('toggled');
    ipcRenderer.send('external_api', 'toggleAudio');
}

function toggleVideo () {
    videoButton.classList.toggle('toggled');
    ipcRenderer.send('external_api', 'toggleVideo');
}

function hangup () {
    ipcRenderer.send('external_api', 'hangup');
}
