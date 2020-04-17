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
    window.jitsiNodeAPI.openExternalLink(link);
}


/**
 * Get URL, extract room name from it and create a Conference object.
 *
 * @param {string} inputURL - Combined server url with room separated by /.
 * @returns {Object}
 */
export function createConferenceObjectFromURL(inputURL: string) {
    const lastIndexOfSlash = inputURL.lastIndexOf('/');
    let room;
    let serverURL;

    if (lastIndexOfSlash === -1) {
        // This must be only the room name.
        room = inputURL;
    } else {
        // Take the substring after last slash to be the room name.
        room = inputURL.substring(lastIndexOfSlash + 1);

        // Take the substring before last slash to be the Server URL.
        serverURL = inputURL.substring(0, lastIndexOfSlash);

        // Normalize the server URL.
        serverURL = normalizeServerURL(serverURL);
    }

    // Don't navigate if no room was specified.
    if (!room) {
        return;
    }

    return {
        room,
        serverURL
    };
}
