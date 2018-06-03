// @flow

import { combineReducers } from 'redux';

import { reducer as routerReducer } from '../router';

export default combineReducers({
    router: routerReducer
});
