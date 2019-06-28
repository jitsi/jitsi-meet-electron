/* global __dirname, process */

const {
    BrowserWindow,
    Menu,
    app,
    shell,
    ipcMain
} = require('electron');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
const windowStateKeeper = require('electron-window-state');
const {
    initPopupsConfigurationMain,
    getPopupTarget,
    setupAlwaysOnTopMain
} = require('jitsi-meet-electron-utils');
const path = require('path');
const URL = require('url');
const Store = require('electron-store');
const STORE_KEY_PREFIX = require('redux-persist').KEY_PREFIX;
const appConfig = require('./app/features/config/index').default;

autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

/**
 * When in development mode:
 * - Load debug utilities (don't open the DevTools window by default though)
 * - Enable automatic reloads
 */
if (isDev) {
    require('electron-debug')({ showDevTools: false });
    require('electron-reload')(path.join(__dirname, 'build'));
}

/**
 * The window object that will load the iframe with Jitsi Meet.
 * IMPORTANT: Must be defined as global in order to not be garbage collected
 * acidentally.
 */
let mainWindow = null;

/**
 * Add protocol data
 */
const PROTOCOL_PREFIX = 'jitsi'; // this could be configurable later
const PROTOCOL_SURPLUS = `${PROTOCOL_PREFIX}://`;
let canSendProtocolDataToRenderer = false;
let protocolDataForFrontApp = null;

/**
 * Save always on top to store
 * Note:
 *  this is reading from same store as before
 *  but now we are using persist store to stay in sync :)
 */
const store = new Store();

/**
 * Sets the application menu. It is hidden on all platforms except macOS because
 * otherwise copy and paste functionality is not available.
 */
function setApplicationMenu() {
    if (process.platform === 'darwin') {
        const template = [ {
            label: app.getName(),
            submenu: [ {
                label: 'Quit',
                accelerator: 'Command+Q',
                click() {
                    app.quit();
                }
            } ]
        }, {
            label: 'Edit',
            submenu: [ {
                label: 'Undo',
                accelerator: 'CmdOrCtrl+Z',
                selector: 'undo:'
            },
            {
                label: 'Redo',
                accelerator: 'Shift+CmdOrCtrl+Z',
                selector: 'redo:'
            },
            {
                type: 'separator'
            },
            {
                label: 'Cut',
                accelerator: 'CmdOrCtrl+X',
                selector: 'cut:'
            },
            {
                label: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                selector: 'copy:'
            },
            {
                label: 'Paste',
                accelerator: 'CmdOrCtrl+V',
                selector: 'paste:'
            },
            {
                label: 'Select All',
                accelerator: 'CmdOrCtrl+A',
                selector: 'selectAll:'
            }
            ]
        } ];

        Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    } else {
        Menu.setApplicationMenu(null);
    }
}

/**
 * Opens new window with index.html(Jitsi Meet is loaded in iframe there).
 */
