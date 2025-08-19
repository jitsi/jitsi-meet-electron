
import { Modal } from '@atlaskit/onboarding';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';

import OnboardingModalImage from '../../../images/onboarding.png';
import config from '../../config';
import { continueOnboarding, skipOnboarding } from '../actions';


/**
 * Onboarding Modal Component.
 */
class OnboardingModal extends Component {
    /**
     * Initializes a new {@code OnboardingModal} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        // Bind event handlers.
        this._skip = this._skip.bind(this);
        this._next = this._next.bind(this);
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        const { t } = this.props;

        return (
            <Modal
                actions = { [
                    {
                        onClick: this._next,
                        text: t('onboarding.startTour')
                    },
                    {
                        onClick: this._skip,
                        text: t('onboarding.skip')
                    }
                ] }
                heading = { t('onboarding.welcome', { appName: config.appName }) }
                image = { OnboardingModalImage } >
                <p> { t('onboarding.letUsShowYouAround') }</p>
            </Modal>
        );
    }


    /**
     * Close the spotlight component.
     *
     * @returns {void}
     */
    _next() {
        this.props.dispatch(continueOnboarding());
    }


    /**
     * Skips all the onboardings.
     *
     * @returns {void}
     */
    _skip() {
        this.props.dispatch(skipOnboarding());
    }

}

OnboardingModal.propTypes = {
    dispatch: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
};

export default compose(connect(), withTranslation())(OnboardingModal);
