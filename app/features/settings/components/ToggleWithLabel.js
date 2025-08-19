
import Toggle from '@atlaskit/toggle';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Label, ToggleContainer } from '../styled';


/**
 * Toggles Buttons with label.
 */
class ToggleWithLabel extends Component {
    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <ToggleContainer>
                <Toggle
                    size = 'large'
                    { ...this.props } />
                <Label>{ this.props.label }</Label>
            </ToggleContainer>
        );
    }
}

ToggleWithLabel.propTypes = {
    isDefaultChecked: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.bool
};

export default ToggleWithLabel;
