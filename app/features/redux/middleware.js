
import { applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';

import { middleware as onboardingMiddleware } from '../onboarding';

export default applyMiddleware(
    onboardingMiddleware,
    createLogger()
);
