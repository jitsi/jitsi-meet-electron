
import { CONFERENCE_ENDED, CONFERENCE_JOINED } from '../conference';

import { CONFERENCE_REMOVED } from './actionTypes';


const DEFAULT_STATE = {
    recentList: []
};

/**
 * Reduces redux actions for features/recent-list.
 *
 * @param {Object} state - Current reduced redux state.
 * @param {Object} action - Action which was dispatched.
 * @returns {Object} - Updated reduced redux state.
 */
export default (state = DEFAULT_STATE, action) => {
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
function _cleanRoomName(roomName) {
    const [ noQuery ] = roomName.split('?', 2);
    const [ noParams ] = noQuery.split('#', 2);

    return noParams;
}

/**
 * Insert Conference details in the recent list array.
 *
 * @param {Array<RecentListItem>} recentList - Previous recent list array.
 * @param {Object} newConference - Conference that has to be added
 * to recent list.
 * @returns {Array<RecentListItem>} - Updated recent list array.
 */
function _insertConference(
        recentList,
        newConference
) {
    // Add start time to conference.
    newConference.startTime = Date.now();

    newConference.room = _cleanRoomName(newConference.room);

    // Remove same conference.
    const newRecentList = recentList.filter(
        conference => _cleanRoomName(conference.room) !== newConference.room
            || conference.serverURL !== newConference.serverURL);

    // Add the conference at the beginning.
    newRecentList.unshift(newConference);

    return newRecentList;
}

/**
 * Remove a conference from the recent list array.
 *
 * @param {Array<RecentListItem>} recentList - Previous recent list array.
 * @param {Object} toRemove - Conference to be removed.
 * @returns {Array<RecentListItem>} - Updated recent list array.
 */
function _removeConference(
        recentList,
        toRemove
) {
    return recentList.filter(
        conference => conference !== toRemove);
}

/**
 * Update the EndTime of the last conference.
 *
 * @param {Array<RecentListItem>} recentList - Previous recent list array.
 * @param {Object} conference - Conference for which endtime has to
 * be updated.
 * @returns {Array<RecentListItem>} - Updated recent list array.
 */
function _updateEndtimeOfConference(
        recentList,
        conference
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
