/* global __dirname, process */
//Electron includes
const electron = require("electron");
const APP = electron.app;
const BrowserWindow = electron.BrowserWindow;

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

const testURL = url.format({
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

/**
 * Options used when creating the main Jitsi Meet window.
 */
const jitsiMeetWindowOptions = {
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hidden'
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

  jitsiMeetWindow.webContents.on('new-window', function(event, url) {
      event.preventDefault();
      electron.shell.openExternal(url);
  });

  jitsiMeetWindow.on("closed", () => {
      jitsiMeetWindow = null;
  });

  let {ipcMain} = require('electron');

  let testWindow = new BrowserWindow({
      width: 800,
      height: 600,
      titleBarStyle: 'hidden',
      frame: true
  });
  testWindow.loadURL(testURL);

  // ipcMain.on('log', (event, data) => {
    // console.log(data);
  // });

  ipcMain.on('IceCandidate', () => {
    // console.log("IceCandidate Message Delivering...");
    testWindow.webContents.send('IceCandidate');
  });
  ipcMain.on('pc1IceCandidateCreated', (event, data) => {
    // console.log(data);
    testWindow.webContents.send('pc1IceCandidateCreated', data);
  });
  ipcMain.on('pc2IceCandidateCreated', (event, data) => {
    // console.log(data);
    testWindow.webContents.send('pc2IceCandidateCreated', data);
  });
  ipcMain.on('pc2Created', () => {
    // console.log("pc2Created Message Delivering...");
    jitsiMeetWindow.webContents.send('pc2Created');
  });
  ipcMain.on('setpc1Description', (event, desc) => {
    // console.log("setpc1Description Message Delivering...");
    jitsiMeetWindow.webContents.send('setpc1Description', desc);
  });
  ipcMain.on('setpc2Description', (event, desc) => {
    // console.log("setpc2Description Message Delivering...");
    testWindow.webContents.send('setpc2Description', desc);
  });
}

//Start the application:
setAPPListeners();
