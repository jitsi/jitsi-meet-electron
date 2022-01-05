// @flow

import {
    SET_ALWAYS_ON_TOP_WINDOW_ENABLED,
    SET_DISABLE_AGC,
    SET_SERVER_URL,
    SET_SERVER_TIMEOUT
} from './actionTypes';

type State = {
    alwaysOnTopWindowEnabled: boolean,
    disableAGC: boolean,
    serverURL: ?string,
    serverTimeout: ?number
};

const DEFAULT_STATE = {
    alwaysOnTopWindowEnabled: true,
    disableAGC: false,
    serverURL: undefined,
    serverTimeout: undefined
};

/**
 * Reduces redux actions for features/settings.
 *
 * @param {State} state - Current reduced redux state.
 * @param {Object} action - Action which was dispatched.
 * @returns {State} - Updated reduced redux state.
 */
export default (state: State = DEFAULT_STATE, action: Object) => {
    switch (action.type) {
    case SET_ALWAYS_ON_TOP_WINDOW_ENABLED:
        return {
            ...state,
            alwaysOnTopWindowEnabled: action.alwaysOnTopWindowEnabled
        };

    case SET_DISABLE_AGC:
        return {
            ...state,
            disableAGC: action.disableAGC
        };

    case SET_SERVER_URL:
        return {
            ...state,
            serverURL: action.serverURL
        };

    case SET_SERVER_TIMEOUT:
        return {
            ...state,
            serverTimeout: action.serverTimeout
        };

    default:
        return state;
    }
};
