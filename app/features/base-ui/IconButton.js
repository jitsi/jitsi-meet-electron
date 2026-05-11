import PropTypes from 'prop-types';
import React from 'react';

import Button from './Button';

/**
 * Renders an icon-only button.
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
function IconButton({ ariaLabel, icon, ...props }) {
    return (
        <Button
            aria-label = { ariaLabel }
            iconBefore = { icon }
            spacing = 'none'
            { ...props } />
    );
}

IconButton.propTypes = {
    ariaLabel: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired
};

export default IconButton;
