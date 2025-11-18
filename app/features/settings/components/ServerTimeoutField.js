
import { FieldTextStateless } from '@atlaskit/field-text';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';


import config from '../../config';
import { setServerTimeout } from '../actions';
import { Form } from '../styled';


/**
 * Default Server URL field text placed in the Settings drawer.
 */
class ServerTimeoutField extends Component {
    /**
     * Initializes a new {@code ServerTimeoutField} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this.state = {
            isValid: true,
            serverTimeout: props._serverTimeout
        };

        this._onServerTimeoutChange = this._onServerTimeoutChange.bind(this);
        this._onServerTimeoutSubmit = this._onServerTimeoutSubmit.bind(this);
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        const { t } = this.props;

        return (
            <Form onSubmit = { this._onServerTimeoutSubmit }>
                <FieldTextStateless
                    invalidMessage
                        = { t('settings.invalidServerTimeout') }
                    isInvalid = { !this.state.isValid }
                    isValidationHidden = { this.state.isValid }
                    label = { t('settings.serverTimeout') }
                    onBlur = { this._onServerTimeoutSubmit }
                    onChange = { this._onServerTimeoutChange }
                    placeholder = { config.defaultServerTimeout }
                    shouldFitContainer = { true }
                    type = 'number'
                    value = { this.state.serverTimeout } />
            </Form>
        );
    }


    /**
     * Updates Server Timeout in (redux) state when it is updated.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onServerTimeoutChange(event) {
        this.setState({
            serverTimeout: Number.parseInt(event.currentTarget.value, 10)
        }, this._validateServerTimeout);
    }


    /**
     * Updates Server Timeout in (redux) store when it is updated.
     *
     * @param {Event} event - Event by which this function is called.
     * @returns {void}
     */
    _onServerTimeoutSubmit(event) {
        event.preventDefault();
        if (this.state.isValid) {
            this.props.dispatch(setServerTimeout(this.state.serverTimeout));
        }
    }

    /**
     * Validates timeout is a valid Number.
     *
     * @returns {void}
     */
    _validateServerTimeout() {
        this.setState({
            isValid: Math.sign(this.state.serverTimeout) === 1
        });
    }
}

ServerTimeoutField.propTypes = {
    _serverTimeout: PropTypes.number,
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
        _serverTimeout: state.settings.serverTimeout
    };
}

export default compose(connect(_mapStateToProps), withTranslation())(ServerTimeoutField);
