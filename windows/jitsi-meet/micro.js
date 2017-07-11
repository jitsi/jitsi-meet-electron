// const WindowPeerConnection = require("electron-peer-connection").WindowPeerConnection;
const WindowPeerConnection = require("../../modules/micromodeconnection").WindowPeerConnection;

/**
 * The remote video from main window.
 */
let largeVideo = document.querySelector("video");

//Prepares micro mode once main window is ready.
let microWindow = new WindowPeerConnection('microWindow');
microWindow.onReceivedStream(function (stream) {
    largeVideo.srcObject = stream;
});
