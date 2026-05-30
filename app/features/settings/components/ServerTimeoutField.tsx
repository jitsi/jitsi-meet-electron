
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch, compose } from 'redux';

import type { IState } from '../../../types';
import config from '../../config';
import FieldText from '../../shared/components/FieldText';
import { setServerTimeout } from '../actions';
import { Form } from '../styled';

interface IProps extends WithTranslation {
    _serverTimeout?: number;
    dispatch: Dispatch;
}

interface IServerTimeoutFieldState {
    isValid: boolean;
    serverTimeout?: number;
}

/**
 * Default Server URL field text placed in the Settings drawer.
 */
class ServerTimeoutField extends Component<IProps, IServerTimeoutFieldState> {
    /**
     * Initializes a new {@code ServerTimeoutField} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps) {
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
                <FieldText
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
    _onServerTimeoutChange(event: React.ChangeEvent<HTMLInputElement>) {
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
    _onServerTimeoutSubmit(event: React.FormEvent) {
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
            isValid: Math.sign(this.state.serverTimeout as number) === 1
        });
    }
}

/**
 * Maps (parts of) the redux store to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
 *     _serverURL
 * }}
 */
function _mapStateToProps(state: IState) {
    return {
        _serverTimeout: state.settings.serverTimeout
    };
}

// redux's compose() returns a loosely-typed function; cast so the connected +
// translated component is usable as JSX / a ComponentType by consumers.
export default compose(connect(_mapStateToProps), withTranslation())(ServerTimeoutField) as React.ComponentType<any>;
