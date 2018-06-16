// @flow

import Icon from '@atlaskit/icon';

import React, { Component } from 'react';

import LogoSVG from '../../../images/logo.svg';

/**
 * Logo component.
 */
export default class Logo extends Component<*> {

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <Icon
                glyph = { LogoSVG }
                size = 'xlarge' />
        );
    }
}

