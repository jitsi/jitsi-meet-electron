require('dotenv').config();
const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;  
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: 'io.assemblee.app',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
  });
};



//   const appName = "build/mac/Assemblee.app";
// console.log({
//     appBundleId: 'io.assemblee.app',
//     appPath: appName,
//     appleId: process.env.APPLEID,
//     appleIdPassword: process.env.APPLEIDPASS,
//   }x)
//   return notarize({
//     appBundleId: 'io.assemblee.app',
//     appPath: appName,
//     appleId: process.env.APPLEID,
//     appleIdPassword: process.env.APPLEIDPASS,
//   });