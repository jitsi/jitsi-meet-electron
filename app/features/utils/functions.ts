import type { IConference } from '../../types';


/**
 * Normalizes the given server URL so it has the proper scheme.
 *
 * @param {string} url - URL with or without scheme.
 * @returns {string}
 */
export function normalizeServerURL(url: string): string {
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
export function openExternalLink(link: string): void {
    window.jitsiElectronApp.openExternalLink(link);
}


/**
 * Get URL, extract room name from it and create a Conference object.
 *
 * @param {string} inputURL - Combined server url with room separated by /.
 * @param {string} defaultServerURL - Server URL to use for room-only input.
 * @returns {IConference|undefined}
 */
export function createConferenceObjectFromURL(inputURL: string, defaultServerURL: string): IConference | undefined {
    const lastIndexOfSlash = inputURL.lastIndexOf('/');
    let room;
    let serverURL;

    if (lastIndexOfSlash === -1) {
        // This must be only the room name.
        room = inputURL;
        serverURL = normalizeServerURL(defaultServerURL || '');
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
