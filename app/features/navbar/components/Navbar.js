
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { SettingsButton, SettingsDrawer } from '../../settings';

import HelpButton from './HelpButton';
import Logo from './Logo';


const NavBar = styled.nav`
    background: #0747a6;
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: space-between;
    padding: 8px 0;
    width: 64px;
`;

const NavSection = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const NavItem = styled.div`
    align-items: center;
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    display: flex;
    justify-content: center;
    padding: 8px;

    &:hover {
        background: rgba(255, 255, 255, 0.15);
        color: white;
    }
`;


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
            <>
                <NavBar>
                    <NavSection>
                        <NavItem>
                            <Logo />
                        </NavItem>
                        <NavItem>
                            <SettingsButton />
                        </NavItem>
                    </NavSection>
                    <NavSection>
                        <NavItem>
                            <HelpButton />
                        </NavItem>
                    </NavSection>
                </NavBar>
                <SettingsDrawer isOpen = { this.props._isSettingsDrawerOpen } />
            </>
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
