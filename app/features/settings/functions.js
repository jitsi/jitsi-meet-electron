// @flow

/**
 * Get's the value for the given setting, providing a default value.
 *
 * @param {Object} state - The redux state.
 * @param {string} setting - The name for the desired setting.
 * @param {*} defaultValue - The default value, in case the setting is
 * undefined.
 * @returns {*} The setting value.
 */
export function getSetting(state: Object, setting: string, defaultValue: any) {
    const value = state.settings[setting];

    if (typeof value === 'undefined') {
        return defaultValue;
    }

    return value;
}
