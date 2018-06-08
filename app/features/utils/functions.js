/* global process */

// @flow

import { shell } from 'electron';

/**
 * Opens the provided link in default broswer.
 */
export function openExternalLink(link: string) {
    shell.openExternal(link);
}

/**
 * Return true if Electron app is running on Mac system.
 */
export function isElectronMac() {
    return process.platform === 'darwin';
}
