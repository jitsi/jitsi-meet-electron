
import React, { Component } from 'react';

import LogoSVG from '../../../images/logo.svg';

/**
 * Logo component.
 */
export default class Logo extends Component {

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <LogoSVG
                height = { 40 }
                width = { 40 } />
        );
    }
}
