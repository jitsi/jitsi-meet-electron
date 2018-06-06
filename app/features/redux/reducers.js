// @flow

import { combineReducers } from 'redux';

import { reducer as appReducer } from '../app';
import { reducer as routerReducer } from '../router';

export default combineReducers({
    app: appReducer,
    router: routerReducer
});
