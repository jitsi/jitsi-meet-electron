
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';


const getPadding = props => {
    if (props.spacing === 'none') {
        return '0';
    }

    return '6px 14px';
};

const getPrimaryStyles = props => {
    if (props.appearance === 'primary') {
        return `
            background: #0073e0;
            color: white;
            &:hover { background: #4678ed; }
            &:active { background: #4678ed; }
        `;
    }

    return '';
};

const getSubtleStyles = props => {
    if (props.appearance === 'subtle') {
        return `
            background: transparent;
            color: inherit;
            &:hover { background: rgba(255, 255, 255, 0.1); }
        `;
    }

    return '';
};

const getDefaultStyles = props => {
    if (props.appearance !== 'primary' && props.appearance !== 'subtle') {
        return `
            background: #e0e0e0;
            color: #333;
            &:hover { background: #c8c8c8; }
        `;
    }

    return '';
};

const StyledButton = styled.button`
    align-items: center;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: inline-flex;
    font-size: 14px;
    font-weight: 500;
    gap: 6px;
    justify-content: center;
    outline: none;
    padding: ${getPadding};
    transition: background 0.15s;

    ${getPrimaryStyles}
    ${getSubtleStyles}
    ${getDefaultStyles}
`;

/**
 * Simple button component that replaces @atlaskit/button.
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
const Button = ({ iconBefore, children, ...rest }) => (
    <StyledButton { ...rest }>
        { iconBefore }
        { children }
    </StyledButton>
);

Button.propTypes = {
    appearance: PropTypes.string,
    children: PropTypes.node,
    iconBefore: PropTypes.node,
    onClick: PropTypes.func,
    spacing: PropTypes.string,
    type: PropTypes.string
};

export default Button;
