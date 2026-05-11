import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Toggle } from '../../base-ui';
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
                    checked = { this.props.value }
                    onChange = { this.props.onChange } />
                <Label>{ this.props.label }</Label>
            </ToggleContainer>
        );
    }
}

ToggleWithLabel.propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.bool
};

export default ToggleWithLabel;
