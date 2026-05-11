import React, { Component } from 'react';

import LogoSVG from '../../../images/logo.svg';
import { LogoWrapper } from '../styled';

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
            <LogoWrapper>
                <LogoSVG
                    aria-hidden = 'true'
                    height = '36'
                    width = '36' />
            </LogoWrapper>
        );
    }
}
