/* global process */
const utils = require("jitsi-meet-electron-utils");
const {
    RemoteControl,
    setupScreenSharingForWindow
} = utils;
const config = require("../../config.js");

/**
 * The remote control instance.
 */
let remoteControl;

/**
 * Cteates the iframe that will load Jitsi Meet.
 */
let iframe = document.createElement('iframe');
iframe.src = process.env.JITSI_MEET_URL || config.jitsiMeetURL;
iframe.allowFullscreen = true;
iframe.onload = onload;
document.body.appendChild(iframe);

/**
 * Handles loaded event for iframe:
 * Enables screen sharing functionality to the iframe webpage.
 * Initializes postis.
 * Initializes remote control.
 */
function onload() {
    setupScreenSharingForWindow(iframe.contentWindow);
    iframe.contentWindow.onunload = onunload;
    remoteControl = new RemoteControl(iframe);
}

/**
 * Clears the postis objects and remoteControl.
 */
function onunload() {
    remoteControl.dispose();
}
