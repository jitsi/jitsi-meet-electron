const {WindowPeerConnection} = require("../p2pconnection");
const {ipcRenderer} = require("electron");
const config = require("./config.js");

class Render {
    /**
     * Construcs new instance.
     * @constructor
    */
    constructor() {
        this.jitsiMeetAPI = null;
        this.jitsiMeetWindow = null;
        this.largeVideo = null;
        this.p2pConnection = null;
    }

    /**
     * Initializes the micro mode.
     * @param {window} jitsiMeetAPI - JitsiMeetExternalAPI object.
     * @param {iframe} jitsiMeetIframe - iframe that contains Jitsi-meet application.
     */
    init (jitsiMeetAPI, jitsiMeetIframe) {
        this.jitsiMeetAPI = jitsiMeetAPI;
        this.jitsiMeetWindow = jitsiMeetIframe.contentWindow;
        this.largeVideo = this.jitsiMeetWindow.document.getElementById("largeVideo");
        this.p2pConnection = new WindowPeerConnection(config.mainWindowName);

        const _this = this;
        ipcRenderer.on('blurred', () => {
            sendLargeVideo(_this.jitsiMeetWindow, _this.p2pConnection, _this.largeVideo.srcObject);
        });

        ipcRenderer.on('external_api', (event, command) => {
            _this.jitsiMeetAPI.executeCommand(command);
        });

        this.largeVideo.ondurationchange = function() {
            if (_this.p2pConnection) {
                sendLargeVideo(_this.jitsiMeetWindow, _this.p2pConnection, _this.largeVideo.srcObject);
            }
        };
    }

    /**
     * Disposes the micro mode.
     */
    dispose () {
        ipcRenderer.removeAllListeners('blurred');
        ipcRenderer.removeAllListeners('external_api');
        this.jitsiMeetAPI = null;
        this.jitsiMeetWindow = null;
        this.largeVideo = null;
        this.p2pConnection = null;
    }
}

/**
 * Send or resend largeVideo to Micro window.
 * @param {womdpw} jitsiMeetWindow - Html window that contains Jitsi-meet application.
 * @param {WindowPeerConnection} p2pConnection - MediaStream object to send.
 * @param {MediaStream} stream - MediaStream object to send.
 */
function sendLargeVideo (jitsiMeetWindow, p2pConnection, stream) {
    p2pConnection.removeStream();
    p2pConnection.attachStream(stream);
    p2pConnection.sendStream(config.microWindowName);
    setMicroVideoStatus(jitsiMeetWindow);
}

/**
 * Sets toolbar buttons status in Micro window.
 */
function setMicroVideoStatus (jitsiMeetWindow) {
    let muteButton = jitsiMeetWindow.document.querySelector('#toolbar_button_mute');
    let videoButton = jitsiMeetWindow.document.querySelector('#toolbar_button_camera');
    let videoStatus = {
        audioMuted: false,
        videoMuted: false
    };
    if (muteButton.className.includes('toggled')) {
        videoStatus.audioMuted = true;
    }
    if (videoButton.className.includes('toggled')) {
        videoStatus.videoMuted = true;
    }
    ipcRenderer.send('videoStatus', (event, videoStatus));
}

module.exports = new Render();