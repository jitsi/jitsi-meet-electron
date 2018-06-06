// @flow

import { AtlasKitThemeProvider } from '@atlaskit/theme';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter as Router } from 'react-router-redux';

import { Conference } from '../../conference';
import config from '../../config';
import { history } from '../../router';
import { Welcome } from '../../welcome';

type Props = {

    /**
     * Theme that has to be used in AtlaskitThemeProvider
     * This could be 'dark' or 'light'
     */
    _theme: string;
};

/**
 * Main component encapsulating the entire application.
 */
class App extends Component<Props, *> {
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
            <AtlasKitThemeProvider mode = { this.props._theme }>
                <Router history = { history }>
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

/**
 * Maps (parts of) the redux state to the React props.
 */
function _mapStateToProps(state: Object) {
    return {
        _theme: state.app.theme
    };
}

export default connect(_mapStateToProps)(App);
