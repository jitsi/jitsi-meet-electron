// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

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
    _alwaysOnTopWindowEnabled: boolean;
};

/**
 * Window always open on top placed in Settings Drawer.
 */
class AlwaysOnTopWindowToggle extends Component<Props> {
    /**
     * Initializes a new {@code AlwaysOnTopWindowToggle} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this._onAlwaysOnTopWindowToggleChange
            = this._onAlwaysOnTopWindowToggleChange.bind(this);
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <ToggleWithLabel
                isDefaultChecked = { this.props._alwaysOnTopWindowEnabled }
                label = 'Always on Top Window'
                onChange = { this._onAlwaysOnTopWindowToggleChange }
                value = { this.props._alwaysOnTopWindowEnabled } />
        );
    }

    _onAlwaysOnTopWindowToggleChange: (*) => void;

    /**
     * Toggles alwaysOnTopWindowEnabled.
     *
     * @returns {void}
     */
    _onAlwaysOnTopWindowToggleChange() {
        const { _alwaysOnTopWindowEnabled } = this.props;
        const newState = !_alwaysOnTopWindowEnabled;

        this.props.dispatch(setWindowAlwaysOnTop(newState));
    }
}

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
 *     _alwaysOnTopWindowEnabled: boolean,
 * }}
 */
function _mapStateToProps(state: Object) {
    return {
        _alwaysOnTopWindowEnabled: state.settings.alwaysOnTopWindowEnabled
    };
}

export default connect(_mapStateToProps)(AlwaysOnTopWindowToggle);
