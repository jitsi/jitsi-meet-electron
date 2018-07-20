// @flow

import { combineReducers } from 'redux';

import { reducer as navbarReducer } from '../navbar';
import { reducer as notificationsReducer } from '../notifications';
import { reducer as routerReducer } from '../router';
import { reducer as settingsReducer } from '../settings';

export default combineReducers({
    navbar: navbarReducer,
    notifications: notificationsReducer,
    router: routerReducer,
    settings: settingsReducer
});
