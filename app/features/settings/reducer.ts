
import { AnyAction } from 'redux';

import type { ISettingsState } from '../../types';

import {
    SET_ALWAYS_ON_TOP_WINDOW_ENABLED,
    SET_DISABLE_AGC,
    SET_SERVER_TIMEOUT,
    SET_SERVER_URL
} from './actionTypes';


const DEFAULT_STATE: ISettingsState = {
    alwaysOnTopWindowEnabled: true,
    disableAGC: false,
    serverURL: undefined,
    serverTimeout: undefined
};

/**
 * Reduces redux actions for features/settings.
 *
 * @param {Object} state - Current reduced redux state.
 * @param {Object} action - Action which was dispatched.
 * @returns {Object} - Updated reduced redux state.
 */
export default (state: ISettingsState = DEFAULT_STATE, action: AnyAction): ISettingsState => {
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
