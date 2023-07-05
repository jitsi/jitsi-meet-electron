# Jitsi Meet Electron

Desktop Anwendungen für HALLO vom Ev. Johanneswerk - basierend auf [Jitsi Meet](https://github.com/jitsi/jitsi-meet), gemacht mit [Electron](https://electronjs.org/).

![](screenshot.png)

## Features

* Automatische Updates
* Unterstützung von [End-to-End Encryption](https://jitsi.org/blog/e2ee/) (BETA)
* [HALLO](https://hallo.johanneswerk.de) ist als Server vorkonfiguriert
* Always-On-Top Fenster
* Unterstützung für Deeplinks wie `hallo://myroom` (öffnet `myroom` auf HALLO)

## Installation

Laden Sie unsere neueste Version herunter, und schon kann es losgehen!

| Windows | macOS | GNU/Linux (Deb) |
|---------|-------|-----------------|
| [Download](https://github.com/de-johannes/hallo-desktop/releases/latest/download/hallo-install.exe) | [Download](https://github.com/de-johannes/hallo-desktop/releases/latest/download/hallo-install.dmg) | [Download](https://github.com/de-johannes/hallo-desktop/releases/latest/download/hallo-install-amd64.deb) |

HINWEIS: Die GNU/LInux-Builds sind nur für 64-Bit Systeme geeignet.

## Bekannte Probleme

### Windows

Vor der Installation wird eine Warnung angezeigt, die besagt, dass die App nicht signiert ist. Sie können HALLO natürlich dennoch vertrauen.

### macOS

Unter macOS Catalina (und neuer) muss für die Installation muss wie folgt verfahren werden:

- Laden Sie HALLO.
- Verschieben Sie HALLO in Ihre Liste mit Programmen.
- Halten Sie die "Option"-Taste fest, machen Sie einen Rechtsklick auf die Datei und klicken Sie "Öffnen".
- Bestätigen Sie, dass Sie die Datei öffnen wollen.

### GNU/Linux

Wenn Sie die Datei nach dem Herunterladen nicht direkt ausführen können, versuchen Sie, `chmod u+x ./jitsi-meet-x86_64.AppImage` auszuführen

<details><summary>Hinweis für alte GNU/Linux-Distributionen</summary>

Sie könnten den folgenden Fehler erhalten:

```
FATAL:nss_util.cc(632)] NSS_VersionCheck("3.26") failed. NSS >= 3.26 is required.
Please upgrade to the latest NSS, and if you still get this error, contact your
distribution maintainer.
```

Wenn Sie dies tun, installieren Sie bitte NSS (Beispiel für Debian / Ubuntu):

```
sudo apt-get install libnss3
```

</details>

## License

Apache 2. See the [LICENSE](LICENSE) file.

## Community

Jitsi wird von einer großen Gemeinschaft von Entwicklern aufgebaut, wenn Sie sich beteiligen möchten,
sind Sie herzlich willkommen [community forum](https://community.jitsi.org/).
