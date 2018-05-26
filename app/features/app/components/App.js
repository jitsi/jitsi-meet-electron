// @flow

import { AtlasKitThemeProvider } from '@atlaskit/theme';

import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import { Conference } from '../../conference';
import config from '../../config';
import { Welcome } from '../../welcome';

/**
 * Main component encapsulating the entire application.
 */
export default class App extends Component<*> {
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
            <AtlasKitThemeProvider mode = 'dark'>
                <Router>
                    <Switch>
                        <Route
                            exact
                            component = { Welcome }
                            path = '/' />
                        <Route
                            component = { Conference }
                            path = '/:domain?/:room' />
                    </Switch>
                </Router>
            </AtlasKitThemeProvider>
        );
    }
}
