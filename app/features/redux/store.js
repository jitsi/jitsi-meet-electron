// @flow

import { createStore } from 'redux';
import { persistReducer, getStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // uses localStorage

import middleware from './middleware';
import reducers from './reducers';

const migrateFromElectronStore = async state => {
    // migrate to local storage by checking if state is undefined
    // (first launch or first launch after switch to local storage)
    // and previous electron-store config.json exists.
    if (state === undefined && window.jitsiNodeAPI.electronStoreExists) {
        const electronStoreState = await getStoredState({
            key: 'root',
            storage: window.jitsiNodeAPI.createElectronStorage(),
            debug: true
        });

        if ('onboarding' in electronStoreState) {
            return electronStoreState;
        }
    }

    return state;
};

const persistConfig = {
    key: 'root',

    // remove this and all electron-store-related dependencies end of 2021
    // (3 months migration period from electron-store to local storage)
    migrate: migrateFromElectronStore,
    storage,
    whitelist: [
        'onboarding',
        'recentList',
        'settings'
    ]
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default createStore(persistedReducer, middleware);
