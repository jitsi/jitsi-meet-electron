
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
 * Question circle icon (replaces @atlaskit/icon/glyph/question-circle).
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
const QuestionCircleIcon = ({ color, onClick, size }) => (
    <svg
        fill = { color }
        height = { size }
        onClick = { onClick }
        style = { iconStyle }
        viewBox = '0 0 24 24'
        width = { size }
        xmlns = 'http://www.w3.org/2000/svg'>
        <path
            d = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12
            2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1
            1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21
            1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z' />
    </svg>
);

QuestionCircleIcon.defaultProps = {
    color: 'currentColor',
    size: 24
};

QuestionCircleIcon.propTypes = {
    color: PropTypes.string,
    onClick: PropTypes.func,
    size: PropTypes.number
};

export default QuestionCircleIcon;
