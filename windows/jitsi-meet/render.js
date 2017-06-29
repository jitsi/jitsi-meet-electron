/* global process */
const RemoteControl = require("../../modules/remotecontrol");
let postis = require("postis");
const setupScreenSharingForWindow = require("../../modules/screensharing");
const config = require("../../config.js");

/**
 * The postis channel.
 */
let channel;

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
    channel = postis({
        window: iframe.contentWindow,
        windowForEventListening: window
    });
    remoteControl = new RemoteControl(channel);
}

/**
 * Clears the postis objects and remoteControl.
 */
function onunload() {
    channel.destroy();
    channel = null;
    remoteControl.dispose();
}
