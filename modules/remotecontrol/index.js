let robot = require("robotjs");
const sourceId2Coordinates = require("sourceId2Coordinates");
const electron = require("electron");
const constants = require("../../modules/remotecontrol/constants");
const { EVENTS, REQUESTS, REMOTE_CONTROL_MESSAGE_NAME } = constants;

/**
 * Attaching to the window for debug purposes.
 * We should remove this in production.
 */
window.robot = robot;

/**
 * Mouse button mapping between the values in remote control mouse event and
 * robotjs methods.
 */
const MOUSE_BUTTONS = {
    1: "left",
    2: "middle",
    3: "right"
};

/**
 * Mouse actions mapping between the values in remote control mouse event and
 * robotjs methods.
 */
const MOUSE_ACTIONS_FROM_EVENT_TYPE = {
    "mousedown": "down",
    "mouseup": "up"
};

/**
 * Key actions mapping between the values in remote control key event and
 * robotjs methods.
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
 * Parses the remote control events and executes them via robotjs.
 */
class RemoteControl {
    /**
     * Constructs new instance and initializes the remote control functionality.
     *
     * @param {Postis} channel the postis channel.
     */
    constructor(channel) {
        // TODO: if no channel is passed, create one.
        this.channel = channel;
        this.channel.ready(() => {
            this.channel.listen('message', message => {
                const { name } = message.data;
                if(name === REMOTE_CONTROL_MESSAGE_NAME) {
                    this.onRemoteControlMessage(message);
                }
            });
            this.sendEvent({ type: EVENTS.supported });
        });
    }

    /**
     * Disposes the remote control functionality.
     */
    dispose() {
        this.channel = null;
        this.stop();
    }

    /**
     * Handles remote control start messages.
     *
     * @param {number} id - the id of the request that will be used for the
     * response.
     * @param {string} sourceId - The source id of the desktop sharing stream.
     */
    start(id, sourceId) {
        const displays = electron.screen.getAllDisplays();

        switch(displays.length) {
            case 0:
                this.display = undefined;
            break;
            case 1:
                // On Linux probably we'll end up here even if there are
                // multiple monitors.
                this.display = displays[0];
            break;
            // eslint-disable-next-line no-case-declarations
            default: // > 1 display
                const coordinates = sourceId2Coordinates(sourceId);
                if(coordinates) {
                    // Currently sourceId2Coordinates will return undefined for
                    // any OS except Windows. This code will be executed only on
                    // Windows.
                    const { x, y } = coordinates;
                    this.display = electron.screen.getDisplayNearestPoint({
                        x: x + 1,
                        y: y + 1
                    });
                } else {
                    // On Mac OS the sourceId = 'screen' + displayId.
                    // Try to match displayId with sourceId.
                    const displayId = Number(sourceId.replace('screen:', ''));
                    this.display
                        = displays.find(display => display.id === displayId);
                }
        }

        const response = {
            id,
            type: 'response'
        };

        if(this.display) {
            response.result = true;
        } else {
            response.error
                = 'Error: Can\'t detect the display that is currently shared';
        }

        this.sendMessage(response);
    }

    /**
     * Stops processing the events.
     */
    stop() {
        this.display = undefined;
    }

    /**
     * Executes the passed message.
     * @param {Object} message the remote control message.
     */
    onRemoteControlMessage(message) {
        const { id, data } = message;

        // If we haven't set the display prop. We haven't received the remote
        // control start message or there was an error associating a display.
        if(!this.display
            && data.type != REQUESTS.start) {
            return;
        }
        switch(data.type) {
            case EVENTS.mousemove: {
                const { width, height, x, y } = this.display.workArea;
                const destX = data.x * width + x;
                const destY = data.y * height + y;
                if(mouseButtonStatus === "down") {
                    robot.dragMouse(destX, destY);
                } else {
                    robot.moveMouse(destX, destY);
                }
                break;
            }
            case EVENTS.mousedown:
            case EVENTS.mouseup: {
                mouseButtonStatus
                    = MOUSE_ACTIONS_FROM_EVENT_TYPE[data.type];
                robot.mouseToggle(
                    mouseButtonStatus,
                    (data.button
                            ? MOUSE_BUTTONS[data.button] : undefined));
                break;
            }
            case EVENTS.mousedblclick: {
                robot.mouseClick(
                    (data.button
                        ? MOUSE_BUTTONS[data.button] : undefined),
                    true);
                break;
            }
            case EVENTS.mousescroll:{
                //FIXME: implement horizontal scrolling
                if(data.y !== 0) {
                    robot.scrollMouse(
                        Math.abs(data.y),
                        data.y > 0 ? "down" : "up"
                    );
                }
                break;
            }
            case EVENTS.keydown:
            case EVENTS.keyup: {
                robot.keyToggle(
                    data.key,
                    KEY_ACTIONS_FROM_EVENT_TYPE[data.type],
                    data.modifiers);
                break;
            }
            case REQUESTS.start: {
                this.start(id, data.sourceId);
                break;
            }
            case EVENTS.stop: {
                this.stop();
                break;
            }
            default:
                console.error("Unknown event type!");
        }
    }

    /**
     * Sends remote control event to the controlled participant.
     *
     * @param {Object} event the remote control event.
     */
    sendEvent(event) {
        const remoteControlEvent = Object.assign(
            { name: REMOTE_CONTROL_MESSAGE_NAME },
            event
        );
        this.sendMessage({ data: remoteControlEvent });
    }

    /**
     * Sends a message to Jitsi Meet.
     *
     * @param {Object} message the message to be sent.
     */
    sendMessage(message) {
        this.channel.send({
            method: 'message',
            params: message
        });
    }
}

module.exports = RemoteControl;
