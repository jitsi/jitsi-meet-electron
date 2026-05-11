
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';


const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
`;

const getTrackBackground = props => {
    if (props.checked) {
        return '#0052cc';
    }

    return '#6b778c';
};

const getKnobLeft = props => {
    if (props.checked) {
        return '26px';
    }

    return '3px';
};

const Track = styled.div`
    background: ${getTrackBackground};
    border-radius: 100px;
    cursor: pointer;
    height: 24px;
    position: relative;
    transition: background 0.2s;
    width: 48px;
`;

const Knob = styled.div`
    background: white;
    border-radius: 50%;
    height: 18px;
    left: ${getKnobLeft};
    position: absolute;
    top: 3px;
    transition: left 0.2s;
    width: 18px;
`;

/**
 * Toggle (on/off switch) component replacing @atlaskit/toggle.
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
const Toggle = ({ isDefaultChecked, onChange, value }) => {
    const checked = value === undefined ? isDefaultChecked : value;

    return (
        <label>
            <HiddenCheckbox
                checked = { Boolean(checked) }
                onChange = { onChange } />
            <Track checked = { checked }>
                <Knob checked = { checked } />
            </Track>
        </label>
    );
};

Toggle.propTypes = {
    isDefaultChecked: PropTypes.bool,
    onChange: PropTypes.func,
    value: PropTypes.bool
};

export default Toggle;
