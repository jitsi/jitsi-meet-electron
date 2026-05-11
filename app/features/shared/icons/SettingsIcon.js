
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
 * Settings (gear) icon (replaces @atlaskit/icon/glyph/settings).
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
const SettingsIcon = ({ color, onClick, size }) => (
    <svg
        fill = { color }
        height = { size }
        onClick = { onClick }
        style = { iconStyle }
        viewBox = '0 0 24 24'
        width = { size }
        xmlns = 'http://www.w3.org/2000/svg'>
        <path
            d = 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61
            l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54
            c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94
            l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94
            s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96
            c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54
            c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61
            l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z' />
    </svg>
);

SettingsIcon.defaultProps = {
    color: 'currentColor',
    size: 24
};

SettingsIcon.propTypes = {
    color: PropTypes.string,
    onClick: PropTypes.func,
    size: PropTypes.number
};

export default SettingsIcon;
