// @flow

import Spinner from '@atlaskit/spinner';

import React, { Component } from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import URL from 'url';

import {
    RemoteControl,
    setupScreenSharingForWindow,
    setupAlwaysOnTopRender,
    initPopupsConfigurationRender,
    setupWiFiStats
} from 'jitsi-meet-electron-utils';

import config from '../../config';
import { setEmail, setName } from '../../settings';

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
     * Reference to the element of this component.
     */
    _ref: Object;

    /**
     * External API object.
     */
    _api: Object;

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

        const script = document.createElement('script');

        script.async = true;
        script.onload = () => this._onScriptLoad(parentNode, room, serverURL);
        script.onerror = () => this._navigateToHome();
        script.src = getExternalApiURL(serverURL);

        this._ref.current.appendChild(script);
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
     * @returns {void}
     */
    _navigateToHome() {
        this.props.dispatch(push('/'));
    }

    /**
     * When the script is loaded create the iframe element in this component
     * and attach utils from jitsi-meet-electron-utils.
     *
     * @param {Object} parentNode - Node to which iframe has to be attached.
     * @param {string} roomName - Conference room name to be joined.
     * @param {string} serverURL - Jitsi Meet server url.
     * @returns {void}
     */
    _onScriptLoad(parentNode: Object, roomName: string, serverURL: string) {
        const JitsiMeetExternalAPI = window.JitsiMeetExternalAPI;

        const { host } = URL.parse(serverURL);

        this._api = new JitsiMeetExternalAPI(host, {
            onload: this._onIframeLoad,
            parentNode,
            roomName
        });
        initPopupsConfigurationRender(this._api);

        const iframe = this._api.getIFrame();

        setupScreenSharingForWindow(iframe);
        new RemoteControl(iframe); // eslint-disable-line no-new
        setupAlwaysOnTopRender(this._api);
        setupWiFiStats(iframe);

        this._api.on('readyToClose', () => this._navigateToHome());
        this._api.on('videoConferenceJoined',
            (conferenceInfo: Object) =>
                this._onVideoConferenceJoined(conferenceInfo));
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
        setupDragAreas(this._api.getIFrame());

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
 * Inject some style into the iframe so everything except the filmstrip, chat,
 * buttons or any input is draggable.
 *
 * @param {Object} iframe - reference to the iframe where the drag areas will
 * be set.
 * @returns {void}
 */
function setupDragAreas(iframe) {
    const injectStyle = document.createElement('style');

    injectStyle.type = 'text/css';
    injectStyle.textContent
        = 'body { -webkit-app-region: drag; }'
        + 'button, input { -webkit-app-region: no-drag }'
        + '#chatconversation, .filmstrip { -webkit-app-region: no-drag; }';
    iframe.contentDocument.head.appendChild(injectStyle);
}

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
 *     _avatarURL: string,
 *     _email: string,
 *     _name: string,
 *     _serverURL: string
 * }}
 */
function _mapStateToProps(state: Object) {
    return {
        _avatarURL: state.settings.avatarURL,
        _email: state.settings.email,
        _name: state.settings.name,
        _serverURL: state.settings.serverURL
    };
}

export default connect(_mapStateToProps)(Conference);
