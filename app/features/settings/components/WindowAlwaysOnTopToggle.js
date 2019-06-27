// @flow

import { ipcRenderer } from 'electron';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { NoteLabel, TogglesContainer } from '../styled';
import {
    setWindowAlwaysOnTop
} from '../actions';

import ToggleWithLabel from './ToggleWithLabel';

type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;

    /**
     * Start with Window Always on top value in (redux) state.
     */
    _windowAlwaysOnTop: boolean;
};

type State = {

    /**
     * Start with Window Always on top value in (local) state.
     */
    windowAlwaysOnTop: boolean;
};

/**
 * Window always open on top placed in Settings Drawer.
 */
class WindowAlwaysOnTopToggle extends Component<Props, State> {
    /**
     * Initializes a new {@code WindowAlwaysOnTopToggle} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this.state = {
            windowAlwaysOnTop: true
        };

        this._onWindowAlwaysOnTopToggleChange
            = this._onWindowAlwaysOnTopToggleChange.bind(this);
    }

    /**
     * This updates the windowAlwaysOnTop in (local)
     * state when there is a change in redux store.
     *
     * @param {Props} props - New props of the component.
     * @returns {State} - New state of the component.
     */
    static getDerivedStateFromProps(props) {
        return {
            windowAlwaysOnTop: props._windowAlwaysOnTop
        };
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <TogglesContainer>
                <ToggleWithLabel
                    isDefaultChecked = { this.props._windowAlwaysOnTop }
                    label = 'Start with Window always on top'
                    onChange = { this._onWindowAlwaysOnTopToggleChange }
                    value = { this.state.windowAlwaysOnTop } />
                <NoteLabel
                    appearance = 'inline-edit'>
                    (Reload is needed to be applied)
                </NoteLabel>
            </TogglesContainer>
        );
    }

    _onWindowAlwaysOnTopToggleChange: (*) => void;

    /**
     * Toggles windowAlwaysOnTop.
     *
     * @returns {void}
     */
    _onWindowAlwaysOnTopToggleChange() {
        const { windowAlwaysOnTop } = this.state;
        const newState = !windowAlwaysOnTop;

        this.props.dispatch(setWindowAlwaysOnTop(newState));
        ipcRenderer.send('always-on-top-event', newState);
    }
}

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
 *     _windowAlwaysOnTop: boolean,
 * }}
 */
function _mapStateToProps(state: Object) {
    return {
        _windowAlwaysOnTop: state.settings.windowAlwaysOnTop
    };
}

export default connect(_mapStateToProps)(WindowAlwaysOnTopToggle);
