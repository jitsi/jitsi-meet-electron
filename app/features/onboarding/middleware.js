// @flow

import { setActiveOnboarding } from './actions';
import { CONTINUE_ONBOARDING, START_ONBOARDING } from './actionTypes';
import { onboardingSteps } from './constants';

export default (store: Object) => (next: Function) => (action: Object) => {
    const result = next(action);
    const state = store.getState();

    switch (action.type) {
    case CONTINUE_ONBOARDING: {
        const section = state.onboarding.activeOnboardingSection;

        const nextStep = onboardingSteps[section].find(
            step => !state.onboarding.onboardingShown.includes(step)
        );

        store.dispatch(setActiveOnboarding(nextStep, nextStep && section));
        break;
    }

    case START_ONBOARDING: {
        const { section } = action;
        const nextStep = onboardingSteps[section].find(
            step => !state.onboarding.onboardingShown.includes(step)
        );

        if (nextStep) {
            store.dispatch(setActiveOnboarding(nextStep, section));
        }
        break;
    }
    }

    return result;
};
