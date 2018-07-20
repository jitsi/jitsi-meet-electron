// @flow

import { HIDE_NOTIFICATION, SHOW_NOTIFICATION } from './actionTypes';
import type { Notification } from './types';

type State = {
    notifications: Array<Notification>;
};

const DEFAULT_STATE = {
    notifications: []
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
    case HIDE_NOTIFICATION:
        return {
            ...state,
            notifications: state.notifications.filter(
                (notification: Notification) =>
                    notification.uuid !== action.uuid
            )
        };

    case SHOW_NOTIFICATION: {

        // Add uuid to Notification object.
        const notification = {
            ...action.notification,
            uuid: action.uuid
        };

        console.log(notification);

        return {
            ...state,

            // $FlowFixMe
            notifications: state.notifications.concat(notification)
        };
    }

    default:
        return state;
    }
};
