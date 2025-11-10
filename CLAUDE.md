# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jitsi Meet Electron is a desktop application for Jitsi Meet built with Electron. It provides features like E2E encryption, screen sharing, always-on-top window, auto-updates, and deeplink support for conferencing.

## Development Commands

### Setup
- **Install dependencies**: `npm install`
  - Requires Node.js 22+ (see `.nvmrc`)
  - Linux requires: `libx11-dev zlib1g-dev libpng-dev libxtst-dev`
  - Windows requires: `windows-build-tools` (global install)

### Development
- **Start in development mode**: `npm start`
  - Runs webpack for main process, then starts concurrent watch + electron
  - Opens WebRTC internals window automatically in dev mode
- **Start with DevTools open**: `SHOW_DEV_TOOLS=true npm start` or `npm start -- --show-dev-tools`
- **Watch renderer changes**: `npm run watch` (runs automatically with `npm start`)

### Building
- **Lint code**: `npm run lint`
- **Fix lint issues**: `npm run lint-fix`
- **Build for production**: `npm run build` (compiles both main and renderer processes)
- **Create distribution**: `npm run dist` (runs build then electron-builder)
- **Clean build artifacts**: `npm run clean`

### CI Workflow
The CI runs on push/PR to master:
1. `npm ci` - Clean install
2. `npm run lint` - Linting (Linux only in CI)
3. `npm run dist` - Build distributables for all platforms

## Architecture

### Dual-Process Architecture
The application follows Electron's main/renderer process model:

