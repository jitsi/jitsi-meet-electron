// @flow

import Droplist, { Item } from '@atlaskit/droplist';
import HelpIcon from '@atlaskit/icon/glyph/question-circle';

import React, { Component } from 'react';

import config from '../../config';
import { openExternalLink } from '../../utils';

type State = {

    /**
     * Whether the droplist is open or not.
     */
    droplistOpen: boolean
};

/**
 * Help button for Navigation Bar.
 */
export default class HelpButton extends Component< *, State> {
    /**
     * Initializes a new {@code HelpAction} instance.
     *
     * @inheritdoc
     */
    constructor() {
        super();

        this.state = {
            droplistOpen: false
        };

        this._onIconClick = this._onIconClick.bind(this);
        this._onPrivacyOptionClick = this._onPrivacyOptionClick.bind(this);
        this._onTermsOptionClick = this._onTermsOptionClick.bind(this);
        this._onSendFeedback = this._onSendFeedback.bind(this);
    }

    _onIconClick: (*) => void;

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

    _onPrivacyOptionClick: (*) => void;

    /**
     * Opens Privacy Policy Page in default browser.
     *
     * @returns {void}
     */
    _onPrivacyOptionClick() {
        openExternalLink(config.privacyPolicyURL);
    }

    _onTermsOptionClick: (*) => void;

    /**
     * Opens Terms and Conditions Page in default browser.
     *
     * @returns {void}
     */
    _onTermsOptionClick() {
        openExternalLink(config.termsAndConditionsURL);
    }

    _onSendFeedback: (*) => void;

    /**
     * Opens Support/Feedback Email.
     *
     * @returns {void}
     */
    _onSendFeedback() {
        openExternalLink(config.feedbackURL);
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <Droplist
                isOpen = { this.state.droplistOpen }
                onClick = { this._onIconClick }
                onOpenChange = { this._onIconClick }
                position = 'right bottom'
                trigger = { <HelpIcon /> }>
                <Item onActivate = { this._onTermsOptionClick }>Terms</Item>
                <Item onActivate = { this._onPrivacyOptionClick }>Privacy</Item>
                <Item onActivate = { this._onSendFeedback }>Send Feedback</Item>
            </Droplist>
        );
    }
}
