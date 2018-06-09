/* global process */

// @flow

import { shell } from 'electron';
import md5 from 'js-md5';

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
 * Return true if Electron app is running on Mac system.
 *
 * @returns {boolean}
 */
export function isElectronMac() {
    return process.platform === 'darwin';
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
