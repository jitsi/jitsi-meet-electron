
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';

import { DrawerContainer, Logo, closeDrawer } from '../../navbar';
import { Onboarding, SpotlightTarget, startOnboarding } from '../../onboarding';
import { ArrowLeftIcon } from '../../shared/icons';
import {
    setDisableAGC, setWindowAlwaysOnTop
} from '../actions';
import { SettingsContainer, TogglesContainer } from '../styled';

import ServerTimeoutField from './ServerTimeoutField';
import ServerURLField from './ServerURLField';
import SettingToggle from './SettingToggle';


const getDrawerTransform = props => {
    if (props.isOpen) {
        return 'translateX(0)';
    }

    return 'translateX(-100%)';
};

const Drawer = styled.div`
    background: #0e1624;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.4);
    color: #f4f5f7;
    display: flex;
    flex-direction: column;
    height: 100vh;
    left: 0;
    overflow-y: auto;
    position: fixed;
    top: 0;
    transform: ${getDrawerTransform};
    transition: transform 0.25s ease;
    width: 360px;
    z-index: 400;
`;

const DrawerHeader = styled.div`
    align-items: center;
    display: flex;
    gap: 12px;
    padding: 16px;
`;

const BackButton = styled.button`
    align-items: center;
    background: transparent;
    border: none;
    color: inherit;
    cursor: pointer;
    display: flex;
    padding: 4px;

    &:hover {
        opacity: 0.8;
    }
`;


/**
 * Drawer that opens when SettingsAction is clicked.
 */
class SettingsDrawer extends Component {
    /**
     * Initializes a new {@code SettingsDrawer} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this._onBackButton = this._onBackButton.bind(this);
    }

    /**
     * Start Onboarding once component is mounted.
     *
     * NOTE: It automatically checks if the onboarding is shown or not.
     *
     * @param {Object} prevProps - Props before component updated.
     * @returns {void}
     */
    componentDidUpdate(prevProps) {
        if (!prevProps.isOpen && this.props.isOpen) {

            // TODO - Find a better way for this.
            // Delay for 300ms to let drawer open.
            setTimeout(() => {
                this.props.dispatch(startOnboarding('settings-drawer'));
            }, 300);
        }
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        const { t } = this.props;

        return (
            <Drawer isOpen = { this.props.isOpen }>
                <DrawerHeader>
                    <BackButton
                        aria-label = { t('settings.back') }
                        onClick = { this._onBackButton }>
                        <ArrowLeftIcon
                            color = 'white'
                            size = { 24 } />
                    </BackButton>
                    <Logo />
                </DrawerHeader>
                <DrawerContainer>
                    <SettingsContainer>
                        <SpotlightTarget name = 'server-setting'>
                            <ServerURLField />
                        </SpotlightTarget>
                        <SpotlightTarget name = 'server-timeout'>
                            <ServerTimeoutField />
                        </SpotlightTarget>
                        <TogglesContainer>
                            <SpotlightTarget
                                name = 'always-on-top-window'>
                                <SettingToggle
                                    label = { t('settings.alwaysOnTopWindow') }
                                    settingChangeEvent = { setWindowAlwaysOnTop }
                                    settingName = 'alwaysOnTopWindowEnabled' />
                            </SpotlightTarget>
                            <SettingToggle
                                label = { t('settings.disableAGC') }
                                settingChangeEvent = { setDisableAGC }
                                settingName = 'disableAGC' />
                        </TogglesContainer>
                        <Onboarding section = 'settings-drawer' />
                    </SettingsContainer>
                </DrawerContainer>
            </Drawer>
        );
    }


    /**
     * Closes the drawer when back button is clicked.
     *
     * @returns {void}
     */
    _onBackButton() {
        this.props.dispatch(closeDrawer());
    }
}

SettingsDrawer.propTypes = {
    dispatch: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    t: PropTypes.func.isRequired
};

export default compose(connect(), withTranslation())(SettingsDrawer);
