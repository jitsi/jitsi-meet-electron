import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { SettingsButton, SettingsDrawer } from '../../settings';
import {
    NavSection,
    NavbarContainer
} from '../styled';

import HelpButton from './HelpButton';
import Logo from './Logo';


/**
 * Navigation Bar component.
 */
class Navbar extends Component {
    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <NavbarContainer>
                <NavSection>
                    <Logo />
                </NavSection>
                <NavSection>
                    <SettingsButton />
                    <HelpButton />
                </NavSection>
                <SettingsDrawer isOpen = { this.props._isSettingsDrawerOpen } />
            </NavbarContainer>
        );
    }
}

Navbar.propTypes = {
    _isSettingsDrawerOpen: PropTypes.bool
};

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
 *     _isSettingsDrawerOpen
 * }}
 */
function _mapStateToProps(state) {
    return {
        _isSettingsDrawerOpen: state.navbar.openDrawer === SettingsDrawer
    };
}


export default connect(_mapStateToProps)(Navbar);
