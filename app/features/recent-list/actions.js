import { ADD_RECENT_LIST_ENTRY, CONFERENCE_REMOVED } from './actionTypes';

/**
 * Notifies that conference is removed from recents list.
 *
 * @param {Object} conference - Conference Details.
 * @returns {{
 *     type: CONFERENCE_REMOVED,
 *     conference
 * }}
 */
export function conferenceRemoved(conference) {
    return {
        type: CONFERENCE_REMOVED,
        conference
    };
}

/**
 * Adds a conference to the recent list.
 *
 * @param {Object} conference - Conference Details.
 * @returns {{
 *     type: ADD_RECENT_LIST_ENTRY,
 *     conference
 * }}
 */
export function addRecentListEntry(conference) {
    return {
        type: ADD_RECENT_LIST_ENTRY,
        conference
    };
}
