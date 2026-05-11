import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import packageJSON from '../../../../package.json';
import { DropdownMenu, HelpIcon, IconButton } from '../../base-ui';
import config from '../../config';
import { openExternalLink } from '../../utils';
import { MenuHeading, MenuItem } from '../styled';

const { version } = packageJSON;


/**
 * Help button for Navigation Bar.
 */
class HelpButton extends Component {
    /**
     * Initializes a new {@code HelpButton} instance.
     *
     * @inheritdoc
     */
    constructor() {
        super();

        this.state = {
            droplistOpen: false
        };

        this._onAboutClick = openExternalLink.bind(undefined, config.aboutURL);
        this._onSourceClick = openExternalLink.bind(undefined, config.sourceURL);
        this._onIconClick = this._onIconClick.bind(this);
        this._onOpenChange = this._onOpenChange.bind(this);
        this._onPrivacyClick
            = openExternalLink.bind(undefined, config.privacyPolicyURL);
        this._onTermsClick
            = openExternalLink.bind(undefined, config.termsAndConditionsURL);
        this._onSendFeedbackClick
            = openExternalLink.bind(undefined, config.feedbackURL);
    }


    /**
     * Toggles the droplist.
     *
     * @returns {void}
     */
    _onIconClick() {
        this.setState({
            droplistOpen: !this.state.droplistOpen
        });
    }


    /**
     * Closes droplist when clicked outside.
     *
     * @returns {void}
     */
    _onOpenChange() {
        this.setState({
            droplistOpen: false
        });
    }

    /**
     * Runs the provided action and closes the menu.
     *
     * @param {Function} action - The action to execute.
     * @returns {Function}
     */
    _wrapMenuAction(action) {
        return () => {
            this._onOpenChange();
            action();
        };
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        const { t } = this.props;

        return (
            <DropdownMenu
                isOpen = { this.state.droplistOpen }
                onClose = { this._onOpenChange }
                onToggle = { this._onIconClick }
                trigger = {
                    <IconButton
                        ariaLabel = { t('help') }
                        icon = { <HelpIcon /> } />
                }>
                <MenuHeading>{ t('help') }</MenuHeading>
                <MenuItem onClick = { this._wrapMenuAction(this._onTermsClick) }>
                    { t('termsLink') }
                </MenuItem>
                <MenuItem onClick = { this._wrapMenuAction(this._onPrivacyClick) }>
                    { t('privacyLink') }
                </MenuItem>
                <MenuItem onClick = { this._wrapMenuAction(this._onSendFeedbackClick) }>
                    { t('sendFeedbackLink') }
                </MenuItem>
                <MenuItem onClick = { this._wrapMenuAction(this._onAboutClick) }>
                    { t('aboutLink') }
                </MenuItem>
                <MenuItem onClick = { this._wrapMenuAction(this._onSourceClick) }>
                    { t('sourceLink') }
                </MenuItem>
                <MenuItem as = 'div'>
                    { t('versionLabel', { version }) }
                </MenuItem>
            </DropdownMenu>
        );
    }
}

HelpButton.propTypes = {
    t: PropTypes.func.isRequired
};

export default withTranslation()(HelpButton);
