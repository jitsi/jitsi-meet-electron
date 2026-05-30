import {
    initPopupsConfigurationRender,
    setupPictureInPictureRender,
    setupPowerMonitorRender,
    setupRemoteControlRender,
    setupScreenSharingRender
} from '@jitsi/electron-sdk';
import { IpcRendererEvent, ipcRenderer } from 'electron';

const whitelistedIpcChannels = [
    'protocol-data-msg',
    'renderer-ready',
    'restore-meeting-window',
    'open-meeting-window',
    'close-meeting-window',
    'navigate-to-conference'
];

ipcRenderer.setMaxListeners(0);

/**
 * Open an external URL.
 *
 * @param {string} url - The URL we with to open.
 * @returns {void}
 */
function openExternalLink(url: string): void {
    ipcRenderer.send('jitsi-open-url', url);
}

/**
 * Setup the renderer process.
 *
 * @param {*} api - API object.
 * @param {*} options - Options for what to enable.
 * @returns {void}
 */
function setupRenderer(
        api: any,
        options: { enableAlwaysOnTopWindow?: boolean; enableRemoteControl?: boolean; } = {}): void {
    initPopupsConfigurationRender(api);

    setupScreenSharingRender(api);

    if (options.enableRemoteControl) {
        setupRemoteControlRender(api);
    }

    if (options.enableAlwaysOnTopWindow) {
        setupPictureInPictureRender(api);
    }

    setupPowerMonitorRender(api);
}

window.jitsiNodeAPI = {
    openExternalLink,
    setupRenderer,
    ipc: {
        addListener: (channel: string, listener: (...args: any[]) => void) => {
            if (!whitelistedIpcChannels.includes(channel)) {
                return;
            }

            const cb = (_event: IpcRendererEvent, ...args: any[]) => {
                listener(...args);
            };

            const remove = () => {
                ipcRenderer.removeListener(channel, cb);
            };

            ipcRenderer.addListener(channel, cb);

            return remove;
        },
        send: (channel: string, ...args: any[]) => {
            if (!whitelistedIpcChannels.includes(channel)) {
                return;
            }

            ipcRenderer.send(channel, ...args);
        }
    }
};
