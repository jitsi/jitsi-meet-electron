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
 * Help Action for Navigation Bar.
 */
class HelpAction extends Component< *, State> {
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

        this._droplistToggle = this._droplistToggle.bind(this);
        this._openPrivacyPage = this._openPrivacyPage.bind(this);
        this._openTermsPage = this._openTermsPage.bind(this);
        this._sendFeedback = this._sendFeedback.bind(this);
    }

    _droplistToggle: (*) => void;

    /**
     * Toggles the droplist.
     */
    _droplistToggle() {
        this.setState({
            droplistOpen: !this.state.droplistOpen
        });
    }

    _openPrivacyPage: (*) => void;

    /**
     * Opens Privacy Policy Page in default browser.
     */
    _openPrivacyPage() {
        openExternalLink(config.privacyPolicyURL);
    }

    _openTermsPage: (*) => void;

    /**
     * Opens Terms and Conditions Page in default browser.
     */
    _openTermsPage() {
        openExternalLink(config.termsAndConditionsURL);
    }

    _sendFeedback: (*) => void;

    /**
     * Opens Support/Feedback Email.
     */
    _sendFeedback() {
        openExternalLink(config.feedbackURL);
    }

    /**
     * Render function of component.
     *
     * @return {ReactElement}
     */
    render() {
        return (
            <Droplist
                isOpen = { this.state.droplistOpen }
                onClick = { () => this._droplistToggle() }
                onOpenChange = { () => this._droplistToggle() }
                position = 'right bottom'
                trigger = { <HelpIcon /> }>
                <Item onActivate = { this._openTermsPage }>Terms</Item>
                <Item onActivate = { this._openPrivacyPage }>Privacy</Item>
                <Item onActivate = { this._sendFeedback } >Send Feedback</Item>
            </Droplist>
        );
    }
}

export default HelpAction;
