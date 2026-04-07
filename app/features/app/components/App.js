import { AtlasKitThemeProvider } from '@atlaskit/theme';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import config from '../../config';
import { addRecentListEntry } from '../../recent-list/actions';
import { createConferenceObjectFromURL } from '../../utils';
import { Welcome } from '../../welcome';

/**
 * Main component encapsulating the Launcher application.
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
    }

    /**
     * Implements React's {@link Component#componentDidMount()}.
     *
     * @returns {void}
     */
    componentDidMount() {
        // start listening on this events
        this._removeListener = window.jitsiNodeAPI.ipc.addListener('protocol-data-msg', this._listenOnProtocolMessages);

        // send notification to main process
        window.jitsiNodeAPI.ipc.send('renderer-ready');
    }

    /**
     * Implements React's {@link Component#componentWillUnmount()}.
     *
     * @returns {void}
     */
    componentWillUnmount() {
        if (this._removeListener) {
            this._removeListener();
        }
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

        this.props.dispatch(addRecentListEntry(conference));

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
                <Welcome />
            </AtlasKitThemeProvider>
        );
    }
}

export default connect()(App);
