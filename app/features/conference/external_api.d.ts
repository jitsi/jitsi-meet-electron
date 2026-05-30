/**
 * Minimal declaration for the vendored, pre-bundled {@code external_api.js}
 * (the Jitsi Meet iframe External API). Only the surface used by the
 * application is described.
 */
declare class JitsiMeetExternalAPI {
    constructor(domain: string, options?: any);
    on(event: string, listener: (...args: any[]) => void): void;
    dispose(): void;
}

export default JitsiMeetExternalAPI;
