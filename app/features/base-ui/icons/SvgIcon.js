import PropTypes from 'prop-types';
import React from 'react';

/**
 * Renders a consistent SVG icon wrapper.
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
export default function SvgIcon({ children, color, size, ...props }) {
    return (
        <svg
            fill = 'none'
            height = { size }
            stroke = { color }
            strokeLinecap = 'round'
            strokeLinejoin = 'round'
            strokeWidth = '2'
            viewBox = '0 0 24 24'
            width = { size }
            { ...props }>
            { children }
        </svg>
    );
}

SvgIcon.defaultProps = {
    color: 'currentColor',
    size: 20
};

SvgIcon.propTypes = {
    children: PropTypes.node.isRequired,
    color: PropTypes.string,
    size: PropTypes.number
};
