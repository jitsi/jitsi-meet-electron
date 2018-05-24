// @flow

import { Component } from 'react';

import {
    RemoteControl,
    setupScreenSharingForWindow,
    setupAlwaysOnTopRender,
    setupWiFiStats

    // $FlowFixMe
} from 'jitsi-meet-electron-utils';

import config from '../../config';

/**
 * Jitsi Meet Window Component
 */
export default class Conference extends Component<{}> {
    /**
     * Attach the script
     */
    componentDidMount() {
        const script = document.createElement('script');

        script.async = true;
        script.onload = this._onScriptLoad;
        script.onerror = console.error;
        script.src = `https://${config.defaultDomain}/external_api.js`;

        // $FlowFixMe
        document.head.appendChild(script);
    }


    /**
     * Render function of component.
     *
     * @return {ReactElement}
     */
    render() {
        return null;
    }

    /**
     * When the script is loaded attach utils from jitsi-meet-electron-utils
     */
    _onScriptLoad() {
        const JitsiMeetExternalAPI = window.JitsiMeetExternalAPI;

        const api = new JitsiMeetExternalAPI(config.defaultDomain);
        const iframe = api.getIFrame();

        setupScreenSharingForWindow(iframe);
        new RemoteControl(iframe);
        setupAlwaysOnTopRender(api);
        setupWiFiStats(iframe);
    }
}
