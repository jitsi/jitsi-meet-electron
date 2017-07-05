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
Since node_addons/sourceId2Coordinates add-on is local dependency, every code change requires increasing the version in its package.json. To rebuild the add-on if it is already installed execute:
```bash
npm update
```

## Statring the application
```bash
npm start
```

## Discuss
Please use the [Jitsi dev mailing list](http://lists.jitsi.org/pipermail/dev/) to discuss feature requests before opening an issue on Github.
