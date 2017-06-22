const initPeerConnection = require("../../modules/micromodeconnection").micro;

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
initPeerConnection(largeVideo);
