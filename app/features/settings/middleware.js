// @flow

import { getAvatarURL } from 'js-utils';
import { SET_EMAIL, SET_NAME } from './actionTypes';
import { setAvatarURL } from './actions';

export default (store: Object) => (next: Function) => (action: Object) => {
    const result = next(action);
    const state = store.getState();

    switch (action.type) {
    case SET_EMAIL:
    case SET_NAME: {
        const avatarURL = getAvatarURL({
            email: state.settings.email,
            id: state.settings.name
        });

        store.dispatch(setAvatarURL(avatarURL));
    }
    }

    return result;
};
