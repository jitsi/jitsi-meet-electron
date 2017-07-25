/* eslint-disable */
/* global process */
const remoteControl = require("../../modules/remotecontrol");
let postis = require("postis");
const setupScreenSharingForWindow = require("../../modules/screensharing");
const config = require("../../config.js");
const {dialog} = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const WindowPeerConnection = require("../../modules/micromodeconnection").WindowPeerConnection;

/**
 * The postis channel.
 */
let channel;

/**
 * Cteates the iframe that will load Jitsi Meet.
 */
const domain = config.jitsiMeetURL;
const room = "testurl";
const width = '100%';
const height = '100%';
const htmlElement = undefined;
const configOverwrite = {};
const interfaceConfigOverwrite = {};
const jitsiMeetAPI = new JitsiMeetExternalAPI(domain, room, width, height,
    htmlElement, configOverwrite, interfaceConfigOverwrite);

const jitsiMeetIframe = document.querySelector('iframe');
jitsiMeetIframe.onload = onload;

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
let largeVideo;
let mainWindow;
function onload() {
    setupMicroWindow();
    setupScreenSharingForWindow(jitsiMeetIframe.contentWindow);
    jitsiMeetIframe.contentWindow.onunload = onunload;
    channel = postis({
        window: jitsiMeetIframe.contentWindow,
        windowForEventListening: window
    });
    remoteControl.init(
        channel,
        dialogFactory,
        config.handleRemoteControlAuthorization);
}

/**
 * Initializes Micro Mode.
 */
function setupMicroWindow() {
    largeVideo = jitsiMeetIframe.contentWindow.document.getElementById("largeVideo");

    ipcRenderer.on('blurred', (event, microWindowStatus) => {
        if (microWindowStatus === 'new') {
            setupMicroModePeerConnection(largeVideo.srcObject);
        }
        if (microWindowStatus === 'exist') {
            setMicroVideoStatus();
        }
    });

    ipcRenderer.on('external_api', (event, command) => {
      jitsiMeetAPI.executeCommand(command);
    });

    largeVideo.ondurationchange = function() {
        if (mainWindow) {
            switchMicroVideo(largeVideo.srcObject);
        }
    };
}

/**
 * Creates Micro window.
 */
function setupMicroModePeerConnection (stream) {
    mainWindow = new WindowPeerConnection('jitsiMeetWindow');
    mainWindow.attachStream(stream);
    mainWindow.sendStream('microWindow');
    setMicroVideoStatus();
}

/**
 * Sets toolbar buttons status in Micro window.
 */
function setMicroVideoStatus () {
    let jitsiMeetDocument = jitsiMeetIframe.contentWindow.document;
    let muteButton = jitsiMeetDocument.querySelector('#toolbar_button_mute');
    let videoButton = jitsiMeetDocument.querySelector('#toolbar_button_camera');
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

/**
 * LargeVideo transition in micro window.
 */
function switchMicroVideo (stream) {
    mainWindow.removeStream();
    mainWindow.attachStream(stream);
    mainWindow.sendStream('microWindow');
}

/**
 * Clears the postis objects and remoteControl.
 */
function onunload() {
    channel.destroy();
    channel = null;
    remoteControl.dispose();
    jitsiMeetAPI.dispose();
}
