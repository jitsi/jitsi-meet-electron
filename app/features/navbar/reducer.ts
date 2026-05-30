import type { AnyAction } from 'redux';

import type { INavbarState } from '../../types';

import { CLOSE_DRAWER, OPEN_DRAWER } from './actionTypes';


const DEFAULT_STATE: INavbarState = {
    openDrawer: undefined
};

/**
 * Reduces redux actions for features/settings.
 *
 * @param {Object} state - Current reduced redux state.
 * @param {Object} action - Action which was dispatched.
 * @returns {Object} - Updated reduced redux state.
 */
export default (state: INavbarState = DEFAULT_STATE, action: AnyAction): INavbarState => {
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
