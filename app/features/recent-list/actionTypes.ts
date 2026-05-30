/**
 * The type of (redux) action that is dispatched when a conference is added to the recent list.
 *
 * @type {
 *     type: ADD_RECENT_LIST_ENTRY,
 *     conference
 * }
 */
export const ADD_RECENT_LIST_ENTRY = 'ADD_RECENT_LIST_ENTRY';

/**
 * The type of (redux) action that is dispatched when a conference is removed from the recent list.
 *
 * @type {
 *     type: REMOVE_RECENT_LIST_ENTRY,
 *     conference
 * }
 */
export const REMOVE_RECENT_LIST_ENTRY = 'REMOVE_RECENT_LIST_ENTRY';
