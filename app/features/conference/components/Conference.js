
import Spinner from '@atlaskit/spinner';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import i18n from '../../../i18n';
import config from '../../config';
import { getSetting } from '../../settings';
import { parseURLParams } from '../../utils/parseURLParams';
import { conferenceEnded, conferenceJoined } from '../actions';
import JitsiMeetExternalAPI from '../external_api';
import { LoadingIndicator, Wrapper } from '../styled';

// For enabling remote control, please change ENABLE_REMOTE_CONTROL flag in
// main.js to true as well
const ENABLE_REMOTE_CONTROL = false;


/**
 * Conference component.
 */
class Conference extends Component {
    /**
     * Initializes a new {@code Conference} instance.
     *
     * @inheritdoc
     */
    constructor() {
        super();

        this.state = {
            isLoading: true
        };

        this._ref = React.createRef();

        this._onIframeLoad = this._onIframeLoad.bind(this);
        this._onVideoConferenceEnded = this._onVideoConferenceEnded.bind(this);
    }

    /**
     * Attach the script to this component.
     *
     * @returns {void}
     */
    componentDidMount() {
        const room = this.props.location.state.room;
        const serverTimeout = this.props._serverTimeout || config.defaultServerTimeout;
        const serverURL = this.props.location.state.serverURL
            || this.props._serverURL
            || config.defaultServerURL;

        this._conference = {
            room,
            serverURL
        };

        this._loadConference();

        // Set a timer for a timeout duration, if we haven't loaded the iframe by then,
        // give up.
        this._loadTimer = setTimeout(() => {
            this._navigateToHome(
                {
                    error: 'Loading error',
                    type: 'error'
                },
                room,
                serverURL);
        }, serverTimeout * 1000);
    }

    /**
     * Remove conference on unmounting.
     *
     * @returns {void}
     */
    componentWillUnmount() {
        if (this._loadTimer) {
            clearTimeout(this._loadTimer);
        }
        if (this._api) {
            this._api.dispose();
        }
    }

    /**
     * Handle joining another another meeing while in one.
     *
     * @param {Object} prevProps - The previous props.
     * @returns {void}
     */
    componentDidUpdate(prevProps) {
        if (prevProps.location.key !== this.props.location.key) {

            // Simulate a re-mount so the new meeting is joined.
            this._iframeLoaded = false;
            this.componentWillUnmount();
            this.componentDidMount();
        }
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <Wrapper innerRef = { this._ref }>
                { this._maybeRenderLoadingIndicator() }
            </Wrapper>
        );
    }

    /**
     * Load the conference by creating the iframe element in this component
     * and attaching utils from jitsi-meet-electron-utils.
     *
     * @returns {void}
     */
    _loadConference() {
        const appProtocolSurplus = `${config.appProtocolPrefix}://`;

        // replace the custom url with https, otherwise new URL() raises 'Invalid URL'.
        if (this._conference.serverURL.startsWith(appProtocolSurplus)) {
            this._conference.serverURL = this._conference.serverURL.replace(appProtocolSurplus, 'https://');
        }
        const url = new URL(this._conference.room, this._conference.serverURL);
        const roomName = url.pathname.split('/').pop();
        const host = this._conference.serverURL.replace(/https?:\/\//, '');
        const searchParameters = Object.fromEntries(url.searchParams);
        const hashParameters = parseURLParams(url);

        const locale = { lng: i18n.language };
        const urlParameters = {
            ...searchParameters,
            ...locale
        };


        const configOverwrite = {
            enableCalendarIntegration: false,
            disableAGC: this.props._disableAGC,
            prejoinConfig: {
                enabled: true
            }
        };

        const interfaceConfigOverwrite = {
            SHOW_CHROME_EXTENSION_BANNER: false
        };
        let jwt;

        Object.entries(hashParameters).forEach(([ key, value ]) => {
            if (key.startsWith('config.')) {
                const configKey = key.substring('config.'.length);

                configOverwrite[configKey] = value;
            } else if (key === 'jwt') {
                jwt = value;
            }
        });

        const options = {
            configOverwrite,
            interfaceConfigOverwrite,
            jwt,
            parentNode: this._ref.current,
            roomName,
            sandbox: 'allow-scripts allow-same-origin allow-popups allow-forms allow-downloads'
        };

        this._api = new JitsiMeetExternalAPI(host, {
            ...options,
            ...urlParameters
        });

        // This event is fired really early, at the same time as 'ready', but has been
        // around for longer.
        // TODO: remove after a while. -saghul
        this._api.on('browserSupport', this._onIframeLoad);

        this._api.on('suspendDetected', this._onVideoConferenceEnded);
        this._api.on('readyToClose', this._onVideoConferenceEnded);
        this._api.on('videoConferenceJoined',
            () => {
                this.props.dispatch(conferenceJoined(this._conference));
            }
        );

        // Setup Jitsi Meet Electron SDK on this renderer.
        window.jitsiNodeAPI.setupRenderer(this._api, {
            enableRemoteControl: ENABLE_REMOTE_CONTROL,
            enableAlwaysOnTopWindow: this.props._alwaysOnTopWindowEnabled
        });
    }

    /**
     * It renders a loading indicator, if appropriate.
     *
     * @returns {?ReactElement}
     */
    _maybeRenderLoadingIndicator() {
        if (this.state.isLoading) {
            return (
                <LoadingIndicator>
                    <Spinner size = 'large' />
                </LoadingIndicator>
            );
        }
    }

    /**
     * Navigates to home screen (Welcome).
     *
     * @param {Event} event - Event by which the function is called.
     * @param {string} room - Room name.
     * @param {string} serverURL - Server URL.
     * @returns {void}
     */
    _navigateToHome(event, room, serverURL) {
        this.props.dispatch(push('/', {
            error: event.type === 'error',
            room,
            serverURL
        }));
    }


    /**
     * Dispatches conference ended and navigates to home screen.
     *
     * @param {Event} event - Event by which the function is called.
     * @returns {void}
     * @private
     */
    _onVideoConferenceEnded(event) {
        this.props.dispatch(conferenceEnded(this._conference));
        this._navigateToHome(event);
    }


    /**
     * Sets state of loading to false when iframe has completely loaded.
     *
     * @returns {void}
     */
    _onIframeLoad() {
        if (this._iframeLoaded) {
            // Skip spurious event after meeting close.
            return;
        }

        console.log('IFrame loaded');

        this._iframeLoaded = true;

        if (this._loadTimer) {
            clearTimeout(this._loadTimer);
            this._loadTimer = null;
        }

        this.setState({
            isLoading: false
        });
    }
}

Conference.propTypes = {
    _alwaysOnTopWindowEnabled: PropTypes.bool,
    _disableAGC: PropTypes.bool,
    _serverTimeout: PropTypes.number,
    _serverURL: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired
};

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {Props}
 */
function _mapStateToProps(state) {
    return {
        _alwaysOnTopWindowEnabled: getSetting(state, 'alwaysOnTopWindowEnabled', true),
        _disableAGC: state.settings.disableAGC,
        _serverURL: state.settings.serverURL,
        _serverTimeout: state.settings.serverTimeout
    };
}

export default connect(_mapStateToProps)(Conference);
