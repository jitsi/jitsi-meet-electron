
import { AtlasKitThemeProvider } from '@atlaskit/theme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter as Router, push } from 'react-router-redux';

import { Conference } from '../../conference';
import config from '../../config';
import { history } from '../../router';
import { createConferenceObjectFromURL } from '../../utils';
import { Welcome } from '../../welcome';

/**
 * Main component encapsulating the entire application.
 */
class App extends Component {
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

        this._listeners = [];
    }

    /**
     * Implements React's {@link Component#componentDidMount()}.
     *
     * @returns {void}
     */
    componentDidMount() {
        // start listening on this events
        const removeListener = window.jitsiNodeAPI.ipc.addListener('protocol-data-msg', this._listenOnProtocolMessages);

        // Meeting window: navigate to /conference when main process sends conference data.
        // Only the meeting window (identified by ?role=meeting query param) handles this.
        const removeConferenceListener = window.jitsiNodeAPI.ipc.addListener(
            'navigate-to-conference',
            conference => {
                // Only the meeting window should navigate to /conference.
                const isMeetingWindow
                    = window.location.search.includes('role=meeting');

                if (isMeetingWindow) {
                    this.props.dispatch(push('/conference', conference));
                }
            }
        );

        this._listeners.push(removeListener);
        this._listeners.push(removeConferenceListener);

        // send notification to main process
        window.jitsiNodeAPI.ipc.send('renderer-ready');
    }

    /**
     * Implements React's {@link Component#componentWillUnmount()}.
     *
     * @returns {void}
     */
    componentWillUnmount() {
        const listeners = this._listeners;

        this._listeners = [];
        listeners.forEach(removeListener => removeListener());
    }


    /**
     * Handler when main process contacts us with a protocol URL.
     * In the two-window architecture, this opens the meeting in Window 2
     * instead of navigating the launcher.
     *
     * @param {string} inputURL - String with room name.
     *
     * @returns {void}
     */
    _listenOnProtocolMessages(inputURL) {
        // Remove trailing slash if one exists.
        if (inputURL.slice(-1) === '/') {
            inputURL = inputURL.slice(0, -1); // eslint-disable-line no-param-reassign
        }

        const conference = createConferenceObjectFromURL(inputURL);

        // Don't navigate if conference couldn't be created
        if (!conference) {
            return;
        }

        // Open in the meeting window (Window 2), not in the launcher.
        window.jitsiNodeAPI.ipc.send('open-meeting-window', conference);
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

App.propTypes = {
    dispatch: PropTypes.func.isRequired
};

export default connect()(App);
