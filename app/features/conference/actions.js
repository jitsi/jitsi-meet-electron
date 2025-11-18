
import { CONFERENCE_ENDED, CONFERENCE_JOINED } from './actionTypes';

/**
 * Notifies that conference is joined.
 *
 * @param {Object} conference - Conference Details.
 * @returns {{
 *     type: CONFERENCE_JOINED,
 *     conference
 * }}
 */
export function conferenceJoined(conference) {
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
 *     conference
 * }}
 */
export function conferenceEnded(conference) {
    return {
        type: CONFERENCE_ENDED,
        conference
    };
}
