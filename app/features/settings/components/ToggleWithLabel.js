// @flow

import Toggle from '@atlaskit/toggle';

import React, { Component } from 'react';

import { Label, ToggleContainer } from '../styled';

type Props = {

    /**
     * Label to show for toggle.
     */
    label: string;
};

/**
 * Toggles Buttons with label.
 */
class ToggleWithLabel extends Component<Props, *> {
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
