// @flow

import { FieldTextStateless } from '@atlaskit/field-text';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import config from '../../config';
import { setServerURL } from '../actions';

type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;

    /**
     * Default Jitsi Meet Server URL in (redux) state.
     */
    _serverURL: string;
};

type State = {

    /**
     * Default Jitsi Meet Server URL in (local) state.
     */
    serverURL: string;
};

/**
 * Default Server URL field text placed in Settings Drawer.
 */
class ServerURLField extends Component<Props, State> {
    /**
     * Initializes a new {@code ServerURLField} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this.state = {
            serverURL: ''
        };

        this._onServerURLChange = this._onServerURLChange.bind(this);
        this._onServerURLSubmit = this._onServerURLSubmit.bind(this);
    }

    /**
     * This updates the Server URL in (local) state when there is a change
     * in redux state.
     *
     * @param {Props} props - New props of the component.
     * @returns {State} - New state of the component.
     */
    static getDerivedStateFromProps(props) {
        return {
            serverURL: props._serverURL
        };
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <form onSubmit = { this._onServerURLSubmit }>
                <FieldTextStateless
                    label = 'Server URL'
                    onBlur = { this._onServerURLSubmit }
                    onChange = { this._onServerURLChange }
                    placeholder = { config.defaultServerURL }
                    shouldFitContainer = { true }
                    type = 'text'
                    value = { this.state.serverURL } />
            </form>
        );
    }

    _onServerURLChange: (*) => void;

    /**
     * Updates Server URL in (redux) state when it is updated.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onServerURLChange(event: SyntheticInputEvent<HTMLInputElement>) {
        this.setState({
            serverURL: event.currentTarget.value
        });
    }

    _onServerURLSubmit: (*) => void;

    /**
     * Updates Server URL in (redux) state when it is updated.
     *
     * @param {Event} event - Event by which this function is called.
     * @returns {void}
     */
    _onServerURLSubmit(event: Event) {
        event.preventDefault();
        this.props.dispatch(setServerURL(this.state.serverURL));
    }
}

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
 *     _serverURL: string
 * }}
 */
function _mapStateToProps(state: Object) {
    return {
        _serverURL: state.settings.serverURL
    };
}

export default connect(_mapStateToProps)(ServerURLField);
