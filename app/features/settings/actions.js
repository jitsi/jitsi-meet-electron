// @flow

import {
    SET_ALWAYS_ON_TOP_WINDOW_ENABLED,
    SET_AUDIO_MUTED,
    SET_EMAIL,
    SET_NAME,
    SET_SERVER_URL,
    SET_SERVER_TIMEOUT,
    SET_VIDEO_MUTED,
    SET_ENABLE_REMOTE_CONTROL
} from './actionTypes';

import { normalizeServerURL } from '../utils';

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
 * Set Server Timeout.
 *
 * @param {string} serverTimeout - Server Timeout.
 * @returns {{
 *     type: SET_SERVER_TIMEOUT,
 *     serverTimeout: ?number
 * }}
 */
export function setServerTimeout(serverTimeout: number) {
    return {
        type: SET_SERVER_TIMEOUT,
        serverTimeout
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

/**
 * Set Enable Remote Control.
 *
 * @param {boolean} enableRemoteControl - Whether to enable remote control
 * @returns {{
 *     type: SET_ENABLE_REMOTE_CONTROL,
 *     enableRemoteControl: boolean
 * }}
 */
export function setEnableRemoteControl(enableRemoteControl: boolean) {
    return {
        type: SET_ENABLE_REMOTE_CONTROL,
        enableRemoteControl
    };
}

/**
 * Set window always on top.
 *
 * @param {boolean} alwaysOnTopWindowEnabled - Whether to set AlwaysOnTop Window Enabled.
 * @returns {{
 *     type: SET_ALWAYS_ON_TOP_WINDOW_ENABLED,
 *     alwaysOnTopWindowEnabled: boolean
 * }}
 */
export function setWindowAlwaysOnTop(alwaysOnTopWindowEnabled: boolean) {
    return {
        type: SET_ALWAYS_ON_TOP_WINDOW_ENABLED,
        alwaysOnTopWindowEnabled
    };
}
