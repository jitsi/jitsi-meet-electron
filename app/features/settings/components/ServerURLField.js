// @flow

import { FieldTextStateless } from '@atlaskit/field-text';

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { compose } from 'redux';

import config from '../../config';
import { normalizeServerURL } from '../../utils';

import { setServerURL } from '../actions';
import { Form } from '../styled';

type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;

    /**
     * Default Jitsi Meet Server URL in (redux) store.
     */
    _serverURL: string;

    /**
     * I18next translation function.
     */
    t: Function;
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
        const { t } = this.props;

        return (
            <Form onSubmit = { this._onServerURLSubmit }>
                <FieldTextStateless
                    invalidMessage = { t('settings.invalidServer') }
                    isInvalid = { !this.state.isValid }
                    isValidationHidden = { this.state.isValid }
                    label = { t('settings.serverUrl') }
                    onBlur = { this._onServerURLSubmit }
                    onChange = { this._onServerURLChange }
                    placeholder = { config.defaultServerURL }
                    shouldFitContainer = { true }
                    type = 'text'
                    value = { this.state.serverURL } />
            </Form>
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
     * Validates the Server URL.
     *
     * @returns {void}
     */
    _validateServerURL() {
        if (!this.state.serverURL.trim()) {
            return true;
        }

        const url = normalizeServerURL(this.state.serverURL);
        let isValid;

        try {
            // eslint-disable-next-line no-new
            const tmp = new URL(url);

            if (!tmp.protocol.startsWith('http')) {
                throw new Error('Invalid protocol');
            }

            isValid = true;
        } catch (_) {
            isValid = false;
        }

        this.setState({ isValid });
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

export default compose(connect(_mapStateToProps), withTranslation())(ServerURLField);
