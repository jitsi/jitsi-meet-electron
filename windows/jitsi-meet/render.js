/* global process */
const remoteControl = require("../../modules/remotecontrol");
let postis = require("postis");
const setupScreenSharingForWindow = require("../../modules/screensharing");
const config = require("../../config.js");
const {dialog} = require('electron').remote;

/**
 * The postis channel.
 */
let channel;

/**
 * The jitsi-meet iframe.
 */
let iframe;

document.onkeydown = _onKeyDown;
function _onKeyDown (event) {
    if (event.keyCode === /* Enter */ 13) {
        onJoin();
    }
}

/**
 * Loads Jitsi-meet page in iframe with given room name.
 */
function onJoin () {
    document.onkeydown = null;
    const room_name = document.getElementById("enter_room_field").value;

    document.getElementById("welcome_page_main").classList.add("animated");
    document.getElementById("welcome_page_main").classList.add("fadeOutUpBig");

    createJitsiIframe(room_name);
}

/**
 * Cteates the iframe that will load Jitsi Meet.
 */
function createJitsiIframe(room_name) {
    iframe = document.createElement('iframe');
    iframe.src = (process.env.JITSI_MEET_URL || config.jitsiMeetURL) + room_name;
    iframe.allowFullscreen = true;
    iframe.onload = onload;
    document.body.appendChild(iframe);
}

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
function onload() {
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
 * Clears the postis objects and remoteControl.
 */
function onunload() {
    channel.destroy();
    channel = null;
    remoteControl.dispose();
}
