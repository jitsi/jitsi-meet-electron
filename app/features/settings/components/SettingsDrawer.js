
import ArrowLeft from '@atlaskit/icon/glyph/arrow-left';
import { AkCustomDrawer } from '@atlaskit/navigation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { DrawerContainer, Logo, closeDrawer } from '../../navbar';
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
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        const { t } = this.props;

        return (
            <AkCustomDrawer
                backIcon = { <ArrowLeft label = { t('settings.back') } /> }
                isOpen = { this.props.isOpen }
                onBackButton = { this._onBackButton }
                primaryIcon = { <Logo /> } >
                <DrawerContainer>
                    <SettingsContainer>
                        <ServerURLField />
                        <ServerTimeoutField />
                        <TogglesContainer>
                            <SettingToggle
                                label = { t('settings.alwaysOnTopWindow') }
                                settingChangeEvent = { setWindowAlwaysOnTop }
                                settingName = 'alwaysOnTopWindowEnabled' />
                            <SettingToggle
                                label = { t('settings.disableAGC') }
                                settingChangeEvent = { setDisableAGC }
                                settingName = 'disableAGC' />
                        </TogglesContainer>
                    </SettingsContainer>
                </DrawerContainer>
            </AkCustomDrawer>
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
