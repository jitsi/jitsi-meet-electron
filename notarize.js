const { notarize } = require('electron-notarize');
const process = require('process');
const pkgJson = require('./package.json');

exports.default = async function notarizing(context) {
    const { electronPlatformName, appOutDir } = context;

    if (electronPlatformName !== 'darwin') {
        return;
    }

    if (!(process.env.APPLE_ID && process.env.APPLE_ID_PASSWORD && process.env.TEAM_ID)) {
        console.log('Skipping notarization');

        return;
    }

    const appName = context.packager.appInfo.productFilename;

    return await notarize({
        tool: 'notarytool',
        appBundleId: pkgJson.build.appId,
        appPath: `${appOutDir}/${appName}.app`,
        appleId: process.env.APPLE_ID,
        appleIdPassword: process.env.APPLE_ID_PASSWORD,
        teamId: process.env.TEAM_ID
    });
};
