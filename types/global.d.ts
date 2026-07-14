export {};

/**
 * The API exposed on {@code window} by the preload script
 * ({@code app/preload/preload.ts}).
 */
interface IJitsiElectronApp {
    ipc: {
        addListener(channel: string, listener: (...args: any[]) => void): (() => void) | undefined;
        send(channel: string, ...args: any[]): void;
    };
    openExternalLink(url: string): void;
}

declare global {
    interface Window {
        jitsiElectronApp: IJitsiElectronApp;
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
