const { shell } = require('electron');
const url = require('url');


/**
 * Opens the given link in an external browser.
 *
 * @param {string} link - The link (URL) that should be opened in the external browser.
 * @returns {void}
 */
export function openExternalLink(link) {
    let u;

    try {
        u = url.parse(link);
    } catch (e) {
        return;
    }

    const proto = u.protocol;
    const href = u.href;

    if (proto === 'http:' || proto === 'https:' || proto === 'mailto:') {
        shell.openExternal(href);
    }
}
