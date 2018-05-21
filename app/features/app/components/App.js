import React, { Component } from 'react';

import { Conference } from '../../conference';
import config from '../../config';

/**
 * Main component encapsulating the entire application.
 */
export default class App extends Component {
    /**
     * Initializes a new {@code App} instance.
     *
     * @inheritdoc
     */
    constructor() {
        super();

        document.title = config.appName;
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <Conference />
        );
    }
}
