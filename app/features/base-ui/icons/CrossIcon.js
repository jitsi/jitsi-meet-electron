import PropTypes from 'prop-types';
import React from 'react';

import SvgIcon from './SvgIcon';

/**
 * Renders the close icon.
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
export default function CrossIcon({ primaryColor, ...props }) {
    return (
        <SvgIcon
            color = { primaryColor || props.color }
            { ...props }>
            <path d = 'M18 6 6 18' />
            <path d = 'm6 6 12 12' />
        </SvgIcon>
    );
}

CrossIcon.defaultProps = {
    color: undefined,
    primaryColor: undefined
};

CrossIcon.propTypes = {
    color: PropTypes.string,
    primaryColor: PropTypes.string
};
