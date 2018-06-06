// @flow

import { SET_THEME } from './actionTypes';

/**
 * Set the theme of the AtlaskitThemeProvider component.
 */
export function setTheme(theme: string) {
    return {
        type: SET_THEME,
        theme
    };
}
