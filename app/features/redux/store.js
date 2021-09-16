// @flow

import { createStore } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // uses localStorage

import middleware from './middleware';
import reducers from './reducers';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: [
        'onboarding',
        'recentList',
        'settings'
    ]
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default createStore(persistedReducer, middleware);
