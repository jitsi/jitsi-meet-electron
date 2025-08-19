

import { CLOSE_DRAWER, OPEN_DRAWER } from './actionTypes';


const DEFAULT_STATE = {
    openDrawer: undefined
};

/**
 * Reduces redux actions for features/settings.
 *
 * @param {Object} state - Current reduced redux state.
 * @param {Object} action - Action which was dispatched.
 * @returns {Object} - Updated reduced redux state.
 */
export default (state = DEFAULT_STATE, action) => {
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
