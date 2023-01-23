const { ipcRenderer } = require('electron');
const { RemoteControl,
    setupScreenSharingRender,
    setupAlwaysOnTopRender,
    initPopupsConfigurationRender,
    setupPowerMonitorRender
} = require('@jitsi/electron-sdk');
const { openExternalLink } = require('../features/utils/openExternalLink');

const whitelistedIpcChannels = [ 'protocol-data-msg', 'renderer-ready' ];

/**
 * Setup the renderer process.
 *
 * @param {*} api - API object.
 * @param {*} options - Options for what to enable.
 * @returns {void}
 */
function setupRenderer(api, options = {}) {
    initPopupsConfigurationRender(api);

    const iframe = api.getIFrame();

    setupScreenSharingRender(api);

    if (options.enableRemoteControl) {
        new RemoteControl(iframe); // eslint-disable-line no-new
    }

    // Allow window to be on top if enabled in settings
    if (options.enableAlwaysOnTopWindow) {
        setupAlwaysOnTopRender(api, null, { showOnPrejoin: true });
    }

    setupPowerMonitorRender(api);
}

window.jitsiNodeAPI = {
    openExternalLink,
    setupRenderer,
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
