let robot = require("robotjs");
const constants = require("../../modules/remotecontrol/constants");
const {EVENT_TYPES, PERMISSIONS_ACTIONS, REMOTE_CONTROL_EVENT_TYPE} = constants;

/**
 * Attaching to the window for debug purposes.
 * We should remove this in production.
 */
window.robot = robot;

/**
 * Width/Heught for the screen.
 */
const {width, height} = robot.getScreenSize();

/**
 * Mouse button mapping between the values in remote-control-event and robotjs
 * methods.
 */
const MOUSE_BUTTONS = {
    1: "left",
    2: "middle",
    3: "right"
};

/**
 * Mouse actions mapping between the values in remote-control-event and robotjs
 * methods.
 */
const MOUSE_ACTIONS_FROM_EVENT_TYPE = {
    "mousedown": "down",
    "mouseup": "up"
};

/**
 * Key actions mapping between the values in remote-control-event and robotjs
 * methods.
 */
const KEY_ACTIONS_FROM_EVENT_TYPE = {
    "keydown": "down",
    "keyup": "up"
};

/**
 * The status ("up"/"down") of the mouse button.
 * FIXME: Assuming that one button at a time can be pressed. Haven't noticed
 * any issues but maybe we should store the status for every mouse button
 * that we are processing.
 */
let mouseButtonStatus = "up";

/**
 * Parses the remote-control-events and executes them via robotjs.
 */
class RemoteControl {
    /**
     * Construcs new instance.
     * @constructor
     */
    constructor() {
        this.started = false;
    }

    /**
     * Initializes the remote control functionality.
     */
    init(channel, windowManager) {
        this.windowManager = windowManager;
        this.channel = channel;
        this.channel.ready(() => {
            this.channel.listen(REMOTE_CONTROL_EVENT_TYPE,
                event => this.onRemoteControlEvent(event));
            this.sendEvent({type: EVENT_TYPES.supported});
        });
    }

    /**
     * Disposes the remote control functionality.
     */
    dispose() {
        this.windowManager = null;
        this.channel = null;
        this.stop();
    }

    /**
     * Handles permission requests from Jitsi Meet.
     * @param {object} userInfo - information about the user that has requested
     * permissions:
     * @param {string} userInfo.displayName - display name
     * @param {string} userInfo.userJID - the JID of the user.
     * @param {string} userInfo.userId - the user id (the resource of the JID)
     * @param {boolean} userInfo.screenSharing - true if the screen sharing
     * is started.
     */
    handlePermissionRequest(userInfo) {
        this.windowManager.requestRemoteControlPermissions(userInfo)
            .then(result => {
                this.sendEvent({
                    type: EVENT_TYPES.permissions,
                    action: result ? PERMISSIONS_ACTIONS.grant
                        : PERMISSIONS_ACTIONS.deny,
                    userId: userInfo.userId
                });
                if(result) {
                    this.start();
                }
            }).catch(e => {
                console.error(e);
            });
    }

    /**
     * Starts processing the events.
     */
    start() {
        this.started = true;
    }

    /**
     * Stops processing the events.
     */
    stop() {
        this.started = false;
    }

    /**
     * Executes the passed event.
     * @param {Object} event the remote-control-event.
     */
    onRemoteControlEvent(event) {
        if(!this.started && event.type !== EVENT_TYPES.permissions) {
            return;
        }
        switch(event.type) {
            case EVENT_TYPES.mousemove: {
                const x = event.x * width, y = event.y * height;
                if(mouseButtonStatus === "down") {
                    robot.dragMouse(x, y);
                } else {
                    robot.moveMouse(x, y);
                }
                break;
            }
            case EVENT_TYPES.mousedown:
            case EVENT_TYPES.mouseup: {
                mouseButtonStatus = MOUSE_ACTIONS_FROM_EVENT_TYPE[event.type];
                robot.mouseToggle(
                    mouseButtonStatus,
                    (event.button ? MOUSE_BUTTONS[event.button] : undefined));
                break;
            }
            case EVENT_TYPES.mousedblclick: {
                robot.mouseClick(
                    (event.button ? MOUSE_BUTTONS[event.button] : undefined),
                    true);
                break;
            }
            case EVENT_TYPES.mousescroll:{
                //FIXME: implement horizontal scrolling
                if(event.y !== 0) {
                    robot.scrollMouse(
                        Math.abs(event.y),
                        event.y > 0 ? "down" : "up"
                    );
                }
                break;
            }
            case EVENT_TYPES.keydown:
            case EVENT_TYPES.keyup: {
                robot.keyToggle(event.key,
                    KEY_ACTIONS_FROM_EVENT_TYPE[event.type], event.modifiers);
                break;
            }
            case EVENT_TYPES.permissions: {
                if(event.action !== PERMISSIONS_ACTIONS.request)
                    break;

                //Open Dialog and answer
                this.handlePermissionRequest({
                    userId: event.userId,
                    userJID: event.userJID,
                    displayName: event.displayName,
                    screenSharing: event.screenSharing
                });
                break;
            }
            case EVENT_TYPES.stop: {
                this.stop();
                break;
            }
            default:
                console.error("Unknown event type!");
        }
    }

    /**
     * Sends remote control event to the controlled participant.
     * @param {Object} event the remote control event.
     */
    sendEvent(event) {
        this.channel.send({
            method: REMOTE_CONTROL_EVENT_TYPE,
            params: event
        });
    }
}

module.exports = new RemoteControl();
