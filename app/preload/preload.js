const createElectronStorage = require('redux-persist-electron-storage');
const { ipcRenderer, shell } = require('electron');
const os = require('os');
const url = require('url');

const jitsiMeetElectronUtils = require('jitsi-meet-electron-utils');

const whitelistedIpcChannels = [ 'protocol-data-msg', 'renderer-ready' ];

const protocolRegex = /^https?:/i;

/**
 * Opens the given link in an external browser.
 *
 * @param {string} link - The link (URL) that should be opened in the external browser.
 * @returns {void}
 */
function openExternalLink(link) {
    let u;

    try {
        u = url.parse(link);
    } catch (e) {
        return;
    }

    if (protocolRegex.test(u.protocol)) {
        shell.openExternal(link);
    }
}

window.jitsiNodeAPI = {
    createElectronStorage,
    osUserInfo: os.userInfo,
    openExternalLink,
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
