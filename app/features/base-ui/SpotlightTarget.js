import PropTypes from 'prop-types';
import React from 'react';

/**
 * Registers a DOM target for spotlight overlays.
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
function SpotlightTarget({ children, name }) {
    return <div data-spotlight-target = { name }>{ children }</div>;
}

SpotlightTarget.propTypes = {
    children: PropTypes.node.isRequired,
    name: PropTypes.string.isRequired
};

export default SpotlightTarget;
