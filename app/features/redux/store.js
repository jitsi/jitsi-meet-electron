// @flow

import { createStore } from 'redux';
import { persistReducer } from 'redux-persist';
import createElectronStorage from 'redux-persist-electron-storage';

import middleware from './middleware';
import reducers from './reducers';

import config from '../config';

const persistConfig = {
    key: config.storage.rootKey,
    storage: createElectronStorage(),
    whitelist: [
        'onboarding',
        'recentList',
        config.storage.settingsKey
    ]
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default createStore(persistedReducer, middleware);
