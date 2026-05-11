import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';

import {
    ArrowLeftIcon,
    Drawer,
    IconButton,
    SpotlightTarget
} from '../../base-ui';
import {
    DrawerContainer,
    DrawerHeader,
    Logo,
    closeDrawer
} from '../../navbar';
import { Onboarding, startOnboarding } from '../../onboarding';
import {
    setDisableAGC, setWindowAlwaysOnTop
} from '../actions';
import { SettingsContainer, TogglesContainer } from '../styled';

import ServerTimeoutField from './ServerTimeoutField';
import ServerURLField from './ServerURLField';
import SettingToggle from './SettingToggle';


/**
 * Drawer that open when SettingsAction is clicked.
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
            <Drawer
                isOpen = { this.props.isOpen }
                onClose = { this._onBackButton }>
                <DrawerContainer>
                    <DrawerHeader>
                        <IconButton
                            appearance = 'subtle'
                            ariaLabel = { t('settings.back') }
                            icon = { <ArrowLeftIcon /> }
                            onClick = { this._onBackButton } />
                        <Logo />
                    </DrawerHeader>
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
