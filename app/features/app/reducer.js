// @flow

import { SET_THEME } from './actionTypes';

type State = {
    theme: string
};

const DEFAULT_STATE = {
    theme: 'dark'
};

/**
 * Reduces redux actions for features/app .
 */
export default (state: State = DEFAULT_STATE, action: Object) => {
    switch (action.type) {
    case SET_THEME:
        return {
            ...state,
            theme: action.theme
        };

    default:
        return state;
    }
};
