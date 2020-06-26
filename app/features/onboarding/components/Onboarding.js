// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { onboardingComponents, onboardingSteps } from '../../onboarding';

type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;

    /**
     * Onboarding Section.
     */
    section: string;

    /**
     * Active Onboarding.
     */
    _activeOnboarding: string;
};

/**
 * Onboarding Component Entry Point.
 */
class Onboarding extends Component<Props, *> {
    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        const { section, _activeOnboarding } = this.props;
        const steps = onboardingSteps[section];

        if (_activeOnboarding && steps.includes(_activeOnboarding)) {
            const { type: ActiveOnboarding, ...props } = onboardingComponents[_activeOnboarding];

            return <ActiveOnboarding { ...props } />;
        }

        return null;
    }
}

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
 *     _activeOnboarding: string
 * }}
 */
function _mapStateToProps(state: Object) {
    return {
        _activeOnboarding: state.onboarding.activeOnboarding
    };
}

export default connect(_mapStateToProps)(Onboarding);


