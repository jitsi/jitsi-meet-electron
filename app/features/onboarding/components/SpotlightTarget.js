
import PropTypes from 'prop-types';
import React from 'react';


/**
 * SpotlightTarget replacement — previously from @atlaskit/onboarding.
 * Wraps its children in a div with a data attribute so that
 * OnboardingSpotlight can locate and highlight the element.
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
const SpotlightTarget = ({ name, children }) => (
    <div
        data-spotlight-id = { name }
        style = {{ display: 'contents' }}>
        { children }
    </div>
);

SpotlightTarget.propTypes = {
    children: PropTypes.node,
    name: PropTypes.string.isRequired
};

export default SpotlightTarget;
