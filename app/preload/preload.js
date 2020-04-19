const createElectronStorage = require('redux-persist-electron-storage');
const { ipcRenderer, shell } = require('electron');
const os = require('os');

const jitsiMeetElectronUtils = require('jitsi-meet-electron-utils');

const whitelistedIpcChannels = [ 'protocol-data-msg', 'renderer-ready' ];

window.jitsiNodeAPI = {
    createElectronStorage,
    osUserInfo: os.userInfo,
    shellOpenExternal: shell.openExternal,
    jitsiMeetElectronUtils,
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
