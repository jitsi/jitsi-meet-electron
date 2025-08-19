
import { FieldTextStateless } from '@atlaskit/field-text';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';

import config from '../../config';
import { normalizeServerURL } from '../../utils';
import { setServerURL } from '../actions';
import { Form } from '../styled';


/**
 * Default Server URL field text placed in the Settings drawer.
 */
class ServerURLField extends Component {
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


    /**
     * Updates Server URL in (redux) state when it is updated.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onServerURLChange(event) {
        this.setState({
            serverURL: event.currentTarget.value
        }, this._validateServerURL);
    }


    /**
     * Updates Server URL in (redux) store when it is updated.
     *
     * @param {Event} event - Event by which this function is called.
     * @returns {void}
     */
    _onServerURLSubmit(event) {
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

ServerURLField.propTypes = {
    _serverURL: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
};

/**
 * Maps (parts of) the redux store to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
 *     _serverURL
 * }}
 */
function _mapStateToProps(state) {
    return {
        _serverURL: state.settings.serverURL
    };
}

export default compose(connect(_mapStateToProps), withTranslation())(ServerURLField);
