/* eslint-disable */
/* global process */
const remoteControl = require("../../modules/remotecontrol");
let postis = require("postis");
const setupScreenSharingForWindow = require("../../modules/screensharing");
const config = require("../../config.js");
const {dialog} = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const WindowPeerConnection = require("../../modules/micromodeconnection").WindowPeerConnection;
// const WindowPeerConnection = require("electron-peer-connection").WindowPeerConnection;

/**
 * The postis channel.
 */
let channel;

/**
 * Cteates the jitsimeetiframe that will load Jitsi Meet.
 */
 var options = {
     domain: config.jitsiMeetURL,
     room: "testurl",
     width: '100%',
     height: '100%'
 };
let JitsiMeetAPI = new JitsiMeetExternalAPI(config.jitsiMeetURL, options);

let jitsimeetiframe = document.querySelector('iframe');
jitsimeetiframe.onload = onload;

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
 * Handles loaded event for jitsimeetiframe:
 * Enables screen sharing functionality to the jitsimeetiframe webpage.
 * Initializes postis.
 * Initializes remote control.
 */
let largeVideo;
let mainWindow;
function onload() {
    largeVideo = jitsimeetiframe.contentWindow.document.getElementById("largeVideo");

    ipcRenderer.on('hide', () => {
        setupMicroModePeerConnection(largeVideo.srcObject);
    });

    largeVideo.ondurationchange = function() {
        if (mainWindow) {
            switchMicroVideo(largeVideo.srcObject);
        }
    };

    setupScreenSharingForWindow(jitsimeetiframe.contentWindow);
    jitsimeetiframe.contentWindow.onunload = onunload;
    channel = postis({
        window: jitsimeetiframe.contentWindow,
        windowForEventListening: window
    });
    remoteControl.init(
        channel,
        dialogFactory,
        config.handleRemoteControlAuthorization);
}

function setupMicroModePeerConnection (stream) {
    mainWindow = new WindowPeerConnection('jitsiMeetWindow');
    mainWindow.attachStream(stream);
    mainWindow.sendStream('microWindow');
}

function switchMicroVideo (stream) {
    mainWindow.removeStream();
    mainWindow.attachStream(stream);
    mainWindow.sendStream('microWindow');
}

/**
 * Create a copy of HTMLvideo in HTMLcanvas form
 * Get reference of the video, width and height as parameters
 * Return canvas object
 */
// function copyVideo(video, width, height, frameRate) {
//   let canvas = document.createElement('canvas');
//     canvas.width = width;
//     canvas.height = height;
//     let ctx = canvas.getContext('2d');
//     setInterval(function() {
//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//     }, frameRate);
//     return canvas;
// }

/**
 * Clears the postis objects and remoteControl.
 */
function onunload() {
    channel.destroy();
    channel = null;
    remoteControl.dispose();
}
