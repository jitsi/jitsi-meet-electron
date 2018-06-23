/**
 * The type of (redux) action that sets the Avatar URL.
 *
 * {
 *     type: SET_AVATAR_URL,
 *     avatarURL: string
 * }
 */
export const SET_AVATAR_URL = Symbol('SET_AVATAR_URL');

/**
 * The type of (redux) action that sets the email of the user.
 *
 * {
 *     type: SET_EMAIL,
 *     email: string
 * }
 */
export const SET_EMAIL = Symbol('SET_EMAIL');

/**
 * The type of (redux) action that sets the name of the user.
 *
 * {
 *     type: SET_NAME,
 *     name: string
 * }
 */
export const SET_NAME = Symbol('SET_NAME');

/**
 * The type of (redux) action that sets the Server URL.
 *
 * {
 *     type: SET_SERVER_URL,
 *     serverURL: string
 * }
 */
export const SET_SERVER_URL = Symbol('SET_SERVER_URL');
