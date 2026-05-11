import PropTypes from 'prop-types';
import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
`;

const sizes = {
    default: '24px',
    large: '48px'
};

const spinnerElement = ({ _size, ...props }) => React.createElement('span', props);

const StyledSpinner = styled(spinnerElement)`
    animation: ${spin} 0.8s linear infinite;
    border: 4px solid rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    border-top-color: #FFFFFF;
    display: inline-block;
    height: ${props => sizes[props._size] || sizes.default};
    width: ${props => sizes[props._size] || sizes.default};
`;

/**
 * Renders a loading spinner.
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
function Spinner({ size }) {
    return (
        <StyledSpinner
            _size = { size }
            aria-label = 'Loading'
            role = 'progressbar' />
    );
}

Spinner.defaultProps = {
    size: 'default'
};

Spinner.propTypes = {
    size: PropTypes.oneOf([ 'default', 'large' ])
};

export default Spinner;
