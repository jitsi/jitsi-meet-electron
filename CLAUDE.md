# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jitsi Meet Electron is a desktop application for Jitsi Meet built with Electron. It provides features like E2E encryption, screen sharing, always-on-top window, auto-updates, and deeplink support for conferencing.

## Development Commands

### Setup
- **Install dependencies**: `npm install`
  - Requires Node.js 24+ (see `.nvmrc`)
  - Linux requires: `libx11-dev zlib1g-dev libpng-dev libxtst-dev`
  - Windows requires: `windows-build-tools` (global install)

### Development
- **Start in development mode**: `npm start`
  - Runs esbuild for the main, preload, and renderer bundles, then starts concurrent watch + electron
  - Opens WebRTC internals window automatically in dev mode
- **Start with DevTools open**: `SHOW_DEV_TOOLS=true npm start` or `npm start -- --show-dev-tools`
- **Watch renderer changes**: `npm run watch` (runs automatically with `npm start`)

### Building
- **Lint code**: `npm run lint` (ESLint over `.js`, `.ts`, `.tsx`)
- **Fix lint issues**: `npm run lint-fix`
- **Type-check**: `npm run type-check` (`tsc --noEmit`; esbuild itself does not type-check)
- **Build for production**: `npm run build` (runs `type-check` then esbuild for the main, preload, and renderer bundles)
- **Create distribution**: `npm run dist` (runs build then electron-builder)
- **Clean build artifacts**: `npm run clean`

The codebase is written in **TypeScript** (`.ts` / `.tsx`). esbuild strips types during bundling but does not check them, so type errors are caught by `npm run type-check` (and the type-aware ESLint pass), which `npm run build` runs first. The only remaining `.js` files are build tooling (`esbuild.js`, `.eslintrc.js`) and the vendored, pre-bundled `app/features/conference/external_api.js` (typed by an adjacent `external_api.d.ts`). Ambient type declarations live in `types/` (`global.d.ts` for the `window.jitsiElectronApp` global and `process.mas`; `modules.d.ts` for untyped deps and `*.svg`/`*.png`/`*.css` imports). Shared redux/state interfaces live in `app/types.ts` (`IState`, `IConference`, etc.).

### CI Workflow
The CI runs on push/PR to master:
1. `npm ci` - Clean install
2. `npm run lint` - Linting (Linux only in CI)
3. `npm run dist` - Build distributables for all platforms

## Architecture

### Dual-Process Architecture
The application follows Electron's main/renderer process model:

**Main Process** (`main.ts`):
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
- React application bundled via esbuild
- Contains all UI components and business logic
- Uses `@jitsi/electron-sdk` via preload script (`app/preload/preload.ts`)
- Communicates with main process via IPC

### Build System
A single esbuild script (`esbuild.js`) builds all three bundles into `build/`.
Run it directly with target/flag arguments:
- `node ./esbuild.js` — production build of everything
- `node ./esbuild.js --dev` — development build (unminified, inline sourcemaps)
- `node ./esbuild.js renderer --dev --watch` — watch/rebuild the renderer (this is `npm run watch`)
- `node ./esbuild.js main` — build only main + preload

**Main config** (`main` target):
- `platform: 'node'`, `format: 'cjs'`, `target: 'node22'`
- Bundles `main.ts` and `app/preload/preload.ts`
- Externalizes `electron` plus the runtime dependencies that ship in
  `node_modules` (`@jitsi/electron-sdk`, `electron-debug`, `electron-reload`);
  everything else (devDependencies used by the main process) is bundled in

**Renderer config** (`renderer` target):
- `platform: 'browser'`, `format: 'iife'`, `target: 'chrome120'`
- Entry: `app/index.tsx` → `build/app.js` (+ `build/app.css` from imported CSS)
- JSX lives in `.tsx` files; esbuild compiles TS/TSX natively (classic runtime, React in scope)
- `process.env.NODE_ENV` is injected via `define`; `global` is polyfilled via banner
- Custom esbuild plugins replace the old webpack loaders/plugins:
  - `svgr` — turns imported `.svg` files into React components (uses `@svgr/core`,
    replacing `@svgr/webpack`; options `dimensions: false`, `expandProps: 'start'`)
  - `external-api` — keeps the vendored, pre-bundled `external_api.js` usable
    (strips its dangling sourceMappingURL; stands in for webpack's `noParse`)
  - `html` — renders `index.html`/`meeting.html` from the `app/` templates and
    injects the `<link>`/`<script>` tags (replaces `HtmlWebpackPlugin`)

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
- `actions.ts` & `actionTypes.ts` - Redux actions
- `reducer.ts` - Redux reducer
- `middleware.ts` - Redux middleware (if needed)
- `index.ts` - Public API exports

### State Management
Uses Redux with redux-persist:
- **Persisted state**: `onboarding`, `recentList`, `settings` (stored in localStorage)
- **Router integration**: `react-router-redux` for navigation
- **Middleware**: Custom middleware in `app/features/redux/middleware.ts`

### Conference Integration
The `Conference` component (`app/features/conference/components/Conference.tsx`) is the core of the application:
- Creates iframe using `JitsiMeetExternalAPI` from `external_api.js`
- Handles meeting lifecycle events (`videoConferenceJoined`, `readyToClose`, `suspendDetected`)
- Configures Jitsi Meet via `configOverwrite` and `interfaceConfigOverwrite`
- Integrates with `@jitsi/electron-sdk` via its `/main`, `/preload`, and `/renderer` entry points (the renderer-side `setup*Render` helpers are called here with the `JitsiMeetExternalAPI` instance)
- Parses URL parameters and hash config overrides (e.g., `#config.startWithAudioMuted=true`)
- Implements loading timeout with configurable `serverTimeout`
- Supports remote control (controlled by `ENABLE_REMOTE_CONTROL` flag)

### Security Features
Implemented in `main.ts`:
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
- New translations require updating `app/i18n/index.ts`
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
- **esbuild**: Bundler for the main, preload, and renderer bundles (via `esbuild.js`)

## Important Flags and Constants

- `ENABLE_REMOTE_CONTROL`: Must be enabled in both `main.ts` and `app/features/conference/components/Conference.tsx`
- `config.defaultServerURL`: Default Jitsi Meet server (meet.jit.si)
- `config.appProtocolPrefix`: Protocol scheme (jitsi-meet)
- `config.defaultServerTimeout`: Loading timeout in seconds (30)

## Common Patterns

### Adding a New Setting
1. Add action types in `app/features/settings/actionTypes.ts`
2. Create actions in `app/features/settings/actions.ts`
3. Update reducer in `app/features/settings/reducer.ts`
4. Add UI component in `app/features/settings/components/`
5. Integrate in `SettingsDrawer.tsx`

### Adding Translations
1. Add translation keys to JSON files in `app/i18n/lang/`
2. Register new language in `app/i18n/index.ts`
3. Update `Comment[lang]` in `package.json` for Linux desktop file

### Modifying Jitsi Meet Configuration
Edit `configOverwrite` or `interfaceConfigOverwrite` in `Conference.tsx`. These override Jitsi Meet's default config when loading the iframe.
