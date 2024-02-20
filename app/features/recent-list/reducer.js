// @flow

import { CONFERENCE_ENDED, CONFERENCE_JOINED } from '../conference';
import { CONFERENCE_REMOVED } from './actionTypes';

import type { RecentListItem } from './types';

type State = {
    recentList: Array<RecentListItem>;
};

const DEFAULT_STATE = {
    recentList: []
};

/**
 * Reduces redux actions for features/recent-list.
 *
 * @param {State} state - Current reduced redux state.
 * @param {Object} action - Action which was dispatched.
 * @returns {State} - Updated reduced redux state.
 */
export default (state: State = DEFAULT_STATE, action: Object) => {
    switch (action.type) {
    case CONFERENCE_ENDED:
        return {
            ...state,
            recentList:
                _updateEndtimeOfConference(state.recentList, action.conference)
        };

    case CONFERENCE_JOINED:
        return {
            ...state,
            recentList: _insertConference(state.recentList, action.conference)
        };

    case CONFERENCE_REMOVED:
        return {
            ...state,
            recentList: _removeConference(state.recentList, action.conference)
        };

    default:
        return state;
    }
};

/**
 * Cleans a room name of all parameters.
 *
 * @param {string} roomName - The room name to be cleaned.
 * @returns {string} - The cleaned up room name.
 */
function _cleanRoomName(roomName: string) {
    const [ noQuery ] = roomName.split('?', 2);
    const [ noParams ] = noQuery.split('#', 2);

    return noParams;
}

/**
 * Insert Conference details in the recent list array.
 *
 * @param {Array<RecentListItem>} recentList - Previous recent list array.
 * @param {RecentListItem} newConference - Conference that has to be added
 * to recent list.
 * @returns {Array<RecentListItem>} - Updated recent list array.
 */
function _insertConference(
        recentList: Array<RecentListItem>,
        newConference: RecentListItem
) {
    // Add start time to conference.
    newConference.startTime = Date.now();

    newConference.room = _cleanRoomName(newConference.room);

    // Remove same conference.
    const newRecentList: Array<RecentListItem> = recentList.filter(
        (conference: RecentListItem) => _cleanRoomName(conference.room) !== newConference.room
            || conference.serverURL !== newConference.serverURL);

    // Add the conference at the beginning.
    newRecentList.unshift(newConference);

    return newRecentList;
}

/**
 * Remove a conference from the recent list array.
 *
 * @param {Array<RecentListItem>} recentList - Previous recent list array.
 * @param {RecentListItem} toRemove - Conference to be removed.
 * @returns {Array<RecentListItem>} - Updated recent list array.
 */
function _removeConference(
        recentList: Array<RecentListItem>,
        toRemove: RecentListItem
): Array<RecentListItem> {
    return recentList.filter(
        (conference: RecentListItem) => conference !== toRemove);
}

/**
 * Update the EndTime of the last conference.
 *
 * @param {Array<RecentListItem>} recentList - Previous recent list array.
 * @param {RecentListItem} conference - Conference for which endtime has to
 * be updated.
 * @returns {Array<RecentListItem>} - Updated recent list array.
 */
function _updateEndtimeOfConference(
        recentList: Array<RecentListItem>,
        conference: RecentListItem
) {
    for (const item of recentList.slice()) {
        item.room = _cleanRoomName(item.room);

        if (item.room === _cleanRoomName(conference.room)
                && item.serverURL === conference.serverURL) {
            item.endTime = Date.now();
        }
    }

    return recentList;
}
