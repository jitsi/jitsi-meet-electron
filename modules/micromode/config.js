const url = require("url");
const path = require("path");

module.exports = {
    /**
     * Variable names of BrowserWindows, needed for message relay in main process.
     */
    mainWindowName: "jitsiMeetWindow",
    microWindowName: "microWindow",

    /**
     * The URL for micro.html which will be the Micro mode's window.
     */
    microModeURL: url.format({
        pathname: path.join(__dirname, "../..", "windows", "jitsi-meet", "micro.html"),
        protocol: "file:",
        slashes: true
    }),

    /**
     * Options used when creating the micro mode window.
     */
    microWindowOptions: {
        width: 320,
        height: 240,
        titleBarStyle: 'hidden',
        frame: false,
        show: false,
        alwaysOnTop: true,
        transparent: true,
        resizable: false,
        x: 1570,
        y: 50
    }
};