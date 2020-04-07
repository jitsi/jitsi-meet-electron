const createElectronStorage = require('redux-persist-electron-storage');
const { shell } = require('electron');
const os = require('os');

const jitsiMeetElectronUtils = require('jitsi-meet-electron-utils');

window.jitsiNodeAPI = {
    createElectronStorage,
    osUserInfo: os.userInfo,
    shellOpenExternal: shell.openExternal,
    jitsiMeetElectronUtils
};

