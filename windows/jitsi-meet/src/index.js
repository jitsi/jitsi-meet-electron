import React from 'react';
import { render } from 'react-dom';

import {
    RemoteControl,
    setupScreenSharingForWindow,
    setupAlwaysOnTopRender,
    setupWiFiStats
} from 'jitsi-meet-electron-utils';

import { jitsiMeetDomain } from '../../../config.js';

/**
 * Jitsi Meet Window Component
 */
class JitsiMeetWindow extends React.Component {

    /**
     * Render function of component
     * @return {ScriptElement}
     */
    render() {
        return null;
    }

    /**
     * Attach the script
     */
    componentDidMount() {

        const script = document.createElement('script');

        script.async = true;
        script.onload = this._onScriptLoad;
        script.onerror = console.error;
        script.src = `https://${jitsiMeetDomain}/external_api.js`;

        document.head.appendChild(script);
    }

    /**
     * When the script is loaded attach utils from jitsi-meet-electron-utils
     */
    _onScriptLoad() {
        const JitsiMeetExternalAPI = window.JitsiMeetExternalAPI;

        const api = new JitsiMeetExternalAPI(jitsiMeetDomain);
        const iframe = api.getIFrame();

        setupScreenSharingForWindow(iframe);
        new RemoteControl(iframe);
        setupAlwaysOnTopRender(api);
        setupWiFiStats(iframe);
    }
}

render(<JitsiMeetWindow />, document.getElementById('app'));
