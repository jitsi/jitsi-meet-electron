// @flow

import { CONFERENCE_JOINED, CONFERENCE_ENDED } from './actionTypes';

/**
 * Notifies that conference is joined.
 *
 * @param {Object} conference - Conference Details.
 * @returns {{
 *     type: CONFERENCE_JOINED,
 *     conference: Object
 * }}
 */
export function conferenceJoined(conference: Object) {
    return {
        type: CONFERENCE_JOINED,
        conference
    };
}

/**
 * Notifies that conference is joined.
 *
 * @param {Object} conference - Conference Details.
 * @returns {{
 *     type: CONFERENCE_ENDED,
 *     conference: Object
 * }}
 */
export function conferenceEnded(conference: Object) {
    return {
        type: CONFERENCE_ENDED,
        conference
    };
}
