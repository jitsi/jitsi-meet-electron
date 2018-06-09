// @flow

import type { ComponentType } from 'react';

import { CLOSE_DRAWER, OPEN_DRAWER } from './actionTypes';

/**
 * Closes the drawers.
 *
 * @returns {{
 *     type: CLOSE_DRAWER,
 * }}
 */
export function closeDrawer() {
    return {
        type: CLOSE_DRAWER
    };
}

/**
 * Opens the specified drawer.
 *
 * @param {string} drawerComponent - Component of the drawer.
 * @returns {{
 *     type: OPEN_DRAWER,
 *     drawerComponent: ComponentType<*>
 * }}
 */
export function openDrawer(drawerComponent: ComponentType<*>) {
    return {
        type: OPEN_DRAWER,
        drawerComponent
    };
}
