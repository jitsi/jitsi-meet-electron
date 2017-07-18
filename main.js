/* global __dirname, process */
//Electron includes
const electron = require("electron");
const APP = electron.app;
const BrowserWindow = electron.BrowserWindow;
const p2pChannel = require("./modules/micromodeconnection").main;
// const p2pChannel = require("electron-peer-connection").main;
const path = require("path");
const url = require("url");

/**
 * URL for index.html which will be our entry point.
 */
const indexURL = url.format({
    pathname: path.join(__dirname, "windows", "jitsi-meet", "index.html"),
    protocol: "file:",
    slashes: true
});

/**
 * URL for micro.html which will be the Micro mode's window.
 */
const microModeURL = url.format({
    pathname: path.join(__dirname, "windows", "jitsi-meet", "micro.html"),
    protocol: "file:",
    slashes: true
});

/**
 * The window object that will load the iframe with Jitsi Meet.
 * IMPORTANT: Must be defined as global in order to not be garbage collected
 * acidentally.
 */
let jitsiMeetWindow = null;
let microWindow = null;

/**
 * Options used when creating the main Jitsi Meet window.
 */
const jitsiMeetWindowOptions = {
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hidden',
    webPreferences: { experimentalFeatures: true }
};

/**
 * Options used when creating the micro mode window.
 */
const microWindowOptions = {
    width: 320,
    height: 240,
    titleBarStyle: 'hidden',
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    x: 1570,
    y: 50
};

/**
 * Sets the APP object listeners.
 */
function setAPPListeners () {
    APP.on("ready", createJitsiMeetWindow);
    APP.on("window-all-closed", () => {
        // Don"t quit the application for Mac OS
        if (process.platform !== "darwin") {
            APP.quit();
        }
    });
    APP.on("activate", () => {
        if (jitsiMeetWindow === null) {
            createJitsiMeetWindow();
        }
    });
    APP.on('certificate-error',
        (event, webContents, url, error, certificate, callback) => {
            if (url.startsWith('https://localhost')) {
                event.preventDefault();
                callback(true);
            } else {
                callback(false);
            }
        }
    );
}

/**
 * Opens new window with index.html(Jitsi Meet is loaded in iframe there).
 */
function createJitsiMeetWindow () {
  jitsiMeetWindow = new BrowserWindow(jitsiMeetWindowOptions);
  jitsiMeetWindow.loadURL(indexURL);

  p2pChannel.initChannel();
  p2pChannel.addClient( { window: jitsiMeetWindow, name: 'jitsiMeetWindow' } );

  jitsiMeetWindow.webContents.on('new-window', function(event, url) {
      event.preventDefault();
      electron.shell.openExternal(url);
  });

  /*
  this event is supposed to be 'minimize' instead of 'blur',
  but currently microWindow's video doesnt work when main window is minimized
  TODO: Figure out how to keep main window's video active when minimized
  */
  jitsiMeetWindow.on('blur', function () {
      if (microWindow) {
          microWindow.show();
      } else {
          microWindow = new BrowserWindow(microWindowOptions);
          microWindow.loadURL(microModeURL);
          p2pChannel.addClient( { window: microWindow, name: 'microWindow' } );
          microWindow.show();
          microWindow.webContents.on('did-finish-load', function() {
            jitsiMeetWindow.webContents.send('hide');
          });
      }
  });

  // jitsiMeetWindow.on('focus', function () {
  //     if (microWindow){
  //         microWindow.hide();
  //     }
  // });

  jitsiMeetWindow.on("closed", () => {
      jitsiMeetWindow = null;
      microWindow = null;
  });

  // setIPCListeners();
}

/**
 * Sets the ipc listeners for messages from renderer processes
 */
// function setIPCListeners() {
//     p2pChannel.initChannel();
//     p2pChannel.addClient( { window: jitsiMeetWindow, name: 'jitsiMeetWindow' } );
//     p2pChannel.addClient( { window: microWindow, name: 'microWindow' } );
// }

//Start the application:
setAPPListeners();
