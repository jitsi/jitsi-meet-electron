
import {
    CONTINUE_ONBOARDING,
    SET_ACTIVE_ONBOARDING,
    SKIP_ONBOARDING
} from './actionTypes';
import { onboardingSteps } from './constants';


const DEFAULT_STATE = {
    activeOnboarding: undefined,
    activeOnboardingSection: undefined,
    onboardingShown: []
};

/**
 * Reduces redux actions for features/onboarding.
 *
 * @param {Object} state - Current reduced redux state.
 * @param {Object} action - Action which was dispatched.
 * @returns {Object} - Updated reduced redux state.
 */
export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
    case CONTINUE_ONBOARDING:
        return {
            ...state,
            activeOnboarding: undefined,
            onboardingShown: state.onboardingShown.concat(state.activeOnboarding)
        };

    case SET_ACTIVE_ONBOARDING:
        return {
            ...state,
            activeOnboarding: action.name,
            activeOnboardingSection: action.section
        };

    case SKIP_ONBOARDING: {
        const allSteps = [].concat(...Object.values(onboardingSteps));

        return {
            ...state,
            activeOnboarding: undefined,
            activeOnboardingSection: undefined,
            onboardingShown: state.onboardingShown.concat(allSteps)
        };
    }

    default:
        return state;
    }
};