**Main Process** (`main.js`):
- Entry point for Electron
- Manages BrowserWindow lifecycle
- Handles protocol calls (`jitsi-meet://` deeplinks)
- Configures security policies (CSP, file:// blocking, redirect filtering)
- Integrates `@jitsi/electron-sdk` features:
  - Remote control (controlled by `ENABLE_REMOTE_CONTROL` flag)
  - Always-on-top window
  - Screen sharing
  - Power monitor
  - Popup configuration
- Auto-update handling via `electron-updater`
- IPC communication with renderer

**Renderer Process** (`app/` directory):
- React application bundled via webpack
- Contains all UI components and business logic
- Uses `@jitsi/electron-sdk` via preload script (`app/preload/preload.js`)
- Communicates with main process via IPC

### Build System
Uses two separate webpack configurations:

**webpack.main.js**:
- Target: `electron-main`
- Bundles `main.js` and `app/preload/preload.js`
- Externalizes electron-specific dependencies

**webpack.renderer.js**:
- Target: `web` (renderer runs without node integration)
- Entry: `app/index.js`
- Uses Babel to transpile for specific Electron version
- Bundles React app with HTML generation via `HtmlWebpackPlugin`
- Handles CSS, SVG (via @svgr/webpack), and PNG assets
- Does NOT parse `external_api.js` (Jitsi Meet External API)

### Feature-Based Architecture
Code is organized by feature domain under `app/features/`:

```
app/features/
├── app/          - Root App component and routing
├── conference/   - Conference iframe and JitsiMeetExternalAPI integration
├── config/       - Application configuration constants
├── navbar/       - Navigation bar with settings and help
├── onboarding/   - User onboarding flow with spotlight
├── recent-list/  - Recent conference history
├── redux/        - Redux store, middleware, and root reducer
├── router/       - React Router integration with Redux
├── settings/     - Settings drawer with server URL, toggles, timeout
├── utils/        - Shared utilities (URL parsing, external link handling)
└── welcome/      - Welcome screen with room joining
```

Each feature typically includes:
- `components/` - React components
- `styled/` - Styled-components for styling
- `actions.js` & `actionTypes.js` - Redux actions
- `reducer.js` - Redux reducer
- `middleware.js` - Redux middleware (if needed)
- `index.js` - Public API exports

### State Management
Uses Redux with redux-persist:
- **Persisted state**: `onboarding`, `recentList`, `settings` (stored in localStorage)
- **Router integration**: `react-router-redux` for navigation
- **Middleware**: Custom middleware in `app/features/redux/middleware.js`

### Conference Integration
The `Conference` component (`app/features/conference/components/Conference.js`) is the core of the application:
- Creates iframe using `JitsiMeetExternalAPI` from `external_api.js`
- Handles meeting lifecycle events (`videoConferenceJoined`, `readyToClose`, `suspendDetected`)
- Configures Jitsi Meet via `configOverwrite` and `interfaceConfigOverwrite`
- Integrates with `@jitsi/electron-sdk` via `window.jitsiNodeAPI.setupRenderer()`
- Parses URL parameters and hash config overrides (e.g., `#config.startWithAudioMuted=true`)
- Implements loading timeout with configurable `serverTimeout`
- Supports remote control (controlled by `ENABLE_REMOTE_CONTROL` flag)

### Security Features
Implemented in `main.js`:
- Context isolation disabled for SDK integration (historical)
- CSP header modification to allow iframe embedding
- File URL access restricted to app base path
- Redirect blocking for non-web protocols
- External app opening blocked via permission handler
- Site isolation trials disabled (Electron issue workaround)

### Protocol Handling
Supports `jitsi-meet://` protocol for deeplinks:
- `jitsi-meet://myroom` - Opens room on default server
- `jitsi-meet://jitsi.example.com/myroom` - Opens room on specific server
- Handled via `handleProtocolCall()` in main process
- Single instance enforcement (except macOS via `LSMultipleInstancesProhibited`)

### Internationalization
Uses i18next with react-i18next:
- Translation files in `app/i18n/lang/`
- New translations require updating `app/i18n/index.js`
- Locale passed to Jitsi Meet iframe via URL parameters

## Working with @jitsi/electron-sdk

The project depends on `@jitsi/electron-sdk` for Electron-specific features. To develop with a local version:

1. Update `package.json` dependency path:
   ```json
   "@jitsi/electron-sdk": "file:///path/to/jitsi-meet-electron-sdk-copy"
   ```
2. Force install: `npm install @jitsi/electron-sdk --force`
3. See the SDK's README for environment configuration

## ESLint Configuration

Uses `@jitsi/eslint-config` with:
- Parser: `@babel/eslint-parser`
- React version: 17.0
- Presets: `@babel/preset-react`

## Platform-Specific Notes

### macOS
- Menu bar always visible (for copy/paste functionality)
- Signing/notarization handled in CI via secrets
- Universal binaries built (x86_64 + arm64)

### Linux
- AppImage and Deb packages for x86_64 and arm64
- PipeWire support enabled for Wayland screen sharing
- Requires libfuse2 on Ubuntu 22.04+

### Windows
- Single instance lock enforced
- Protocol handling via registry

## Release Process

Documented in README.md Publishing section:
1. Create release branch: `git checkout -b release-X-Y-Z`
2. Version bump: `npm version [patch|minor|major]`
3. Push and create PR: `gh pr create`
4. Create draft release: `gh release create vX.Y.Z --draft --title X.Y.Z`
5. Merge PR (triggers CI build)
6. Test binaries from draft release
7. Publish release when ready

## Key Dependencies

- **electron**: Desktop application framework (v37.6.0)
- **@jitsi/electron-sdk**: Jitsi-specific Electron utilities (v7.0.6)
- **react** & **react-dom**: UI framework (v17.0.2)
- **redux**: State management
- **@atlaskit/***: UI component library (buttons, toggles, spinners, navigation)
- **styled-components**: CSS-in-JS styling
- **electron-updater**: Auto-update functionality
- **electron-builder**: Application packaging

## Important Flags and Constants

- `ENABLE_REMOTE_CONTROL`: Must be enabled in both `main.js:34` and `Conference.js:18`
- `config.defaultServerURL`: Default Jitsi Meet server (meet.jit.si)
- `config.appProtocolPrefix`: Protocol scheme (jitsi-meet)
- `config.defaultServerTimeout`: Loading timeout in seconds (30)

## Common Patterns

### Adding a New Setting
1. Add action types in `app/features/settings/actionTypes.js`
2. Create actions in `app/features/settings/actions.js`
3. Update reducer in `app/features/settings/reducer.js`
4. Add UI component in `app/features/settings/components/`
5. Integrate in `SettingsDrawer.js`

### Adding Translations
1. Add translation keys to JSON files in `app/i18n/lang/`
2. Register new language in `app/i18n/index.js`
3. Update `Comment[lang]` in `package.json` for Linux desktop file

### Modifying Jitsi Meet Configuration
Edit `configOverwrite` or `interfaceConfigOverwrite` in `Conference.js:144-154`. These override Jitsi Meet's default config when loading the iframe.
