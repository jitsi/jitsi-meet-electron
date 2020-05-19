// @flow

import md5 from 'js-md5';

/**
 * Generates an avatar URL for a user, given the name and email settings.
 *
 * @param {Object} state - The redux state.
 * @returns {string} - The generated avatar URL.
 */
export function getAvatarURL(state: Object) {
    const { email, name } = state.settings;
    const encodedName = encodeURIComponent(name || '');

    if (email) {
        const md5email = md5.hex(email.trim().toLowerCase());

        return `https://www.gravatar.com/avatar/${md5email}?d=https%3A%2F%2Fui-avatars.com%2Fapi%2F/${encodedName}/128`;
    }

    return `https://ui-avatars.com/api/?name=${encodedName}&size=128`;
}

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
