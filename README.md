# Jitsi Meet Electron

Desktop application for [Jitsi Meet] built with [Electron].

## Download

[Linux (AppImage)](https://github.com/csett86/jitsi-meet-electron/releases/latest/download/jitsi-meet-x86_64.AppImage) | [Mac (dmg)](https://github.com/csett86/jitsi-meet-electron/releases/latest/download/jitsi-meet.dmg) | [Windows (exe)](https://github.com/csett86/jitsi-meet-electron/releases/latest/download/jitsi-meet.exe)

![](screenshot.png)

## Features

- Works with any Jitsi Meet deployment
- Local settings
- Builtin auto-updates
- Remote control
- Always-On-Top window

## Installation

Download our [latest release] and you're off to the races! The supported platforms
are macOS, Windows, and GNU/Linux (all 64bits only).

<details><summary>NOTE for old GNU/Linux distributions</summary>

You might get the following error:

```
FATAL:nss_util.cc(632)] NSS_VersionCheck("3.26") failed. NSS >= 3.26 is required.
Please upgrade to the latest NSS, and if you still get this error, contact your
distribution maintainer.
```

If you do, please install NSS (example for Debian / Ubuntu):

```bash
sudo apt-get install libnss3
```

</details>

### Homebrew

For *MacOS* user, you can install the application using the following command:

```
brew cask install jitsi-meet
```

### Using it with your own Jitsi Meet installation

In order to use this application with your own Jitsi Meet installation it's
necessary to enable the External API. Your server must serve a `external_api.js`
file at the root of the installation.

Here is an example using nginx:

```
location /external_api.js {
    alias /usr/share/jitsi-meet/libs/external_api.min.js;
}
```

The following additional HTTP header are known not work with the Electron App:

```
Content-Security-Policy "frame-ancestors 'none'";
X-Frame-Options "DENY";
```

## Development

If you want to hack on this project, here is how you do it.

<details><summary>Show building instructions</summary>

#### Installing dependencies

```bash
npm install
```

#### Starting in development mode

```bash
npm start
```

#### Building the production distribution

```bash
npm run dist
```

#### Working with jitsi-meet-electron-utils

[jitsi-meet-electron-utils] is a helper package which implements many features
such as remote control and the always-on-top window. If new features are to be
added / tested, running with a local version of these utils is very handy, here
is how to do that.

By default the jitsi-meet-electron-utils is build from its git repository
sources. The default dependency path in package.json is:

```json
"jitsi-meet-electron-utils": "jitsi/jitsi-meet-electron-utils"
```

To work with local copy you must change the path to:

```json
"jitsi-meet-electron-utils": "file:///Users/name/jitsi-meet-electron-utils-copy",
```

To build the project you must force it to take the sources as `npm update` will
not do it.

```bash
npm install jitsi-meet-electron-utils --force
```

NOTE: Also check the [jitsi-meet-electron-utils README] to see how to configure
your environment.

</details>

## License

Apache 2. See the [LICENSE] file.

## Community

Jitsi is built by a large community of developers, if you want to participate,
please join [community forum].

[Jitsi Meet]: https://github.com/jitsi/jitsi-meet
[Electron]: https://electronjs.org/
[latest release]: https://github.com/csett86/jitsi-meet-electron/releases/latest
[jitsi-meet-electron-utils]: https://github.com/jitsi/jitsi-meet-electron-utils
[jitsi-meet-electron-utils README]: https://github.com/jitsi/jitsi-meet-electron-utils/blob/master/README.md
[community forum]: https://community.jitsi.org/
[LICENSE]: LICENSE

