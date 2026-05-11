
import PropTypes from 'prop-types';
import React from 'react';


/**
 * SpotlightManager replacement. Previously a context provider from
 * the onboarding library. Now a plain wrapper fragment since our custom
 * spotlight implementation does not require a shared context.
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
const SpotlightManager = ({ children }) => <>{ children }</>;

SpotlightManager.propTypes = {
    children: PropTypes.node
};

export default SpotlightManager;
