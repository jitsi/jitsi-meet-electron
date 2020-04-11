/* global process */

// @flow

import config from '../config';

/**
 * Returns the URL of the external_api.js of the server.
 *
 * @param {string} serverURL - Jitsi Meet Server URL.
 * @returns {string} - The external_api.js URL.
 */
export function getExternalApiURL(serverURL: string) {
    if (!serverURL) {
        // eslint-disable-next-line no-param-reassign
        serverURL = config.defaultServerURL;
    }

    return `${normalizeServerURL(serverURL)}/external_api.js`;
}

/**
 * Return true if Electron app is running on Mac system.
 *
 * @returns {boolean}
 */
export function isElectronMac() {
    return process.platform === 'darwin';
}

/**
 * Normalizes the given server URL so it has the proper scheme.
 *
 * @param {string} url - URL with or without scheme.
 * @returns {string}
 */
export function normalizeServerURL(url: string) {
    // eslint-disable-next-line no-param-reassign
    url = url.trim();

    if (url && url.indexOf('://') === -1) {
        return `https://${url}`;
    }

    return url;
}

/**
 * Opens the provided link in default broswer.
 *
 * @param {string} link - Link to open outside the desktop app.
 * @returns {void}
 */
export function openExternalLink(link: string) {
    window.jitsiNodeAPI.shellOpenExternal(link);
}


/**
 * Get URL, extract room name from it and create a Conference object.
 *
 * @param {string} inputURL - Combined server url with room separated by /.
 * @returns {Object}
 */
export function createConferenceObjectFromURL(inputURL: string) {
    let room;

    // Remove trailing slahs if exists.
    if (inputURL.substr(-1) === '/') {
        inputURL = inputURL.substr(0, inputURL.length - 1); // eslint-disable-line no-param-reassign
    }

    // If we have more then a room name here,
    // we assume that the last one is a room name.
    if (inputURL.includes('/')) {
        room = inputURL.split('/').pop();
    } else {
        room = inputURL;
    }

    // Don't navigate if no room was specified.
    if (!room) {
        return;
    }

    return {
        room
    };
}
