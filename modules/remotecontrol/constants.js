module.exports = {
    /**
     * Types of remote-control-event events.
     */
    EVENT_TYPES: {
        mousemove: "mousemove",
        mousedown: "mousedown",
        mouseup: "mouseup",
        mousedblclick: "mousedblclick",
        mousescroll: "mousescroll",
        keydown: "keydown",
        keyup: "keyup",
        permissions: "permissions",
        stop: "stop",
        supported: "supported"
    },

    /**
     * Actions for the remote control permission events.
     */
    PERMISSIONS_ACTIONS: {
        request: "request",
        grant: "grant",
        deny: "deny"
    },

    /**
     * The type of remote control events sent trough the API module.
     */
    REMOTE_CONTROL_EVENT_TYPE: "remote-control-event"
};
