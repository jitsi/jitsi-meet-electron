/* global process */

// @flow

import { shell } from 'electron';
import md5 from 'js-md5';
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
    shell.openExternal(link);
}

/**
 * Returns the Avatar URL to be used.
 *
 * @param {string} key - Unique key to generate Avatar URL.
 * @returns {string}
 */
export function getAvatarURL({ email, id }: {
    email: string,
    id: string
}) {
    let key = email || id;
    let urlPrefix;
    let urlSuffix;

    // If the ID looks like an e-mail address, we'll use Gravatar because it
    // supports e-mail addresses.
    if (key && key.indexOf('@') > 0) {

        // URL prefix and suffix of gravatar service.
        urlPrefix = 'https://www.gravatar.com/avatar/';
        urlSuffix = '?d=wavatar&size=200';
    } else {
        key = id;

        // Otherwise, use a default (meeples, of course).
        urlPrefix = 'https://abotars.jitsi.net/meeple/';
        urlSuffix = '';
    }

    return urlPrefix + md5.hex(key.trim().toLowerCase()) + urlSuffix;
}
