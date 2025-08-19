
import { Spotlight } from '@atlaskit/onboarding';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { continueOnboarding } from '../actions';


const OnboardingSpotlight = props => {
    const { t } = useTranslation();

    return (
        <Spotlight
            actions = { [
                {
                    onClick: () => {
                        props.dispatch(continueOnboarding());
                        props.onNext && props.onNext(props);
                    },
                    text: t('onboarding.next')
                }
            ] }
            dialogPlacement = { props.dialogPlacement }
            target = { props.target } >
            { t(props.text) }
        </Spotlight>
    );
};

OnboardingSpotlight.propTypes = {
    dialogPlacement: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    onNext: PropTypes.func,
    target: PropTypes.string,
    text: PropTypes.string
};

export default connect()(OnboardingSpotlight);
