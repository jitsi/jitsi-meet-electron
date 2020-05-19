// @flow

import { SET_EMAIL, SET_NAME } from './actionTypes';
import { setAvatarURL } from './actions';
import { getAvatarURL } from './functions';

export default (store: Object) => (next: Function) => (action: Object) => {
    const result = next(action);
    const state = store.getState();

    switch (action.type) {
    case SET_EMAIL:
    case SET_NAME:
        store.dispatch(setAvatarURL(getAvatarURL(state)));

    }

    return result;
};
