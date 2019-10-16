/**
 * The type of (redux) action that opens specified Drawer.
 *
 * @type {
 *     type: OPEN_DRAWER,
 *     drawerComponent: React.ComponentType<*>
 * }
 */
export const OPEN_DRAWER = Symbol('OPEN_DRAWER');

/**
 * The type of (redux) action that closes all Drawer.
 *
 * @type {
 *     type: CLOSE_DRAWER
 * }
 */
export const CLOSE_DRAWER = Symbol('CLOSE_DRAWER');
