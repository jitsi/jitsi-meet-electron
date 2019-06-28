
export default {
    /**
     * The URL with extra information about the app / service.
     */
    aboutURL: 'https://jitsi.org/what-is-jitsi/',

    /**
     * Application name.
     */
    appName: 'Jitsi Meet',

    /**
     * The default server URL of Jitsi Meet Deployment that will be used.
     */
    defaultServerURL: 'https://meet.jit.si',

    /**
     * URL to send feedback.
     */
    feedbackURL: 'mailto:support@jitsi.org',

    /**
     * The URL of Privacy Policy Page.
     */
    privacyPolicyURL: 'https://jitsi.org/meet/privacy',

    /**
     * The URL of Terms and Conditions Page.
     */
    termsAndConditionsURL: 'https://jitsi.org/meet/terms',

    /**
     * Some of default values for application.
     */
    defaults: {
        windowAlwaysOnTop: true
    },

    /**
     * All needed configurations for storage in our application
     * This is including electron-store and redux-persist
     */
    storage: {
        /**
         * Key where all redux-persist data is stored
         * Note: FULL_STORE_KEY = redux-persist.KEY_PREFIX + storage.rootKey
         */
        rootKey: 'root',
        settingsKey: 'settings',
        windowAlwaysOnTopKey: 'windowAlwaysOnTop'
    }
};
