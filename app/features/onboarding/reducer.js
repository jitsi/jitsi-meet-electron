// @flow

import {
    CONTINUE_ONBOARDING,
    SET_ACTIVE_ONBOARDING,
    SKIP_ONBOARDING
} from './actionTypes';
import { onboardingSteps } from './constants';

type State = {
    activeOnboarding: ?string;
    activeOnboardingSection: ?string;
    onboardingShown: Array<string>;
};

const DEFAULT_STATE = {
    activeOnboarding: undefined,
    activeOnboardingSection: undefined,
    onboardingShown: []
};

/**
 * Reduces redux actions for features/onboarding.
 *
 * @param {State} state - Current reduced redux state.
 * @param {Object} action - Action which was dispatched.
 * @returns {State} - Updated reduced redux state.
 */
export default (state: State = DEFAULT_STATE, action: Object) => {
    switch (action.type) {
    case CONTINUE_ONBOARDING:
        return {
            ...state,
            activeOnboarding: undefined,
            onboardingShown:

                // $FlowFixMe
                state.onboardingShown.concat(state.activeOnboarding)
        };

    case SET_ACTIVE_ONBOARDING:
        return {
            ...state,
            activeOnboarding: action.name,
            activeOnboardingSection: action.section
        };

    case SKIP_ONBOARDING: {
        // $FlowFixMe
        const allSteps = [].concat(...Object.values(onboardingSteps));

        return {
            ...state,
            activeOnboarding: undefined,
            activeOnboardingSection: undefined,
            onboardingShown:

                // $FlowFixMe
                state.onboardingShown.concat(allSteps)
        };
    }

    default:
        return state;
    }
};
