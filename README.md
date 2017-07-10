Jitsi Meet Electron
====
Electron application for [Jitsi Meet](https://github.com/jitsi/jitsi-meet).

## Configuration
You can change the Jitsi Meet deployment url with the jitsiMeetURL property
from config.js

## Building the sources
```bash
npm install
```

## Working with the [jitsi-meet-electron-utils](https://github.com/jitsi/jitsi-meet-electron-utils) sources
By default the jitsi-meet-electron-utils is build from its git repository sources. The default dependency path in package.json is :
```json
"jitsi-meet-electron-utils": "jitsi/jitsi-meet-electron-utils"
```

To work with local copy you must change the path to:
```json
"jitsi-meet-electron-utils": "file:///Users/name/jitsi-meet-electron-utils-copy",
```

To make the project you must force it to take the sources as `npm update` will not do it.
```bash
npm install jitsi-meet-electron-utils --force
node_modules/.bin/electron-rebuild
```

NOTE: Also check jitsi-meet-electron-utils's [README](https://github.com/jitsi/jitsi-meet-electron-utils/blob/master/README.md) to see how to configure your environment.

## Statring the application
```bash
npm start
```

## Discuss
Please use the [Jitsi dev mailing list](http://lists.jitsi.org/pipermail/dev/) to discuss feature requests before opening an issue on Github.
