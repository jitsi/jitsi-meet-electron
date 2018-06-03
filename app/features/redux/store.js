// @flow

import { createStore } from 'redux';

import middleware from './middleware';
import reducers from './reducers';

export default createStore(reducers, middleware);
