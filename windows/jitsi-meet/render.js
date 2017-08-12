/* global process, JitsiMeetExternalAPI */
const {
    RemoteControl,
    setupScreenSharingForWindow,
    setupAlwaysOnTopRender
} = require("jitsi-meet-electron-utils");
const { jitsiMeetDomain } = require("../../config.js");

/**
 * Loads a script from a specific source.
 *
 * @param src the source from the which the script is to be (down)loaded
 * @param loadCallback on load callback function
 * @param errorCallback callback to be called on error loading the script
 */
function loadScript(
        src,
        loadCallback = () => {},
        errorCallback = console.error) {
    const script = document.createElement('script');

    script.async = true;

    script.onload = loadCallback;
    script.onerror = errorCallback;
    script.src = src;
    document.head.appendChild(script);
}

loadScript(`https://${jitsiMeetDomain}/external_api.js`, () => {
    const api = new JitsiMeetExternalAPI(
        process.env.JITSI_MEET_DOMAIN || jitsiMeetDomain);
    const iframe = api.getIFrame();
    setupScreenSharingForWindow(iframe);
    new RemoteControl(iframe);
    setupAlwaysOnTopRender(api);
});
