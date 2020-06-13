// @flow

import { applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';

import { middleware as onboardingMiddleware } from '../onboarding';
import { middleware as routerMiddleware } from '../router';

export default applyMiddleware(
    onboardingMiddleware,
    routerMiddleware,
    createLogger()
);
