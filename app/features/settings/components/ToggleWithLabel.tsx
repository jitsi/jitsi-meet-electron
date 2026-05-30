
import React, { Component } from 'react';

import Toggle from '../../shared/components/Toggle';
import { Label, ToggleContainer } from '../styled';

interface IProps {
    isDefaultChecked?: boolean;
    label?: string;
    onChange?: (event?: any) => void;
    value?: boolean;
}

/**
 * Toggles Buttons with label.
 */
class ToggleWithLabel extends Component<IProps> {
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

export default ToggleWithLabel;
