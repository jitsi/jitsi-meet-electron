export {};

/**
 * Options accepted by {@code window.jitsiNodeAPI.setupRenderer}.
 */
interface IJitsiNodeAPISetupOptions {
    enableAlwaysOnTopWindow?: boolean;
    enableRemoteControl?: boolean;
}

/**
 * The API exposed on {@code window} by the preload script
 * ({@code app/preload/preload.ts}).
 */
interface IJitsiNodeAPI {
    ipc: {
        addListener(channel: string, listener: (...args: any[]) => void): (() => void) | undefined;
        send(channel: string, ...args: any[]): void;
    };
    openExternalLink(url: string): void;
    setupRenderer(api: any, options?: IJitsiNodeAPISetupOptions): void;
}

declare global {
    interface Window {
        jitsiNodeAPI: IJitsiNodeAPI;
        renderEntryPoint(entryPoint: string): void;
    }

    namespace NodeJS {
        interface Process {

            /**
             * Set by Electron in Mac App Store builds.
             */
            mas?: boolean;
        }
    }
}
