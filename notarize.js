const { notarize } = require('electron-notarize');
const process = require('process');
const pkgJson = require('./package.json');

exports.default = async function notarizing(context) {
    const { electronPlatformName, appOutDir } = context;

    if (electronPlatformName !== 'darwin') {
        return;
    }

    const appName = context.packager.appInfo.productFilename;
    const appPath = `${appOutDir}/${appName}.app`;

    if (process.env.APPLE_ID && process.env.APPLE_ID_PASSWORD && process.env.TEAM_ID) {
        console.log(`Notarizing ${appPath} with user & password`);

        return await notarize({
            tool: 'notarytool',
            appBundleId: pkgJson.build.appId,
            appPath,
            appleId: process.env.APPLE_ID,
            appleIdPassword: process.env.APPLE_ID_PASSWORD,
            teamId: process.env.TEAM_ID
        });
    } else if (process.env.API_KEY_FILE && process.env.API_KEY_ID && process.env.API_KEY_ISSUER_ID) {
        console.log(`Notarizing ${appPath} with API key`);

        return await notarize({
            tool: 'notarytool',
            appBundleId: pkgJson.build.appId,
            appPath,
            appleApiKey: process.env.API_KEY_FILE,
            appleApiKeyId: process.env.API_KEY_ID,
            appleApiIssuer: process.env.API_KEY_ISSUER_ID
        });
    }
    console.log('Skipping notarization');

    return;

};
