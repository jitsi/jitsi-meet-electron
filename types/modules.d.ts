// Ambient declarations for runtime dependencies that do not ship their own
// TypeScript types (and a couple of redux-persist subpaths that lack
// declarations). The shapes are intentionally minimal — only the surface the
// application actually uses is described.
//
// NOTE: This file must stay a "script" (no top-level import/export) so that the
// `declare module` blocks below are ambient module declarations rather than
// augmentations.

declare module '*.svg' {
    const content: import('react').FC<import('react').SVGProps<SVGSVGElement>>;

    export default content;
}

declare module '*.png' {
    const content: string;

    export default content;
}

declare module '*.css' {
    const content: Record<string, string>;

    export default content;
}

declare module '@jitsi/electron-sdk' {
    export function initPopupsConfigurationMain(window: any, windowOpenHandler?: any): void;
    export function getPopupTarget(url: string, frameName: string): string | undefined;
    export function setupPictureInPictureMain(window: any): void;
    export function setupRemoteControlMain(window: any): void;
    export function setupPowerMonitorMain(window: any): void;
    export function setupScreenSharingMain(window: any, appName: string, appId: string): void;

    export function initPopupsConfigurationRender(api: any): void;
    export function setupScreenSharingRender(api: any): void;
    export function setupPictureInPictureRender(api: any): void;
    export function setupRemoteControlRender(api: any): void;
    export function setupPowerMonitorRender(api: any): void;
}

declare module '@jitsi/js-utils/random' {
    export function generateRoomWithoutSeparator(): string;
}

declare module 'electron-context-menu' {
    const contextMenu: (options?: any) => void;

    export default contextMenu;
}

declare module 'electron-debug' {
    const debug: (options?: any) => void;

    export default debug;
}

declare module 'electron-is-dev' {
    const isDev: boolean;

    export default isDev;
}

declare module 'electron-reload' {
    const electronReload: (paths: string | string[], options?: any) => void;

    export default electronReload;
}

declare module 'redux-persist/lib/storage' {
    const storage: any;

    export default storage;
}

declare module 'redux-persist/integration/react' {
    import type { ComponentType, ReactNode } from 'react';
    import type { Persistor } from 'redux-persist';

    export const PersistGate: ComponentType<{
        children?: ReactNode;
        loading?: ReactNode;
        onBeforeLift?: () => void | Promise<void>;
        persistor: Persistor;
    }>;
}

// Mousetrap's global-bind plugin is a side-effect import that augments the
// Mousetrap instance with a bindGlobal method.
declare module 'mousetrap/plugins/global-bind/mousetrap-global-bind';

declare module 'mousetrap' {
    interface MousetrapStatic {
        bindGlobal(keys: string | string[], callback: (...args: any[]) => void, action?: string): void;
    }
}
