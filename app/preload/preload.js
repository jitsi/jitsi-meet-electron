/* global process */

const createElectronStorage = require('redux-persist-electron-storage');
const { ipcRenderer } = require('electron');
const os = require('os');
const jitsiMeetElectronUtils = require('@jitsi/electron-sdk');
const { openExternalLink } = require('../features/utils/openExternalLink');


const whitelistedIpcChannels = [ 'protocol-data-msg', 'renderer-ready' ];

window.jitsiNodeAPI = {
    createElectronStorage,
    osUserInfo: os.userInfo,
    openExternalLink,
    platform: process.platform,
    jitsiMeetElectronUtils,
    electronStoreExists: ipcRenderer.sendSync('electron-store-exists'),
    ipc: {
        on: (channel, listener) => {
            if (!whitelistedIpcChannels.includes(channel)) {
                return;
            }

            return ipcRenderer.on(channel, listener);
        },
        send: channel => {
            if (!whitelistedIpcChannels.includes(channel)) {
                return;
            }

            return ipcRenderer.send(channel);
        },
        removeListener: (channel, listener) => {
            if (!whitelistedIpcChannels.includes(channel)) {
                return;
            }

            return ipcRenderer.removeListener(channel, listener);
        }
    }
};
