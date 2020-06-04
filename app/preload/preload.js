const createElectronStorage = require('redux-persist-electron-storage');
const { shell } = require('electron');
const os = require('os');
const url = require('url');

const jitsiMeetElectronUtils = require('jitsi-meet-electron-utils');


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
    jitsiMeetElectronUtils
};
