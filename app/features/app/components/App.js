// @flow

import { AtlasKitThemeProvider } from '@atlaskit/theme';

import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { ConnectedRouter as Router } from 'react-router-redux';

import { Conference } from '../../conference';
import config from '../../config';
import { history } from '../../router';
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
                <Router history = { history }>
                    <Switch>
                        <Route
                            component = { Welcome }
                            exact = { true }
                            path = '/' />
                        <Route
                            component = { Conference }
                            path = '/conference' />
                    </Switch>
                </Router>
            </AtlasKitThemeProvider>
        );
    }
}
