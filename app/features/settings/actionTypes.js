/**
 * The type of (redux) action that sets Window always on top.
 *
 * @type {
 *     type: SET_ALWAYS_ON_TOP_WINDOW_ENABLED,
 *     alwaysOnTopWindowEnabled: boolean
 * }
 */
export const SET_ALWAYS_ON_TOP_WINDOW_ENABLED
    = Symbol('SET_ALWAYS_ON_TOP_WINDOW_ENABLED');

/**
 * The type of (redux) action that sets Start with Audio Muted.
 *
 * @type {
 *     type: SET_AUDIO_MUTED,
 *     startWithAudioMuted: boolean
 * }
 */
export const SET_AUDIO_MUTED = Symbol('SET_AUDIO_MUTED');

/**
 * The type of (redux) action that sets the Avatar URL.
 *
 * @type {
 *     type: SET_AVATAR_URL,
 *     avatarURL: string
 * }
 */
export const SET_AVATAR_URL = Symbol('SET_AVATAR_URL');

/**
 * The type of (redux) action that sets the email of the user.
 *
 * @type {
 *     type: SET_EMAIL,
 *     email: string
 * }
 */
export const SET_EMAIL = Symbol('SET_EMAIL');

/**
 * The type of (redux) action that sets the name of the user.
 *
 * @type {
 *     type: SET_NAME,
 *     name: string
 * }
 */
export const SET_NAME = Symbol('SET_NAME');

/**
 * The type of (redux) action that sets the Server URL.
 *
 * @type {
 *     type: SET_SERVER_URL,
 *     serverURL: string
 * }
 */
export const SET_SERVER_URL = Symbol('SET_SERVER_URL');

/**
 * The type of (redux) action that sets Start with Video Muted.
 *
 * @type {
 *     type: SET_VIDEO_MUTED,
 *     startWithVideoMuted: boolean
 * }
 */
export const SET_VIDEO_MUTED = Symbol('SET_VIDEO_MUTED');
