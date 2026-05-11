import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';

const appearanceStyles = {
    primary: css`
        background: #5BB5FF;
        color: #FFFFFF;

        &:hover {
            background: #3A9FEF;
        }
    `,
    subtle: css`
        background: transparent;
        color: inherit;

        &:hover {
            background: rgba(255, 255, 255, 0.12);
        }
    `
};

const buttonElement = ({ _appearance, _hasChildren, _spacing, ...props }) => React.createElement('button', props);

/**
 * Returns the button gap.
 *
 * @param {Object} props - Styled props.
 * @returns {string}
 */
function getGap(props) {
    return props._hasChildren ? '8px' : '0';
}

/**
 * Returns the button minimum width.
 *
 * @param {Object} props - Styled props.
 * @returns {string}
 */
function getMinWidth(props) {
    return props._spacing === 'none' ? '32px' : '40px';
}

/**
 * Returns the button padding.
 *
 * @param {Object} props - Styled props.
 * @returns {string}
 */
function getPadding(props) {
    return props._spacing === 'none' ? '0' : '0 16px';
}

const StyledButton = styled(buttonElement)`
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: 999px;
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    gap: ${getGap};
    height: 40px;
    justify-content: center;
    min-width: ${getMinWidth};
    padding: ${getPadding};
    transition: background 0.2s ease, opacity 0.2s ease, transform 0.2s ease;

    ${props => appearanceStyles[props._appearance] || appearanceStyles.subtle}

    &:focus {
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.35);
        outline: none;
    }

    &:active {
        transform: translateY(1px);
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

const IconSlot = styled.span`
    align-items: center;
    display: inline-flex;
    justify-content: center;
`;

/**
 * Renders a reusable application button.
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
function Button({
    appearance,
    children,
    iconBefore,
    spacing,
    type,
    ...props
}) {
    return (
        <StyledButton
            _appearance = { appearance }
            _hasChildren = { Boolean(children) }
            _spacing = { spacing }
            type = { type }
            { ...props }>
            { iconBefore ? <IconSlot>{ iconBefore }</IconSlot> : null }
            { children }
        </StyledButton>
    );
}

Button.defaultProps = {
    appearance: 'subtle',
    children: undefined,
    iconBefore: undefined,
    spacing: 'default',
    type: 'button'
};

Button.propTypes = {
    appearance: PropTypes.oneOf([ 'primary', 'subtle' ]),
    children: PropTypes.node,
    iconBefore: PropTypes.node,
    spacing: PropTypes.oneOf([ 'default', 'none' ]),
    type: PropTypes.string
};

export default Button;
