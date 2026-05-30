import type { IConference } from '../../types';

import { ADD_RECENT_LIST_ENTRY, REMOVE_RECENT_LIST_ENTRY } from './actionTypes';

/**
 * Adds a conference to the recent list.
 *
 * @param {Object} conference - Conference Details.
 * @returns {{
 *     type: ADD_RECENT_LIST_ENTRY,
 *     conference
 * }}
 */
export function addRecentListEntry(conference: IConference) {
    return {
        type: ADD_RECENT_LIST_ENTRY,
        conference
    };
}

/**
 * Notifies that conference is removed from recents list.
 *
 * @param {Object} conference - Conference Details.
 * @returns {{
 *     type: REMOVE_RECENT_LIST_ENTRY,
 *     conference
 * }}
 */
export function removeRecentListEntry(conference: IConference) {
    return {
        type: REMOVE_RECENT_LIST_ENTRY,
        conference
    };
}
