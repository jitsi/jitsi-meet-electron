// @flow

import React, { Component } from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import {
    RemoteControl,
    setupScreenSharingForWindow,
    setupAlwaysOnTopRender,
    setupWiFiStats
} from 'jitsi-meet-electron-utils';

import config from '../../config';

import { Wrapper } from '../styled';

type Props = {

    /**
     * React Router match object.
     * This contains parameters passed through <Route /> component.
     */
    match: Object;

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;
};

/**
 * Conference component.
 */
class Conference extends Component<Props, *> {
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

        this._ref = React.createRef();
    }

    /**
     * Attach the script to this component.
     *
     * @returns {void}
     */
    componentDidMount() {
        const parentNode = this._ref.current;
        const room = this.props.match.params.room;
        const domain = this.props.match.params.domain || config.defaultDomain;

        const script = document.createElement('script');

        script.async = true;
        script.onload = () => this._onScriptLoad(parentNode, room, domain);
        script.onerror = () => this._navigateToHome();
        script.src = `https://${domain}/external_api.js`;

        this._ref.current.appendChild(script);
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
        return <Wrapper innerRef = { this._ref } />;
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
     * @param {string} domain - Jitsi Meet server domain.
     * @returns {void}
     */
    _onScriptLoad(parentNode: Object, roomName: string, domain: string) {
        const JitsiMeetExternalAPI = window.JitsiMeetExternalAPI;

        this._api = new JitsiMeetExternalAPI(domain, {
            parentNode,
            roomName
        });
        const iframe = this._api.getIFrame();

        setupScreenSharingForWindow(iframe);
        new RemoteControl(iframe); // eslint-disable-line no-new
        setupAlwaysOnTopRender(this._api);
        setupWiFiStats(iframe);

        this._api.on('readyToClose', () => this._navigateToHome());
    }
}

export default connect()(Conference);
