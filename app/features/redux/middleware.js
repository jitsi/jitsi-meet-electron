// @flow

import { applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';

import { middleware as routerMiddleware } from '../router';

export default applyMiddleware(
    routerMiddleware,
    createLogger()
);
