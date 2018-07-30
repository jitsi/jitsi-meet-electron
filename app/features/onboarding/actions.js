// @flow

import {
    CONTINUE_ONBOARDING,
    SET_ACTIVE_ONBOARDING,
    SKIP_ONBOARDING,
    START_ONBOARDING
} from './actionTypes';

/**
 * Continues the onboarding procedure by activating the next step of the current
 * section.
 *
 * @returns {{
 *     type: CONTINUE_ONBOARDING
 * }}
 */
export function continueOnboarding() {
    return {
        type: CONTINUE_ONBOARDING
    };
}

/**
 * Set active onboarding.
 *
 * @param {string} name - Name of onboarding component.
 * @param {string} section - Onboarding section.
 * @returns {{
 *     type: SET_ACTIVE_ONBOARDING,
 *     name: string,
 *     section: string
 * }}
 */
export function setActiveOnboarding(name: string, section: string) {
    return {
        type: SET_ACTIVE_ONBOARDING,
        name,
        section
    };
}

/**
 * Skips onboarding.
 *
 * @returns {{
 *     type: SKIP_ONBOARDING
 * }}
 */
export function skipOnboarding() {
    return {
        type: SKIP_ONBOARDING
    };
}

/**
 * Start onboarding.
 *
 * @param {string} section - Onboarding section.
 * @returns {{
 *     type: START_ONBOARDING,
 *     section: string
 * }}
 */
export function startOnboarding(section: string) {
    return {
        type: START_ONBOARDING,
        section
    };
}
