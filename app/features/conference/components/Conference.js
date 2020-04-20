// @flow

import Spinner from '@atlaskit/spinner';

import React, { Component } from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import config from '../../config';
import { getSetting, setEmail, setName } from '../../settings';

import { conferenceEnded, conferenceJoined } from '../actions';
import { LoadingIndicator, Wrapper } from '../styled';
import { getExternalApiURL } from '../../utils';

type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;

    /**
     * React Router location object.
     */
    location: Object;

    /**
     * AlwaysOnTop Window Enabled.
     */
    _alwaysOnTopWindowEnabled: boolean;

    /**
     * Avatar URL.
     */
    _avatarURL: string;

    /**
     * Email of user.
     */
    _email: string;

    /**
     * Name of user.
     */
    _name: string;

    /**
     * Default Jitsi Server URL.
     */
    _serverURL: string;

    /**
     * Start with Audio Muted.
     */
    _startWithAudioMuted: boolean;

    /**
     * Start with Video Muted.
     */
    _startWithVideoMuted: boolean;
};

type State = {

    /**
     * If the conference is loading or not.
     */
    isLoading: boolean;
};

/**
 * Conference component.
 */
class Conference extends Component<Props, State> {
    /**
     * External API object.
     */
    _api: Object;

    /**
     * Conference Object.
     */
    _conference: Object;

    /**
     * Timer to cancel the joining if it takes too long.
     */
    _loadTimer: ?TimeoutID;

    /**
     * Reference to the element of this component.
     */
    _ref: Object;

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
        const parentNode = this._ref.current;
        const room = this.props.location.state.room;
        const serverURL = this.props.location.state.serverURL
            || this.props._serverURL
            || config.defaultServerURL;

        this._conference = {
            room,
            serverURL
        };

        const script = document.createElement('script');

        script.async = true;
        script.onload = () => this._onScriptLoad(parentNode);
        script.onerror = (event: Event) =>
            this._navigateToHome(event, room, serverURL);
        script.src = getExternalApiURL(serverURL);

        this._ref.current.appendChild(script);

