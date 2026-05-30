
import type { IConference } from '../../types';

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
export function conferenceJoined(conference: IConference) {
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
export function conferenceEnded(conference: IConference) {
    return {
        type: CONFERENCE_ENDED,
        conference
    };
}
