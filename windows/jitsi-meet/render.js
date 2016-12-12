const remoteControl = require("../../modules/remotecontrol");
let postis = require("postis");
const setupScreenSharingForWindow = require("../../modules/screensharing");
const config = require("../../config.js");

/**
 * The postis channel.
 */
let channel;

/**
 * Cteates the iframe that will load Jitsi Meet.
 */
let iframe = document.createElement('iframe');
iframe.src = config.jitsiMeetURL;
iframe.allowFullscreen = true;
iframe.onload = onload;
document.body.appendChild(iframe);

/**
 * Initializes the remote control functionality.
 */
function initRemoteControl() {
    remoteControl.start();
    channel.ready(() =>
        channel.listen('remote-control-event',
            event => remoteControl.executeRemoteControlEvent(event))
    );
}

/**
 * Handles loaded event for iframe:
 * Enables screen sharing functionality to the iframe webpage.
 * Initializes postis.
 * Initializes remote control.
 */
function onload() {
    setupScreenSharingForWindow(iframe.contentWindow);
    channel = postis({
        window: iframe.contentWindow,
        windowForEventListening: window
    });
    initRemoteControl();
}