        // Set a timer for 10s, if we haven't loaded the iframe by then,
        // give up.
        this._loadTimer = setTimeout(() => {
            this._navigateToHome(

                // $FlowFixMe
                {
                    error: 'Loading error',
                    type: 'error'
                },
                room,
                serverURL);
        }, 10000);
    }

    /**
     * Keep profile settings in sync with Conference.
     *
     * @param {Props} prevProps - Component's prop values before update.
     * @returns {void}
     */
    componentDidUpdate(prevProps) {
        const { props } = this;

        if (props._avatarURL !== prevProps._avatarURL) {
            this._setAvatarURL(props._avatarURL);
        }
        if (props._email !== prevProps._email) {
            this._setEmail(props._email);
        }
        if (props._name !== prevProps._name) {
            this._setName(props._name);
        }
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
    _navigateToHome(event: Event, room: ?string, serverURL: ?string) {
        this.props.dispatch(push('/', {
            error: event.type === 'error',
            room,
            serverURL
        }));
    }

    /**
     * When the script is loaded create the iframe element in this component
     * and attach utils from jitsi-meet-electron-utils.
     *
     * @param {Object} parentNode - Node to which iframe has to be attached.
     * @returns {void}
     */
    _onScriptLoad(parentNode: Object) {
        const JitsiMeetExternalAPI = window.JitsiMeetExternalAPI;
        const url = new URL(this._conference.room, this._conference.serverURL);
        const roomName = url.pathname.split('/').pop();
        const host = this._conference.serverURL.replace(/https?:\/\//, '');
        const searchParameters = Object.fromEntries(url.searchParams);
        const urlParameters = Object.keys(searchParameters).length ? searchParameters : {};

        const configOverwrite = {
            startWithAudioMuted: this.props._startWithAudioMuted,
            startWithVideoMuted: this.props._startWithVideoMuted
        };

        const options = {
            configOverwrite,
            onload: this._onIframeLoad,
            parentNode,
            roomName
        };

        this._api = new JitsiMeetExternalAPI(host, {
            ...options,
            ...urlParameters
        });

        const { RemoteControl,
            setupScreenSharingRender,
            setupAlwaysOnTopRender,
            initPopupsConfigurationRender,
            setupWiFiStats,
            setupPowerMonitorRender
        } = window.jitsiNodeAPI.jitsiMeetElectronUtils;

        initPopupsConfigurationRender(this._api);

        const iframe = this._api.getIFrame();

        setupScreenSharingRender(this._api);
        new RemoteControl(iframe); // eslint-disable-line no-new

        // Allow window to be on top if enabled in settings
        if (this.props._alwaysOnTopWindowEnabled) {
            setupAlwaysOnTopRender(this._api);
        }

        setupWiFiStats(iframe);
        setupPowerMonitorRender(this._api);

        this._api.on('suspendDetected', this._onVideoConferenceEnded);
        this._api.on('readyToClose', this._onVideoConferenceEnded);
        this._api.on('videoConferenceJoined',
            (conferenceInfo: Object) => {
                this.props.dispatch(conferenceJoined(this._conference));
                this._onVideoConferenceJoined(conferenceInfo);
            }
        );
    }

    _onVideoConferenceEnded: (*) => void;

    /**
     * Dispatches conference ended and navigates to home screen.
     *
     * @param {Event} event - Event by which the function is called.
     * @returns {void}
     * @private
     */
    _onVideoConferenceEnded(event: Event) {
        this.props.dispatch(conferenceEnded(this._conference));
        this._navigateToHome(event);
    }

    /**
     * Updates redux state's user name from conference.
     *
     * @param {Object} params - Returned object from event.
     * @param {string} id - Local Participant ID.
     * @returns {void}
     */
    _onDisplayNameChange(params: Object, id: string) {
        if (params.id === id) {
            this.props.dispatch(setName(params.displayname));
        }
    }

    /**
     * Updates redux state's email from conference.
     *
     * @param {Object} params - Returned object from event.
     * @param {string} id - Local Participant ID.
     * @returns {void}
     */
    _onEmailChange(params: Object, id: string) {
        if (params.id === id) {
            this.props.dispatch(setEmail(params.email));
        }
    }

    _onIframeLoad: (*) => void;

    /**
     * Sets state of loading to false when iframe has completely loaded.
     *
     * @returns {void}
     */
    _onIframeLoad() {
        if (this._loadTimer) {
            clearTimeout(this._loadTimer);
            this._loadTimer = null;
        }

        this.setState({
            isLoading: false
        });
    }

    /**
     * Saves conference info on joining it.
     *
     * @param {Object} conferenceInfo - Contains information about the current
     * conference.
     * @returns {void}
     */
    _onVideoConferenceJoined(conferenceInfo: Object) {
        this._setAvatarURL(this.props._avatarURL);
        this._setEmail(this.props._email);
        this._setName(this.props._name);

        const { id } = conferenceInfo;

        this._api.on('displayNameChange',
            (params: Object) => this._onDisplayNameChange(params, id));
        this._api.on('emailChange',
            (params: Object) => this._onEmailChange(params, id));
    }

    /**
     * Set Avatar URL from settings to conference.
     *
     * @param {string} avatarURL - Avatar URL.
     * @returns {void}
     */
    _setAvatarURL(avatarURL: string) {
        this._api.executeCommand('avatarUrl', avatarURL);
    }

    /**
     * Set email from settings to conference.
     *
     * @param {string} email - Email of user.
     * @returns {void}
     */
    _setEmail(email: string) {
        this._api.executeCommand('email', email);
    }

    /**
     * Set name from settings to conference.
     *
     * @param {string} name - Name of user.
     * @returns {void}
     */
    _setName(name: string) {
        this._api.executeCommand('displayName', name);
    }

}

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {Props}
 */
function _mapStateToProps(state: Object) {
    return {
        _alwaysOnTopWindowEnabled:
            getSetting(state, 'alwaysOnTopWindowEnabled', true),
        _avatarURL: state.settings.avatarURL,
        _email: state.settings.email,
        _name: state.settings.name,
        _serverURL: state.settings.serverURL,
        _startWithAudioMuted: state.settings.startWithAudioMuted,
        _startWithVideoMuted: state.settings.startWithVideoMuted
    };
}

export default connect(_mapStateToProps)(Conference);
