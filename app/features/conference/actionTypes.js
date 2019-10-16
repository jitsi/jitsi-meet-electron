/**
 * The type of (redux) action that is dispatched when conference is joined.
 *
 * @type {
 *     type: CONFERENCE_JOINED,
 *     conference: Object
 * }
 */
export const CONFERENCE_JOINED = Symbol('CONFERENCE_JOINED');

/**
 * The type of (redux) action that is dispatched when conference ends.
 *
 * @type {
 *     type: CONFERENCE_ENDED,
 *     conference: Object
 * }
 */export const CONFERENCE_ENDED = Symbol('CONFERENCE_ENDED');
