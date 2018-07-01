// @flow

import {
    SET_AUDIO_MUTED,
    SET_AVATAR_URL,
    SET_EMAIL,
    SET_NAME,
    SET_SERVER_URL,
    SET_VIDEO_MUTED
} from './actionTypes';

import { normalizeServerURL } from '../utils';

/**
 * Set Avatar URL.
 *
 * @param {string} avatarURL - Avatar URL.
 * @returns {{
 *     type: SET_AVATAR_URL,
 *     avatarURL: string
 * }}
 */
export function setAvatarURL(avatarURL: string) {
    return {
        type: SET_AVATAR_URL,
        avatarURL
    };
}

/**
 * Set the email of the user.
 *
 * @param {string} email - Email of the user.
 * @returns {{
 *     type: SET_EMAIL,
 *     email: string
 * }}
 */
export function setEmail(email: string) {
    return {
        type: SET_EMAIL,
        email
    };
}

/**
 * Set the name of the user.
 *
 * @param {string} name - Name of the user.
 * @returns {{
 *     type: SET_NAME,
 *     name: string
 * }}
 */
export function setName(name: string) {
    return {
        type: SET_NAME,
        name
    };
}

/**
 * Set Server URL.
 *
 * @param {string} serverURL - Server URL.
 * @returns {{
 *     type: SET_SERVER_URL,
 *     serverURL: ?string
 * }}
 */
export function setServerURL(serverURL: string) {
    return {
        type: SET_SERVER_URL,
        serverURL: normalizeServerURL(serverURL)
    };
}

/**
 * Set start with audio muted.
 *
 * @param {boolean} startWithAudioMuted - Whether to start with audio muted.
 * @returns {{
 *     type: SET_AUDIO_MUTED,
 *     startWithAudioMuted: boolean
 * }}
 */
export function setStartWithAudioMuted(startWithAudioMuted: boolean) {
    return {
        type: SET_AUDIO_MUTED,
        startWithAudioMuted
    };
}

/**
 * Set start with video muted.
 *
 * @param {boolean} startWithVideoMuted - Whether to start with video muted.
 * @returns {{
 *     type: SET_VIDEO_MUTED,
 *     startWithVideoMuted: boolean
 * }}
 */
export function setStartWithVideoMuted(startWithVideoMuted: boolean) {
    return {
        type: SET_VIDEO_MUTED,
        startWithVideoMuted
    };
}


