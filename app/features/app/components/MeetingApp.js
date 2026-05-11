import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Spinner } from '../../base-ui';
import { Conference } from '../../conference';
import config from '../../config';
import { createConferenceObjectFromURL } from '../../utils';

const LoadingContainer = styled.div`
    align-items: center;
    display: flex;
    height: 100vh;
    justify-content: center;
`;

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
                if (conference && typeof conference === 'object' && conference.room) {
                    try {
                        const defaultURL = this.props._serverURL || config.defaultServerURL;
                        const serverURL = conference.serverURL || defaultURL;
                        const url = new URL(conference.room, serverURL);

                        document.title = url.href;
                    } catch (e) {
                        const defaultURL = this.props._serverURL || config.defaultServerURL;
                        const serverURL = conference.serverURL || defaultURL;

                        document.title = `${serverURL}/${conference.room}`;
                    }
                    this.setState({ conference });
                } else {
                    console.warn('Invalid conference object received over IPC');
                }
            }
        );

        this._removeProtocolDataListener = window.jitsiNodeAPI.ipc.addListener(
            'protocol-data-msg',
            inputURL => {
                let parsedURL = inputURL;

                // Remove trailing slash if one exists.
                if (parsedURL.slice(-1) === '/') {
                    parsedURL = parsedURL.slice(0, -1);
                }

                const conference = createConferenceObjectFromURL(parsedURL);

                if (conference && conference.room) {
                    this.setState({ conference });
                }
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

        if (this._removeProtocolDataListener) {
            this._removeProtocolDataListener();
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
            return (
                <LoadingContainer>
                    <Spinner size = 'large' />
                </LoadingContainer>
            );
        }

        return <Conference conference = { conference } />;
    }
}

MeetingApp.propTypes = {
    _serverURL: PropTypes.string
};

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {Props}
 */
function _mapStateToProps(state) {
    return {
        _serverURL: state.settings.serverURL
    };
}

export default connect(_mapStateToProps)(MeetingApp);
