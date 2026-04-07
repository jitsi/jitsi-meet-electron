import { AtlasKitThemeProvider } from '@atlaskit/theme';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Conference } from '../../conference';
import config from '../../config';

/**
 * Main component encapsulating the Meeting Window application.
 */
class MeetingApp extends Component {
    /**
     * Initializes a new {@code MeetingApp} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        document.title = config.appName;

        this.state = {
            conference: null
        };
    }

    /**
     * Implements React's {@link Component#componentDidMount()}.
     *
     * @returns {void}
     */
    componentDidMount() {
        // Meeting window: set conference data when main process sends it.
        this._removeConferenceListener = window.jitsiNodeAPI.ipc.addListener(
            'navigate-to-conference',
            conference => {
                this.setState({ conference });
            }
        );

        // send notification to main process
        window.jitsiNodeAPI.ipc.send('renderer-ready');
    }

    /**
     * Implements React's {@link Component#componentWillUnmount()}.
     *
     * @returns {void}
     */
    componentWillUnmount() {
        if (this._removeConferenceListener) {
            this._removeConferenceListener();
        }
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { conference } = this.state;

        // Wait for the IPC message to deliver the conference details.
        if (!conference) {
            return null;
        }

        return (
            <AtlasKitThemeProvider mode = 'dark'>
                <Conference conference = { conference } />
            </AtlasKitThemeProvider>
        );
    }
}

export default connect()(MeetingApp);
