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
 * The type of (redux) action that sets disable AGC.
 *
 * @type {
 *     type: SET_DISABLE_AGC,
 *     disableAGC: boolean
 * }
 */
export const SET_DISABLE_AGC = Symbol('SET_DISABLE_AGC');

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
 * The type of (redux) action that sets the Server Timeout.
 *
 * @type {
 *     type: SET_SERVER_TIMEOUT,
 *     serverTimeout: number
 * }
 */
export const SET_SERVER_TIMEOUT = Symbol('SET_SERVER_TIMEOUT');
