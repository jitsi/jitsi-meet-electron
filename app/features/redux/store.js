// @flow

import { createStore } from 'redux';
import { persistReducer } from 'redux-persist';

import middleware from './middleware';
import reducers from './reducers';

const persistConfig = {
    key: 'root',
    storage: window.jitsiNodeAPI.createElectronStorage(),
    whitelist: [
        'onboarding',
        'recentList',
        'settings'
    ]
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default createStore(persistedReducer, middleware);
