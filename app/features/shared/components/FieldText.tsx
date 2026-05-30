
import React from 'react';
import styled from 'styled-components';

interface IProps {
    autoFocus?: boolean;
    className?: string;
    invalidMessage?: string;
    isInvalid?: boolean;
    isLabelHidden?: boolean;
    isValidationHidden?: boolean;
    label?: string;
    onBlur?: (event: any) => void;
    onChange?: (event: any) => void;
    placeholder?: number | string;
    shouldFitContainer?: boolean;
    type?: string;
    value?: number | string;
}

const getWidth = (props: { shouldFitContainer?: boolean; }) => {
    if (props.shouldFitContainer) {
        return '100%';
    }

    return 'auto';
};

const getBorderColor = (props: { isInvalid?: boolean; }) => {
    if (props.isInvalid) {
        return '#ff5630';
    }

    return '#3e3e3e';
};

const getFocusBorderColor = (props: { isInvalid?: boolean; }) => {
    if (props.isInvalid) {
        return '#ff5630';
    }

    return '#dddddd';
};

const Wrapper = styled.div<{ shouldFitContainer?: boolean; }>`
    display: flex;
    flex-direction: column;
    width: ${getWidth};
`;

const StyledLabel = styled.label`
    color: #c6c6c6;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 4px;
    text-transform: uppercase;
`;

const StyledInput = styled.input<{ isInvalid?: boolean; }>`
    background: #3e3e3e;
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
        color: #cdcdcd;
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
 * @param {IProps} props - Component props.
 * @returns {ReactElement}
 */
const FieldText = ({
    autoFocus,
    className,
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
}: IProps) => (
    <Wrapper
        className = { className }
        shouldFitContainer = { shouldFitContainer }>
        { label && !isLabelHidden
            ? <StyledLabel>{ label }</StyledLabel>
            : null }
        <StyledInput
            autoFocus = { autoFocus }
            isInvalid = { isInvalid }
            onBlur = { onBlur }
            onChange = { onChange }
            placeholder = { placeholder as string }
            type = { type || 'text' }
            value = { value || '' } />
        { isInvalid && !isValidationHidden && invalidMessage
            ? <ErrorMessage>{ invalidMessage }</ErrorMessage>
            : null }
    </Wrapper>
);

export default FieldText;
