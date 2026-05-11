
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';

import OnboardingModalImage from '../../../images/onboarding.png';
import config from '../../config';
import Button from '../../shared/components/Button';
import { continueOnboarding, skipOnboarding } from '../actions';


const Overlay = styled.div`
    align-items: center;
    background: rgba(0, 0, 0, 0.6);
    bottom: 0;
    display: flex;
    justify-content: center;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 1000;
`;

const Card = styled.div`
    background: #fff;
    border-radius: 8px;
    color: #333;
    max-width: 480px;
    overflow: hidden;
    width: 90%;
`;

const CardImage = styled.img`
    display: block;
    height: auto;
    max-height: 200px;
    object-fit: cover;
    width: 100%;
`;

const CardBody = styled.div`
    padding: 24px;
`;

const CardHeading = styled.h2`
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 12px;
`;

const CardText = styled.p`
    color: #555;
    margin-bottom: 20px;
`;

const CardActions = styled.div`
    display: flex;
    gap: 8px;
    justify-content: flex-end;
`;


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
        this._onSkip = this._onSkip.bind(this);
        this._onNext = this._onNext.bind(this);
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        const { t } = this.props;

        return (
            <Overlay>
                <Card>
                    <CardImage
                        alt = 'Onboarding'
                        src = { OnboardingModalImage } />
                    <CardBody>
                        <CardHeading>
                            { t('onboarding.welcome', { appName: config.appName }) }
                        </CardHeading>
                        <CardText>{ t('onboarding.letUsShowYouAround') }</CardText>
                        <CardActions>
                            <Button
                                appearance = 'primary'
                                onClick = { this._onNext }
                                type = 'button'>
                                { t('onboarding.startTour') }
                            </Button>
                            <Button
                                onClick = { this._onSkip }
                                type = 'button'>
                                { t('onboarding.skip') }
                            </Button>
                        </CardActions>
                    </CardBody>
                </Card>
            </Overlay>
        );
    }


    /**
     * Moves to the next onboarding step.
     *
     * @returns {void}
     */
    _onNext() {
        this.props.dispatch(continueOnboarding());
    }


    /**
     * Skips all the onboardings.
     *
     * @returns {void}
     */
    _onSkip() {
        this.props.dispatch(skipOnboarding());
    }

}

OnboardingModal.propTypes = {
    dispatch: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
};

export default compose(connect(), withTranslation())(OnboardingModal);
