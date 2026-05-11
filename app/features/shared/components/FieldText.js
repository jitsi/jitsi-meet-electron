
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';


const getWidth = props => {
    if (props.shouldFitContainer) {
        return '100%';
    }

    return 'auto';
};

const getBorderColor = props => {
    if (props.isInvalid) {
        return '#ff5630';
    }

    return '#2c333d';
};

const getFocusBorderColor = props => {
    if (props.isInvalid) {
        return '#ff5630';
    }

    return '#87ceeb';
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: ${getWidth};
`;

const StyledLabel = styled.label`
    color: #b3bac5;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 4px;
    text-transform: uppercase;
`;

const StyledInput = styled.input`
    background: #2c333d;
    border: 2px solid ${getBorderColor};
    border-radius: 4px;
    color: #f4f5f7;
    font-size: 14px;
    outline: none;
    padding: 8px 10px;
    transition: border-color 0.15s;
    width: 100%;

    &:focus {
        border-color: ${getFocusBorderColor};
    }

    &::placeholder {
        color: #5e6c84;
    }
`;

const ErrorMessage = styled.span`
    color: #ff5630;
    font-size: 12px;
    margin-top: 4px;
`;

/**
 * Text field component that replaces @atlaskit/field-text FieldTextStateless.
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
const FieldText = ({
    autoFocus,
    invalidMessage,
    isInvalid,
    isLabelHidden,
    isValidationHidden,
    label,
    onBlur,
    onChange,
    placeholder,
    shouldFitContainer,
    type,
    value
}) => (
    <Wrapper shouldFitContainer = { shouldFitContainer }>
        { label && !isLabelHidden
            ? <StyledLabel>{ label }</StyledLabel>
            : null }
        <StyledInput
            autoFocus = { autoFocus }
            isInvalid = { isInvalid }
            onBlur = { onBlur }
            onChange = { onChange }
            placeholder = { placeholder }
            type = { type || 'text' }
            value = { value || '' } />
        { isInvalid && !isValidationHidden && invalidMessage
            ? <ErrorMessage>{ invalidMessage }</ErrorMessage>
            : null }
    </Wrapper>
);

FieldText.propTypes = {
    autoFocus: PropTypes.bool,
    invalidMessage: PropTypes.string,
    isInvalid: PropTypes.bool,
    isLabelHidden: PropTypes.bool,
    isValidationHidden: PropTypes.bool,
    label: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    placeholder: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    shouldFitContainer: PropTypes.bool,
    type: PropTypes.string,
    value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
};

export default FieldText;
