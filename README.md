# Das digitale Klassenzimmmer - HOPP Foundation

Repository für die Desktop-Anwendung des Digitalen Klassenzimmers für Jitsi Meet basierend auf Electron.

![](screenshot.png)

## Funktionen
- [Ende-zu-Ende Verschlüsslung](https://jitsi.org/blog/e2ee/) (BETA)
- Funktioniert mit jeder Jitsi Meet Instanz
- Automatische Updates über Microsoft Store, Mac App Store, Snap Store und Flathub
- Immer über andere Fenster-Modus (Always-on-top)
- Unterstützung von Direkt-Links wie `jitsi-meet://KlassenzimmerName`. Dies wird 'KlassenzimmerName` in einer neuen Jitsi Instanz öffnen. Oder aber jitsi-meet://jitsi.meineDomain.com/meinRaum` öffnet `meinRaum` auf der Jitsi Instanz von `jitsi.meineDomain.com

## Installation

| Windows | macOS | Linux |
| -- | -- | -- |
| [Microsoft Store](https://www.microsoft.com/de-de/p/digitales-klassenzimmer/9n9sf818473p) | [Mac App Store](https://apps.apple.com/de/app/digitales-klassenzimmer/id1508736201) | [Snap Store](https://snapcraft.io/digitales-klassenzimmer), [Flathub](https://flathub.org/apps/details/de.hoppfoundation.klassenzimmer), [AppImage](https://github.com/HoppFoundation/jitsi-meet-electron/releases/latest/download/digitales-klassenzimmer-x86_64.AppImage) |

### Nutzung mit einer eigenen Jitsi Meet-Installation

*Warnung*: Der folgende HTTP Header ist bekannt Fehler in der Electron Anwendung zu verursachen:

```
Content-Security-Policy "frame-ancestors [looks like any value is bad]";
X-Frame-Options "DENY";
X-Frame-Options "sameorigin";
```
Eine funktionierende Content Security Policy sieht so aus:
```
Content-Security-Policy "img-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-inline' 'wasm-eval'; style-src 'self' 'unsafe-inline'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none';";
```

## Bekannte Fehler

### GNU/Linux

Unter manchen Linux-Distributionen kann es vorkommen, wenn die Anwendung nicht automatisch ausgeführt werden kann, zusätzliche Rechte zum Ausführen für die Anwendung gesetzt werden müssen.

`chmod u+x ./digitales-klassenzimmer-x86_64.AppImage`

## Lizenz

[Apache 2 License](LICENSE).

[LICENSE]: LICENSE
