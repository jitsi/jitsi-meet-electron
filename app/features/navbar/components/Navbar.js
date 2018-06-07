
// @flow

import Navigation, { AkGlobalItem } from '@atlaskit/navigation';

import React, { Component } from 'react';

import { isElectronMac } from '../../utils';

import HelpAction from './HelpAction';

/**
 * Navigation Bar component.
 */
class Navbar extends Component<*> {
    /**
     * Get the array of Secondary actions of Global Navigation.
     *
     * @returns {ReactElement[]}
     */
    _getSecondaryActions() {
        return [
            <AkGlobalItem key = { 0 }>
                <HelpAction />
            </AkGlobalItem>
        ];
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <Navigation
                globalSecondaryActions = { this._getSecondaryActions() }
                isElectronMac = { isElectronMac() }
                isOpen = { false }
                isResizeable = { false } />
        );
    }
}

export default Navbar;
