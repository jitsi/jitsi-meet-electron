// @flow

import { applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';

import { middleware as routerMiddleware } from '../router';
import { middleware as settingsMiddleware } from '../settings';

export default applyMiddleware(
    routerMiddleware,
    settingsMiddleware,
    createLogger()
);
