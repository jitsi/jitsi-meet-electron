// @flow

import { AtlasKitThemeProvider } from '@atlaskit/theme';

import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';
import { ConnectedRouter as Router, push } from 'react-router-redux';

import { Conference } from '../../conference';
import config from '../../config';
import { history } from '../../router';
import { createConferenceObjectFromURL } from '../../utils';
import { Welcome } from '../../welcome';

/**
 * Main component encapsulating the entire application.
 */
class App extends Component<*> {
    /**
     * Initializes a new {@code App} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        document.title = config.appName;

        this._listenOnProtocolMessages
            = this._listenOnProtocolMessages.bind(this);
    }

    /**
     * Implements React's {@link Component#componentDidMount()}.
     *
     * @returns {void}
     */
    componentDidMount() {
        // start listening on this events
        window.jitsiNodeAPI.ipc.on('protocol-data-msg', this._listenOnProtocolMessages);

        // send notification to main process
        window.jitsiNodeAPI.ipc.send('renderer-ready');
    }

    /**
     * Implements React's {@link Component#componentWillUnmount()}.
     *
     * @returns {void}
     */
    componentWillUnmount() {
        // remove listening for this events
        window.jitsiNodeAPI.ipc.removeListener(
            'protocol-data-msg',
            this._listenOnProtocolMessages
        );
    }

    _listenOnProtocolMessages: (*) => void;

    /**
     * Handler when main proccess contact us.
     *
     * @param {Object} event - Message event.
     * @param {string} inputURL - String with room name.
     *
     * @returns {void}
     */
    _listenOnProtocolMessages(event, inputURL: string) {
        // Remove trailing slash if one exists.
        if (inputURL.substr(-1) === '/') {
            inputURL = inputURL.substr(0, inputURL.length - 1); // eslint-disable-line no-param-reassign
        }

        const conference = createConferenceObjectFromURL(inputURL);

        // Don't navigate if conference couldn't be created
        if (!conference) {
            return;
        }

        // change route when we are notified
        this.props.dispatch(push('/conference', conference));
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

export default connect()(App);
