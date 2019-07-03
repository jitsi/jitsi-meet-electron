// @flow

import { createStore } from 'redux';
import { persistReducer } from 'redux-persist';
import createElectronStorage from 'redux-persist-electron-storage';

import middleware from './middleware';
import reducers from './reducers';

const persistConfig = {
    key: 'root',
    storage: createElectronStorage(),
    whitelist: [
        'onboarding',
        'recentList',
        'settings'
    ]
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default createStore(persistedReducer, middleware);
