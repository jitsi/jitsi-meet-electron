
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { onboardingComponents, onboardingSteps } from '../../onboarding';


/**
 * Onboarding Component Entry Point.
 */
class Onboarding extends Component {
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

Onboarding.propTypes = {
    _activeOnboarding: PropTypes.string,
    section: PropTypes.string
};

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
 *     _activeOnboarding
 * }}
 */
function _mapStateToProps(state) {
    return {
        _activeOnboarding: state.onboarding.activeOnboarding
    };
}

export default connect(_mapStateToProps)(Onboarding);


