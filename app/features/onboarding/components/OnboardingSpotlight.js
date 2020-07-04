// @flow

import { Spotlight } from '@atlaskit/onboarding';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { continueOnboarding } from '../actions';

type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;

    /**
     * Spotlight dialog placement.
     */
    dialogPlacement: String;

    /**
     * Callback when "next" clicked.
     */
    onNext: Function;

    /**
     * I18next translation function.
     */
    t: Function;

    /**
     * Spotlight target.
     */
    target: String;

    /**
     * Spotlight text.
     */
    text: String;

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
