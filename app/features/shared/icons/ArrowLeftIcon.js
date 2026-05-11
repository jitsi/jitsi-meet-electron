
import PropTypes from 'prop-types';
import React from 'react';


const iconStyle = {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'inline-flex',
    fill: 'currentColor',
    justifyContent: 'center'
};

/**
 * Arrow left icon (replaces @atlaskit/icon/glyph/arrow-left).
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
const ArrowLeftIcon = ({ color, onClick, size }) => (
    <svg
        fill = { color }
        height = { size }
        onClick = { onClick }
        style = { iconStyle }
        viewBox = '0 0 24 24'
        width = { size }
        xmlns = 'http://www.w3.org/2000/svg'>
        <path d = 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z' />
    </svg>
);

ArrowLeftIcon.defaultProps = {
    color: 'currentColor',
    size: 24
};

ArrowLeftIcon.propTypes = {
    color: PropTypes.string,
    onClick: PropTypes.func,
    size: PropTypes.number
};

export default ArrowLeftIcon;
