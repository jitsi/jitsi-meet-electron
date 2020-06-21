// @flow

import { Spotlight } from '@atlaskit/onboarding';

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { continueOnboarding } from '../actions';
import { useTranslation } from 'react-i18next';

type Props = {

    /**
     * Spotlight text.
     */
    text: String;

    /**
     * Spotlight target.
     */
    target: String;

    /**
     * Spotlight dialog placement.
     */
    dialogPlacement: String;

    /**
     * Callback when "next" clicked.
     */
    onNext: Function;

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;

    /**
     * I18next translation function.
     */
    t: Function;
};

const OnboardingSpotlight = (props: Props) => {
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


export default connect()(OnboardingSpotlight);
