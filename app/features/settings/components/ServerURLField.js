// @flow

import { FieldTextStateless } from '@atlaskit/field-text';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import config from '../../config';
import { getExternalApiURL } from '../../utils';

import { setServerURL } from '../actions';

type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;

    /**
     * Default Jitsi Meet Server URL in (redux) store.
     */
    _serverURL: string;
};

type State = {

     /**
     * Whether the url of the Jitsi Meet Server valid.
     */
    isValid: boolean;

    /**
     * Default Jitsi Meet Server URL in (local) state.
     */
    serverURL: string;
};

/**
 * Default Server URL field text placed in the Settings drawer.
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
            isValid: true,
            serverURL: props._serverURL
        };

        this._onServerURLChange = this._onServerURLChange.bind(this);
        this._onServerURLSubmit = this._onServerURLSubmit.bind(this);
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
                    invalidMessage
                        = { 'Invalid Server URL or external API not enabled' }
                    isInvalid = { !this.state.isValid }
                    isValidationHidden = { this.state.isValid }
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
        }, this._validateServerURL);
    }

    _onServerURLSubmit: (*) => void;

    /**
     * Updates Server URL in (redux) store when it is updated.
     *
     * @param {Event} event - Event by which this function is called.
     * @returns {void}
     */
    _onServerURLSubmit(event: Event) {
        event.preventDefault();
        if (this.state.isValid) {
            this.props.dispatch(setServerURL(this.state.serverURL));
        }
    }

    /**
     * Validates the Server URL by fetching external_api.js using the HEAD
     * method.
     *
     * @returns {void}
     */
    _validateServerURL() {
        fetch(getExternalApiURL(this.state.serverURL), {
            method: 'HEAD'
        })
        .then((response: Object) => {
            this.setState({
                isValid: response.ok
            });
        })
        .catch(() => {
            this.setState({
                isValid: false
            });
        });
    }
}

/**
 * Maps (parts of) the redux store to the React props.
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
