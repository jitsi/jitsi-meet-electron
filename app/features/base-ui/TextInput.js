import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    width: 100%;
`;

const visuallyHidden = css`
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
`;

const labelElement = ({ _hidden, ...props }) => React.createElement('label', props);

/**
 * Returns the label visibility styles.
 *
 * @param {Object} props - Styled props.
 * @returns {FlattenSimpleInterpolation|string}
 */
function getLabelVisibility(props) {
    return props._hidden ? visuallyHidden : '';
}

const Label = styled(labelElement)`
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    margin-bottom: 8px;

    ${getLabelVisibility}
`;

const inputElement = ({ _isInvalid, ...props }) => React.createElement('input', props);

/**
 * Returns the input border color.
 *
 * @param {Object} props - Styled props.
 * @returns {string}
 */
function getBorderColor(props) {
    return props._isInvalid ? '#FF8F73' : 'rgba(255, 255, 255, 0.24)';
}

const Input = styled(inputElement)`
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid ${getBorderColor};
    border-radius: 12px;
    color: #FFFFFF;
    min-height: 48px;
    outline: none;
    padding: 0 16px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    width: 100%;

    &::placeholder {
        color: rgba(255, 255, 255, 0.55);
    }

    &:focus {
        border-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.15);
    }
`;

const ValidationMessage = styled.span`
    color: #FFD5CC;
    font-size: 12px;
    margin-top: 6px;
`;

/**
 * Renders a labeled text input with validation state.
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
function TextInput({
    autoFocus,
    invalidMessage,
    isInvalid,
    isLabelHidden,
    isValidationHidden,
    label,
    placeholder,
    value,
    ...props
}) {
    const shouldShowValidation = isInvalid && !isValidationHidden && invalidMessage;

    return (
        <Wrapper>
            { label ? <Label _hidden = { isLabelHidden }>{ label }</Label> : null }
            <Input
                _isInvalid = { isInvalid }
                aria-invalid = { isInvalid }
                aria-label = { label || placeholder }
                autoFocus = { autoFocus }
                placeholder = { placeholder }
                value = { value ?? '' }
                { ...props } />
            { shouldShowValidation ? <ValidationMessage>{ invalidMessage }</ValidationMessage> : null }
        </Wrapper>
    );
}

TextInput.defaultProps = {
    autoFocus: false,
    invalidMessage: undefined,
    isInvalid: false,
    isLabelHidden: false,
    isValidationHidden: false,
    label: undefined,
    placeholder: undefined,
    value: ''
};

TextInput.propTypes = {
    autoFocus: PropTypes.bool,
    invalidMessage: PropTypes.string,
    isInvalid: PropTypes.bool,
    isLabelHidden: PropTypes.bool,
    isValidationHidden: PropTypes.bool,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ])
};

export default TextInput;
