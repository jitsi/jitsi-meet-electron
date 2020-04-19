// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import {
    setStartWithAudioMuted,
    setStartWithVideoMuted
} from '../actions';

import ToggleWithLabel from './ToggleWithLabel';

type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;

    /**
     * Start with Audio Muted value in (redux) state.
     */
    _startWithAudioMuted: boolean;

    /**
     * Start with Video Muted value in (redux) state.
     */
    _startWithVideoMuted: boolean;
};

type State = {

    /**
     * Start with Audio Muted value in (local) state.
     */
    startWithAudioMuted: boolean;

    /**
     * Start with Video Muted value in (local) state.
     */
    startWithVideoMuted: boolean;
};

/**
 * Start Muted toggles for audio and video placed in Settings Drawer.
 */
class StartMutedToggles extends Component<Props, State> {
    /**
     * Initializes a new {@code StartMutedToggles} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this.state = {
            startWithAudioMuted: false,
            startWithVideoMuted: false
        };

        this._onAudioToggleChange = this._onAudioToggleChange.bind(this);
        this._onVideoToggleChange = this._onVideoToggleChange.bind(this);
    }

    /**
     * This updates the startWithAudioMuted and startWithVideoMuted in (local)
     * state when there is a change in redux store.
     *
     * @param {Props} props - New props of the component.
     * @returns {State} - New state of the component.
     */
    static getDerivedStateFromProps(props) {
        return {
            startWithAudioMuted: props._startWithAudioMuted,
            startWithVideoMuted: props._startWithVideoMuted
        };
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <>
                <ToggleWithLabel
                    isDefaultChecked = { this.props._startWithAudioMuted }
                    label = 'Start with Audio muted'
                    onChange = { this._onAudioToggleChange }
                    value = { this.state.startWithAudioMuted } />
                <ToggleWithLabel
                    isDefaultChecked = { this.props._startWithVideoMuted }
                    label = 'Start with Video muted'
                    onChange = { this._onVideoToggleChange }
                    value = { this.state.startWithVideoMuted } />
            </>
        );
    }

    _onAudioToggleChange: (*) => void;

    /**
     * Toggles startWithAudioMuted.
     *
     * @returns {void}
     */
    _onAudioToggleChange() {
        const { startWithAudioMuted } = this.state;

        this.props.dispatch(setStartWithAudioMuted(!startWithAudioMuted));
    }

    _onVideoToggleChange: (*) => void;

    /**
     * Toggles startWithVideoMuted.
     *
     * @returns {void}
     */
    _onVideoToggleChange() {
        const { startWithVideoMuted } = this.state;

        this.props.dispatch(setStartWithVideoMuted(!startWithVideoMuted));
    }
}

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
 *     _startWithAudioMuted: boolean,
 *     _startWithVideoMuted: boolean
 * }}
 */
function _mapStateToProps(state: Object) {
    return {
        _startWithAudioMuted: state.settings.startWithAudioMuted,
        _startWithVideoMuted: state.settings.startWithVideoMuted
    };
}

export default connect(_mapStateToProps)(StartMutedToggles);