function createJitsiMeetWindow() {
    // Application menu.
    setApplicationMenu();

    // Check for Updates.
    autoUpdater.checkForUpdatesAndNotify();

    // Load the previous window state with fallback to defaults.
    const windowState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 600
    });

    // Path to root directory.
    const basePath = isDev ? __dirname : app.getAppPath();

    // URL for index.html which will be our entry point.
    const indexURL = URL.format({
        pathname: path.resolve(basePath, './build/index.html'),
        protocol: 'file:',
        slashes: true
    });

    // Options used when creating the main Jitsi Meet window.
    const options = {
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
        icon: path.resolve(basePath, './resources/icons/icon_512x512.png'),
        minWidth: 800,
        minHeight: 600,
        show: false,
        webPreferences: {
            nativeWindowOpen: true
        }
    };

    mainWindow = new BrowserWindow(options);
    windowState.manage(mainWindow);
    mainWindow.loadURL(indexURL);

    const isWindowAlwaysOnTop = getWindowAlwaysOnTopFromStore();

    if (isWindowAlwaysOnTop) {
        initPopupsConfigurationMain(mainWindow);
        setupAlwaysOnTopMain(mainWindow);
    }

    mainWindow.webContents.on('new-window', (event, url, frameName) => {
        event.preventDefault();
        const target = getPopupTarget(url, frameName);

        if (!target || target === 'browser') {
            // ignore open if don't want window
            if (isWindowAlwaysOnTop) {
                shell.openExternal(url);
            }
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    /**
     * This is for windows [win32]
     * so when someone tries to enter something like jitsi://test
     *  while app is closed
     * it will trigger this event below
     */
    handleProtocolCall(process.argv[2]);
}

/**
 * Handler when protocol call us
 * if there is second argument and it starts
 * with PROTOCOL_PREFIX+ "://" its what we need
 *
 * create conference object and send it to front app
 */
function handleProtocolCall(fullProtocolCall) {
    // don't touch when something is bad
    if (
        !fullProtocolCall
        || fullProtocolCall.trim() === ''
        || fullProtocolCall.indexOf(PROTOCOL_SURPLUS) !== 0
    ) {
        return;
    }
    const bigArgs = fullProtocolCall.replace(PROTOCOL_SURPLUS, '').split('/');
    const args = [ bigArgs[0], bigArgs.slice(1).join('/') ];

    if (args.length === 0 || !args[0]) {
        return;
    }

    const data = {
        room: args[0],
        serverURL: args[1]
    };

    protocolDataForFrontApp = data;
    if (canSendProtocolDataToRenderer) {
        mainWindow
            .webContents
            .send('protocol-data-msg', protocolDataForFrontApp);
    }
}

/**
 * One place and logic how to get WindowAllwaysOnTop from local store
 *
 * There is currently limitation
 * persist data is typeof string
 * so we cannot just do `store.get('a.b.c');
 */
function getWindowAlwaysOnTopFromStore() {
    const storeConfig = appConfig.storage;
    const persistStore = store.get(`${STORE_KEY_PREFIX}${storeConfig.rootKey}`);
    const defaultValue = appConfig.defaults.windowAlwaysOnTop;

    try {
        const parsedStore = JSON.parse(persistStore) || {};
        const settings = parsedStore[storeConfig.settingsKey]
            ? JSON.parse(parsedStore[storeConfig.settingsKey])
            : {};
        const value = settings[storeConfig.windowAlwaysOnTopKey];

        return value === undefined ? defaultValue : value;
    } catch (e) {
        // track if error occurred
        if (!isDev) {
            autoUpdater.logger.error(e.message);
        }
    }

    return defaultValue;
}

/**
 * Force Single Instance Application.
 */
const gotInstanceLock = app.requestSingleInstanceLock();

if (!gotInstanceLock) {
    app.quit();
    process.exit(0);
}

/**
 * Run the application.
 */

app.on('activate', () => {
    if (mainWindow === null) {
        createJitsiMeetWindow();
    }
});

app.on('certificate-error',
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

app.on('ready', createJitsiMeetWindow);

app.on('second-instance', () => {
    /**
     * If someone creates second instance of the application, set focus on
     * existing window.
     */
    if (mainWindow) {
        mainWindow.isMinimized() && mainWindow.restore();
        mainWindow.focus();
    }
});

app.on('window-all-closed', () => {
    // Don't quit the application on macOS.
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// remove so we can register each time as we run the app.
app.removeAsDefaultProtocolClient(PROTOCOL_PREFIX);

// If we are running a non-packaged version of the app && on windows
if (isDev && process.platform === 'win32') {
    // Set the path of electron.exe and your app.
    // These two additional parameters are only available on windows.
    app.setAsDefaultProtocolClient(
        PROTOCOL_PREFIX,
        process.execPath,
        [ path.resolve(process.argv[1]) ]
    );
} else {
    app.setAsDefaultProtocolClient(PROTOCOL_PREFIX);
}

/**
 * This is for mac [darwin]
 * so when someone tries to enter something like jitsi://test
 * it will trigger this event below
 */
app.on('open-url', (event, data) => {
    event.preventDefault();
    handleProtocolCall(data);
});

/**
 * This is for windows [win32]
 * so when someone tries to enter something like jitsi://test
 *  while app is opened
 * it will trigger this event below
 */
app.on('second-instance', (event, commandLine) => {
    if (mainWindow) {
        handleProtocolCall(commandLine[2]);
    }
});

/**
 * This is our own event
 * to notify main.js [this]
 * that front app is ready to receive
 * conference room and change to it
 */
ipcMain.on('renderer-ready', () => {
    canSendProtocolDataToRenderer = true;
    if (protocolDataForFrontApp) {
        mainWindow
            .webContents
            .send('protocol-data-msg', protocolDataForFrontApp);
    }
});
