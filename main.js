/* global __dirname, process */

const electron = require('electron');
const isDev = require('electron-is-dev');
const windowStateKeeper = require('electron-window-state');
const {
    setupAlwaysOnTopMain,
    initPopupsConfigurationMain,
    getPopupTarget
} = require('jitsi-meet-electron-utils');
const path = require('path');
const URL = require('url');

const { app: APP, BrowserWindow, Menu } = electron;

/**
 * Load debug utilities (don't open the DevTools window by default though).
 */
require('electron-debug')({ showDevTools: false });

/**
 * Path to root directory
 */
const basePath = isDev ? __dirname : APP.getAppPath();

/**
 * URL for index.html which will be our entry point.
 */
const indexURL = URL.format({
    pathname: path.resolve(basePath, './build/index.html'),
    protocol: 'file:',
    slashes: true
});

/**
 * The window object that will load the iframe with Jitsi Meet.
 * IMPORTANT: Must be defined as global in order to not be garbage collected
 * acidentally.
 */
let jitsiMeetWindow = null;

/**
 * Sets the APP object listeners.
 */
function setAPPListeners() {
    APP.on('ready', createJitsiMeetWindow);
    APP.on('window-all-closed', () => {
        // Don't quit the application for macOS.
        if (process.platform !== 'darwin') {
            APP.quit();
        }
    });
    APP.on('activate', () => {
        if (jitsiMeetWindow === null) {
            createJitsiMeetWindow();
        }
    });
    APP.on('certificate-error',
        // eslint-disable-next-line max-params
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
function createJitsiMeetWindow() {
    Menu.setApplicationMenu(null);

    // Load the previous state with fallback to defaults
    const jitsiMeetWindowState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 600
    });

    // Options used when creating the main Jitsi Meet window.
    const jitsiMeetWindowOptions = {
        x: jitsiMeetWindowState.x,
        y: jitsiMeetWindowState.y,
        width: jitsiMeetWindowState.width,
        height: jitsiMeetWindowState.height,
        minWidth: 800,
        minHeight: 600,
        titleBarStyle: 'hidden',
        webPreferences: {
            nativeWindowOpen: true
        }
    };

    jitsiMeetWindow = new BrowserWindow(jitsiMeetWindowOptions);
    jitsiMeetWindowState.manage(jitsiMeetWindow);
    jitsiMeetWindow.loadURL(indexURL);
    initPopupsConfigurationMain(jitsiMeetWindow);

    jitsiMeetWindow.webContents.on('new-window', (event, url, frameName) => {
        const target = getPopupTarget(url, frameName);

        if (!target || target === 'browser') {
            event.preventDefault();
            electron.shell.openExternal(url);
        }
    });

    setupAlwaysOnTopMain(jitsiMeetWindow);

    jitsiMeetWindow.on('closed', () => {
        jitsiMeetWindow = null;
    });
}

//  Start the application:
setAPPListeners();
