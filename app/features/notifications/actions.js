// @flow

import random from 'uuid/v4';

import { SHOW_NOTIFICATION, HIDE_NOTIFICATION } from './actionTypes';

/**
 * Removes the notification with the passed in id.
 *
 * @param {string} uuid - The unique identifier for the notification to be
 * removed.
 * @returns {{
 *     type: HIDE_NOTIFICATION,
 *     uuid: string
 * }}
 */
export function hideNotification(uuid: string) {
    return {
        type: HIDE_NOTIFICATION,
        uuid
    };
}

/**
 * Queues a notification for display.
 *
 * @param {Object} notification - The notification details.
 * @returns {{
 *     type: SHOW_NOTIFICATION,
 *     notification: Object,
 *     uuid: string
 * }}
 */
export function showNotification(notification: Object = {}) {
    return {
        type: SHOW_NOTIFICATION,
        notification,
        uuid: random()
    };
}
