// @flow

import { getAvatarURL } from 'js-utils';

import {
    SET_ALWAYS_ON_TOP_WINDOW_ENABLED,
    SET_AUDIO_MUTED,
    SET_AVATAR_URL,
    SET_EMAIL,
    SET_NAME,
    SET_SERVER_URL,
    SET_VIDEO_MUTED
} from './actionTypes';

type State = {
    avatarURL: string,
    email: string,
    name: string,
    serverURL: ?string,
    startWithAudioMuted: boolean,
    startWithVideoMuted: boolean,
    alwaysOnTopWindowEnabled: boolean,
};

const username = window.jitsiNodeAPI.osUserInfo().username;

const DEFAULT_STATE = {
    alwaysOnTopWindowEnabled: true,
    avatarURL: getAvatarURL({ id: username }),
    email: '',
    name: username,
    serverURL: undefined,
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

    case SET_AVATAR_URL:
        return {
            ...state,
            avatarURL: action.avatarURL
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

    case SET_VIDEO_MUTED:
        return {
            ...state,
            startWithVideoMuted: action.startWithVideoMuted
        };

    default:
        return state;
    }
};
