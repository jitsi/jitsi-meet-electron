// @flow

import { SET_AVATAR_URL, SET_EMAIL, SET_NAME } from './actionTypes';

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
