
import { AtlasKitThemeProvider } from '@atlaskit/theme';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Conference } from '../../conference';
import config from '../../config';
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

        this.state = {
            conference: null,
            isMeetingWindow: window.location.search.includes('role=meeting')
        };

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

        // Meeting window: render conference when main process sends conference data.
        const removeConferenceListener = window.jitsiNodeAPI.ipc.addListener(
            'navigate-to-conference',
            conference => {
                if (this.state.isMeetingWindow) {
                    this.setState({ conference });
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
        const { isMeetingWindow, conference } = this.state;
        let content;

        if (isMeetingWindow) {
            // Wait for the IPC message to deliver the conference details.
            if (!conference) {
                return null;
            }

            content = <Conference conference = { conference } />;
        } else {
            content = <Welcome />;
        }

        return (
            <AtlasKitThemeProvider mode = 'dark'>
                { content }
            </AtlasKitThemeProvider>
        );
    }
}

export default connect()(App);
