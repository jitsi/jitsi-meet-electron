const electron = require("electron");
/**
 * Adds screen sharing support. Prompts the user to choose screen, window or
 * tab to share (not implemented yet). And passes the chosen source to caller
 * of the method.
 * @param {Function} callback the success callback
 * @param {Function} errorCallback the callback for errors
 */
function obtainDesktopStream (callback, errorCallback) {
    //FIXME: add more types
    electron.desktopCapturer.getSources({types: ['screen']},
        (error, sources) => {
            if (error) {
                errorCallback(error);
                return;
            }
            //FIXME: Implement window picker instead of choosing always the
            // first sourceId
            callback(sources[0].id);
        });
}

module.exports = function setupScreenSharingForWindow(pWindow) {
    pWindow.JitsiMeetElectron = {obtainDesktopStream};
};
