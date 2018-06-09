// @flow

import type { ComponentType } from 'react';

import { CLOSE_DRAWER, OPEN_DRAWER } from './actionTypes';

type State = {
    openDrawer: typeof undefined | ComponentType<*>
};

const DEFAULT_STATE = {
    openDrawer: undefined
};

/**
 * Reduces redux actions for features/settings.
 *
 * @param {State} state - Current reduced redux state.
 * @param {Object} action - Action which was dispatched.
 * @returns {State} - Updated reduced redux state.
 */
export default (state: State = DEFAULT_STATE, action: Object) => {
    switch (action.type) {
    case CLOSE_DRAWER:
        return {
            ...state,
            openDrawer: undefined
        };

    case OPEN_DRAWER:
        return {
            ...state,
            openDrawer: action.drawerComponent
        };

    default:
        return state;
    }
};
