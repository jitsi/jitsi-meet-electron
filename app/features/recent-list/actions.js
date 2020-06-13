// @flow

import { CONFERENCE_REMOVED } from './actionTypes';

/**
 * Notifies that conference is removed from recents list.
 *
 * @param {Object} conference - Conference Details.
 * @returns {{
*     type: CONFERENCE_REMOVED,
*     conference: Object
* }}
*/
export function conferenceRemoved(conference: Object) {
    return {
        type: CONFERENCE_REMOVED,
        conference
    };
}
