
import { CONFERENCE_REMOVED } from './actionTypes';

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
