// @flow

import {
    SET_ALWAYS_ON_TOP_WINDOW_ENABLED,
    SET_AUDIO_MUTED,
    SET_EMAIL,
    SET_NAME,
    SET_SERVER_URL,
    SET_SERVER_TIMEOUT,
    SET_VIDEO_MUTED
} from './actionTypes';

type State = {
    alwaysOnTopWindowEnabled: boolean,
    email: string,
    name: string,
    serverURL: ?string,
    serverTimeout: ?number,
    startWithAudioMuted: boolean,
    startWithVideoMuted: boolean
};

const username = window.jitsiNodeAPI.osUserInfo().username;

const DEFAULT_STATE = {
    alwaysOnTopWindowEnabled: true,
    email: '',
    name: username,
    serverURL: undefined,
    serverTimeout: undefined,
    startWithAudioMuted: false,
    startWithVideoMuted: false
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

    case SET_AUDIO_MUTED:
        return {
            ...state,
            startWithAudioMuted: action.startWithAudioMuted
        };

    case SET_EMAIL:
        return {
            ...state,
            email: action.email
        };

    case SET_NAME:
        return {
            ...state,
            name: action.name
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

    case SET_VIDEO_MUTED:
        return {
            ...state,
            startWithVideoMuted: action.startWithVideoMuted
        };

    default:
        return state;
    }
};
