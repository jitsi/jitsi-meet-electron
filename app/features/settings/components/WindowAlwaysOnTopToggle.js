// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { TogglesContainer } from '../styled';
import { setWindowAlwaysOnTop } from '../actions';

import ToggleWithLabel from './ToggleWithLabel';

type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;

    /**
     * Window Always on Top value in (redux) state.
     */
    _windowAlwaysOnTop: boolean;
};

/**
 * Window always open on top placed in Settings Drawer.
 */
class WindowAlwaysOnTopToggle extends Component<Props> {
    /**
     * Initializes a new {@code WindowAlwaysOnTopToggle} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this._onWindowAlwaysOnTopToggleChange
            = this._onWindowAlwaysOnTopToggleChange.bind(this);
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
                    label = 'Always on Top Window'
                    onChange = { this._onWindowAlwaysOnTopToggleChange }
                    value = { this.props._windowAlwaysOnTop } />
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
        const { _windowAlwaysOnTop } = this.props;
        const newState = !_windowAlwaysOnTop;

        this.props.dispatch(setWindowAlwaysOnTop(newState));
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
