import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const labelElement = ({ _disabled, ...props }) => React.createElement('label', props);
const trackElement = ({ _checked, ...props }) => React.createElement('span', props);
const thumbElement = ({ _checked, ...props }) => React.createElement('span', props);

/**
 * Returns the toggle cursor style.
 *
 * @param {Object} props - Styled props.
 * @returns {string}
 */
function getCursor(props) {
    return props._disabled ? 'not-allowed' : 'pointer';
}

/**
 * Returns the toggle track color.
 *
 * @param {Object} props - Styled props.
 * @returns {string}
 */
function getTrackBackground(props) {
    return props._checked ? '#36B37E' : 'rgba(255, 255, 255, 0.28)';
}

/**
 * Returns the toggle thumb offset.
 *
 * @param {Object} props - Styled props.
 * @returns {string}
 */
function getThumbOffset(props) {
    return props._checked ? '20px' : '0';
}

const Label = styled(labelElement)`
    cursor: ${getCursor};
    display: inline-flex;
    position: relative;
`;

const Input = styled.input`
    opacity: 0;
    pointer-events: none;
    position: absolute;
`;

const Track = styled(trackElement)`
    background: ${getTrackBackground};
    border-radius: 999px;
    display: inline-flex;
    height: 24px;
    padding: 3px;
    transition: background 0.2s ease;
    width: 44px;
`;

const Thumb = styled(thumbElement)`
    background: #FFFFFF;
    border-radius: 50%;
    height: 18px;
    transform: translateX(${getThumbOffset});
    transition: transform 0.2s ease;
    width: 18px;
`;

/**
 * Renders a switch-style toggle.
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
function Toggle({ checked, disabled, onChange }) {
    return (
        <Label _disabled = { disabled }>
            <Input
                checked = { checked }
                disabled = { disabled }
                onChange = { onChange }
                type = 'checkbox' />
            <Track _checked = { checked }>
                <Thumb _checked = { checked } />
            </Track>
        </Label>
    );
}

Toggle.defaultProps = {
    checked: false,
    disabled: false,
    onChange: undefined
};

Toggle.propTypes = {
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
};

export default Toggle;
