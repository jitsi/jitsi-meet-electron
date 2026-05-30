import type { ISettingsState, IState } from '../../types';

/**
 * Get's the value for the given setting, providing a default value.
 *
 * @param {IState} state - The redux state.
 * @param {string} setting - The name for the desired setting.
 * @param {*} defaultValue - The default value, in case the setting is
 * undefined.
 * @returns {*} The setting value.
 */
export function getSetting<K extends keyof ISettingsState>(
        state: IState,
        setting: K,
        defaultValue?: ISettingsState[K]
): ISettingsState[K] | undefined {
    const value = state.settings[setting];

    if (typeof value === 'undefined') {
        return defaultValue;
    }

    return value;
}
