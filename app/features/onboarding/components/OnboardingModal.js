// @flow

import { Modal } from '@atlaskit/onboarding';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import OnboardingModalImage from '../../../images/onboarding.png';

import config from '../../config';

import { skipOnboarding, continueOnboarding } from '../actions';

type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;
};

/**
 * Onboarding Modal Component.
 */
class OnboardingModal extends Component<Props, *> {
    /**
     * Initializes a new {@code OnboardingModal} instance.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
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
        return (
            <Modal
                actions = { [
                    {
                        onClick: this._next,
                        text: 'Start Tour'
                    },
                    {
                        onClick: this._skip,
                        text: 'Skip'
                    }
                ] }
                heading = { `Welcome to ${config.appName}` }
                image = { OnboardingModalImage } >
                <p> Let us show you around!</p>
            </Modal>
        );
    }

    _next: (*) => void;

    /**
     * Close the spotlight component.
     *
     * @returns {void}
     */
    _next() {
        this.props.dispatch(continueOnboarding());
    }

    _skip: (*) => void;

    /**
     * Skips all the onboardings.
     *
     * @returns {void}
     */
    _skip() {
        this.props.dispatch(skipOnboarding());
    }

}

export default connect()(OnboardingModal);
