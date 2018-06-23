// @flow

import os from 'os';

import { getAvatarURL } from '../utils';

import {
    SET_AVATAR_URL,
    SET_EMAIL,
    SET_NAME,
    SET_SERVER_URL
} from './actionTypes';

type State = {
    avatarURL: string,
    email: string,
    name: string,
    serverURL: ?string
};

const username = os.userInfo().username;

const DEFAULT_STATE = {
    avatarURL: getAvatarURL({ id: username }),
    email: '',
    name: username,
    serverURL: undefined
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

    default:
        return state;
    }
};
