/* global process */

const { ipcRenderer } = require('electron');
const jitsiMeetElectronUtils = require('@jitsi/electron-sdk');
const { openExternalLink } = require('../features/utils/openExternalLink');


const whitelistedIpcChannels = [ 'protocol-data-msg', 'renderer-ready' ];

window.jitsiNodeAPI = {
    openExternalLink,
    platform: process.platform,
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
