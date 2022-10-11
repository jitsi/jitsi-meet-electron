# Jitsi Meet Electron

Desktop application for [Jitsi Meet] built with [Electron].

![](screenshot.png)

## Features

- [End-to-End Encryption](https://jitsi.org/blog/e2ee/) support (BETA)
- Works with any Jitsi Meet deployment
- Builtin auto-updates
- ~Remote control~ (currently [disabled](https://github.com/jitsi/jitsi-meet-electron/issues/483) due to [security issues](https://github.com/jitsi/security-advisories/blob/master/advisories/JSA-2020-0001.md))
- Always-On-Top window
- Support for deeplinks such as `jitsi-meet://myroom` (will open `myroom` on the configured Jitsi instance) or `jitsi-meet://jitsi.mycompany.com/myroom` (will open `myroom` on the Jitsi instance running on `jitsi.mycompany.com`)

## Installation

Download our latest release and you're off to the races!

| Windows | macOS | GNU/Linux (AppImage) | GNU/Linux (Deb) |
| -- | -- | -- | -- |
| [Download](https://github.com/jitsi/jitsi-meet-electron/releases/latest/download/jitsi-meet.exe) | [Download](https://github.com/jitsi/jitsi-meet-electron/releases/latest/download/jitsi-meet.dmg) | [Download](https://github.com/jitsi/jitsi-meet-electron/releases/latest/download/jitsi-meet-x86_64.AppImage) | [Download](https://github.com/jitsi/jitsi-meet-electron/releases/latest/download/jitsi-meet-amd64.deb) |

NOTE: The GNU/LInux builds are 64-bit only.

### Third-Party builds

[<img src="https://flathub.org/assets/badges/flathub-badge-en.svg"
     alt="Download On Flathub"
     height="60">](https://flathub.org/apps/details/org.jitsi.jitsi-meet)

### Homebrew

For *macOS* user, you can install the application using the following command:

```
brew install --cask jitsi-meet
```

## Development

If you want to hack on this project, here is how you do it.

<details><summary>Show building instructions</summary>

#### Installing dependencies

Install Node.js 16 first (or if you use [nvm](https://github.com/nvm-sh/nvm), switch to Node.js 16 by running `nvm use`).

<details><summary>Extra dependencies for Windows</summary>

```bash
npm install --global --production windows-build-tools
```
</details>

<details><summary>Extra dependencies for GNU/Linux</summary>

X11, PNG and zlib development packages are necessary. On Debian-like systems then can be installed as follows:

```bash
sudo apt install libx11-dev zlib1g-dev libpng-dev libxtst-dev
```
</details>

Install all required packages:

```bash
npm install
```

#### Starting in development mode

```bash
npm start
```

The debugger tools are available when running in dev mode and can be activated with keyboard shortcuts as defined here https://github.com/sindresorhus/electron-debug#features.

It can also be displayed automatically from the `SHOW_DEV_TOOLS` environment variable such as:

```bash
SHOW_DEV_TOOLS=true npm start
```

or from the application `--show-dev-tools` command line flag.

#### Building the production distribution

```bash
npm run dist
```

#### Working with jitsi-meet-electron-sdk

[jitsi-meet-electron-sdk] is a helper package which implements many features
such as remote control and the always-on-top window. If new features are to be
added / tested, running with a local version of these utils is very handy, here
is how to do that.

By default the @jitsi/electron-sdk is build from npm. The default dependency path in package.json is:

```json
"@jitsi/electron-sdk": "^3.0.0"
```

To work with local copy you must change the path to:

```json
"@jitsi/electron-sdk": "file:///Users/name/jitsi-meet-electron-sdk-copy",
```

To build the project you must force it to take the sources as `npm update` will
not do it.

```bash
npm install @jitsi/electron-sdk --force
```

NOTE: Also check the [jitsi-meet-electron-sdk README] to see how to configure
your environment.

#### Publishing

1. Create release branch: `git checkout -b release-1-2-3`, replacing 1-2-3 with the desired release version
2. Increment the version: `npm version patch`, replacing `patch` with `minor` or `major` as required
3. Push release branch to github: `git push -u origin release-1-2-3`
4. Create PR: `gh pr create`
5. Once PR is reviewed and ready to merge, create draft Github release: `gh release create v1.2.3 --draft --title 1.2.3`, replacing v1.2.3 and 1.2.3 with the desired release version
6. Merge PR
7. Github action will build binaries and attach to the draft release
8. Test binaries from draft release
9. If all tests are fine, publish draft release

</details>

## Known issues

### Windows

A warning will show up mentioning the app is unsigned upon first install. This is expected.

### macOS

On macOS Catalina a warning will be displayed on first install. The app won't open unless "open" is pressed. This dialog is only shown once.

### GNU/Linux

If after downloading it, you can't execute the file directly, try running `chmod u+x ./jitsi-meet-x86_64.AppImage`

On Ubuntu 22.04 the AppImage will fail with a fuse error (as AppImage uses libfuse2, while 22.04 already comes with libfuse3 by default):

```
dlopen(): error loading libfuse.so.2
```

To fix this, install libfuse2 as follows:

```
sudo apt install libfuse2
```

Under wayland, experimental native wayland support can be enabled with the command-line switch `--ozone-platform-hint` set to `auto`:

```
./jitsi-meet-x86_64.AppImage --ozone-platform-hint=auto
```

Note that screensharing is currently not supported under wayland, eg. the permissions prompt may loop endlessly.

In case you experience a blank page after jitsi server upgrades, try removing the local cache files:

```
rm -rf ~/.config/Jitsi\ Meet/
```

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

## Translations

The json files are for all the strings inside the application and can be translated [here](/app/i18n/lang).

New translations require the addition of a line in [index.js](/app/i18n/index.js).

`Localize desktop file on linux` requires the addition of a line in [package.json](/package.json).
Please search for `Comment[hu]` as an example to help add your translation of the English string `Jitsi Meet Desktop App` for your language.

## License

Apache 2. See the [LICENSE] file.

## Community

Jitsi is built by a large community of developers, if you want to participate,
please join [community forum].

[Jitsi Meet]: https://github.com/jitsi/jitsi-meet
[Electron]: https://electronjs.org/
[latest release]: https://github.com/jitsi/jitsi-meet-electron/releases/latest
[jitsi-meet-electron-sdk]: https://github.com/jitsi/jitsi-meet-electron-sdk
[jitsi-meet-electron-sdk README]: https://github.com/jitsi/jitsi-meet-electron-sdk/blob/master/README.md
[community forum]: https://community.jitsi.org/
[LICENSE]: LICENSE
