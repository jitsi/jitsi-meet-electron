import { app } from 'electron';
import i18next, { type i18n as I18n, type TOptions } from 'i18next';

import languages from './languages';

/**
 * Translations for the main process.
 *
 * The renderer instance ({@link ./index}) cannot be reused here: it pulls in
 * react-i18next and detects the language via `navigator.language`, neither of
 * which exists in the main process. This is a separate i18next instance over the
 * same resource bundles, using Electron's own locale.
 */

let instance: I18n | undefined;

/**
 * Returns the main process i18next instance, initializing it on first use.
 * Initialization is deferred because `app.getLocale()` is only reliable once the
 * `ready` event has fired.
 *
 * @returns {I18n} The initialized instance.
 */
function getInstance(): I18n {
    if (!instance) {
        instance = i18next.createInstance();
        instance.init({
            resources: languages,
            lng: app.getLocale(),
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false // Rendered by native dialogs, not by HTML.
            }
        });
    }

    return instance;
}

/**
 * Translates a key using the main process instance.
 *
 * @param {string} key - The translation key.
 * @param {TOptions} [options] - Interpolation options.
 * @returns {string} The translated string.
 */
export function t(key: string, options?: TOptions): string {
    return getInstance().t(key, options);
}
