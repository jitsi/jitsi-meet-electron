const electron = require("electron");
const BrowserWindow = electron.BrowserWindow;
let p2pChannel = require("../p2pconnection").main;
const {ipcMain} = require("electron");
const config = require("./config.js");


class Main {
    /**
     * Construcs new instance.
     * @constructor
    */
    constructor() {
        this.mainWindow = null;
        this.microWindow = null;
    }

    /**
     * Initializes the micro mode.
     * @param {BrowserWindow} mainWindow - BrowserWindow that contains Jitsi-meet iframe.
     * @param {String} windowName - Variable name of the main BrowserWindow.
     */
    init (mainWindow) {
        this.mainWindow = mainWindow;
        p2pChannel.initChannel();
        p2pChannel.addClient({
            window: mainWindow,
            name: config.mainWindowName
        });
    }

    /**
     * Hides the micro window.
     */
    show () {
        if (this.microWindow) {
            this.mainWindow.webContents.send('blurred');
            this.microWindow.show();
        } else {
            this.microWindow = new BrowserWindow(config.microWindowOptions);
            this.microWindow.loadURL(config.microModeURL);
            setMessageRelayChannel(this);
            const _this = this;
            p2pChannel.addClient({
                window: _this.microWindow,
                name: config.microWindowName
            });
            this.microWindow.webContents.on('did-finish-load', function() {
                _this.mainWindow.webContents.send('blurred');
                _this.microWindow.show();
            });
        }
    }

    /**
     * Shows the micro window.
     */
    hide () {
        if (this.microWindow){
            this.microWindow.hide();
        }
    }

    /**
     * Disposes the micro mode.
     */
    dispose () {
        p2pChannel.dispose();
        if (this.microWindow) {
            this.microWindow.close();
            this.microWindow = null;
        }
        ipcMain.removeAllListeners('microWindowHangup');
        ipcMain.removeAllListeners('external_api');
        ipcMain.removeAllListeners('videoStatus');
    }
}

function setMessageRelayChannel (_this) {
    ipcMain.on('microWindowHangup', () => {
        _this.dispose();
    });

    ipcMain.on('external_api', (event, message) => {
        if (_this.microWindow) {
            _this.mainWindow.webContents.send('external_api', message);
        }
    });

    ipcMain.on('videoStatus', (event, status) => {
        if (_this.microWindow) {
            _this.microWindow.webContents.send('videoStatus', status);
        }
    });
}

module.exports = new Main();