let robot = require("robotjs");

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
    executeRemoteControlEvent(event) {
        if(!this.started) {
            return;
        }
        switch(event.type) {
            case "mousemove":
                const x = event.x * width, y = event.y * height;
                if(mouseButtonStatus === "down") {
                    robot.dragMouse(x, y);
                } else {
                    robot.moveMouse(x, y);
                }
                break;
            case "mousedown":
            case "mouseup":
                mouseButtonStatus = MOUSE_ACTIONS_FROM_EVENT_TYPE[event.type];
                robot.mouseToggle(
                    mouseButtonStatus,
                    (event.button ? MOUSE_BUTTONS[event.button] : undefined));
                break;
            case "mousedblclick":
                robot.mouseClick(
                    (event.button ? MOUSE_BUTTONS[event.button] : undefined),
                    true);
                break;
            case "mousescroll":
                //FIXME: implement horizontal scrolling 
                if(event.y !== 0) {
                    robot.scrollMouse(
                        Math.abs(event.y),
                        event.y > 0 ? "down" : "up"
                    );
                }
                break;
            case "keydown":
            case "keyup":
                robot.keyToggle(event.key,
                    KEY_ACTIONS_FROM_EVENT_TYPE[event.type], event.modifiers);
                break;
            default:
                console.error("Unknown event type!");
        }
    }
}

module.exports = new RemoteControl();
