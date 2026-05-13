
import styled, { keyframes } from 'styled-components';


const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

const SIZES = {
    large: '48px',
    medium: '30px',
    small: '20px'
};

const getSize = props => SIZES[props.size] || SIZES.medium;

const Spinner = styled.div`
    animation: ${spin} 0.8s linear infinite;
    border: 4px solid rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    border-top-color: white;
    height: ${getSize};
    width: ${getSize};
`;

export default Spinner;
