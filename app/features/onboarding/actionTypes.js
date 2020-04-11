/**
 * The type of (redux) action that continues the onboarding by processing
 * the next step.
 *
 * @type {
 *     type: CONTINUE_ONBOARDING
 * }
 */
export const CONTINUE_ONBOARDING = Symbol('CONTINUE_ONBOARDING');

/**
 * The type of (redux) action that sets active onboarding.
 *
 * @type {
 *     type: SET_ACTIVE_ONBOARDING,
 *     name: string,
 *     section: string
 * }
 */
export const SET_ACTIVE_ONBOARDING = Symbol('SET_ACTIVE_ONBOARDING');

/**
 * The type of (redux) action that starts Onboarding.
 *
 * @type {
 *     type: START_ONBOARDING,
 *     section: string
 * }
 */
export const START_ONBOARDING = Symbol('START_ONBOARDING');

/**
 * The type of (redux) action that skips all onboarding.
 *
 * @type {
 *     type: SKIP_ONBOARDING
 * }
 */
export const SKIP_ONBOARDING = Symbol('SKIP_ONBOARDING');
