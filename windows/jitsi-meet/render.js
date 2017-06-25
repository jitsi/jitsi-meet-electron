/* global process */
const remoteControl = require("../../modules/remotecontrol");
let postis = require("postis");
const setupScreenSharingForWindow = require("../../modules/screensharing");
const config = require("../../config.js");
const {dialog} = require('electron').remote;
const microModePeerConnection = require("../../modules/micromodeconnection").main;

/**
 * The postis channel.
 */
let channel;

/**
 * Cteates the iframe that will load Jitsi Meet.
 */
let iframe = document.createElement('iframe');
iframe.src = process.env.JITSI_MEET_URL || config.jitsiMeetURL;
iframe.allowFullscreen = true;
iframe.onload = onload;
document.body.appendChild(iframe);

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
function onload() {
    largeVideo = iframe.contentWindow.document.getElementById("largeVideo");
    // iframe.setAttribute('style', 'width:50%; height:50%; border:0; border:none');

    const canvas = copyVideo(largeVideo, 400, 300);
    document.body.appendChild(canvas);
    const localStream = canvas.captureStream();
    microModePeerConnection(localStream);

    setupScreenSharingForWindow(iframe.contentWindow);
    iframe.contentWindow.onunload = onunload;
    channel = postis({
        window: iframe.contentWindow,
        windowForEventListening: window
    });
    remoteControl.init(
        channel,
        dialogFactory,
        config.handleRemoteControlAuthorization);
}

/**
 * Create a copy of HTMLvideo in HTMLcanvas form
 * Get reference of the video, width and height as parameters
 * Draw canvas every 33ms
 * Return canvas object
 */
function copyVideo(largeVideo, width, height) {
  let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext('2d');
    setInterval(function() {
      ctx.drawImage(largeVideo, 0, 0, canvas.width, canvas.height);
    }, 33);

    return canvas;
}

/**
 * Clears the postis objects and remoteControl.
 */
function onunload() {
    channel.destroy();
    channel = null;
    remoteControl.dispose();
}
