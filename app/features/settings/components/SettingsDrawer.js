// @flow

import Avatar from '@atlaskit/avatar';
import FieldText from '@atlaskit/field-text';
import ArrowLeft from '@atlaskit/icon/glyph/arrow-left';
import { AkCustomDrawer } from '@atlaskit/navigation';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import config from '../../config';
import { closeDrawer, DrawerContainer, Logo } from '../../navbar';
import { AvatarContainer, SettingsContainer } from '../styled';
import { setEmail, setName, setServerURL } from '../actions';

type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;

    /**
     * Is the drawer open or not.
     */
    isOpen: boolean;

    /**
     * Avatar URL.
     */
    _avatarURL: string;

    /**
     * Email of the user.
     */
    _email: string;

    /**
     * Name of the user.
     */
    _name: string;

    /**
     * Default Jitsi Server URL.
     */
    _serverURL: string;
};

/**
 * Drawer that open when SettingsAction is clicked.
 */
class SettingsDrawer extends Component<Props, *> {
    /**
     * Initializes a new {@code SettingsDrawer} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this._onBackButton = this._onBackButton.bind(this);
        this._onEmailBlur = this._onEmailBlur.bind(this);
        this._onEmailFormSubmit = this._onEmailFormSubmit.bind(this);
        this._onNameBlur = this._onNameBlur.bind(this);
        this._onNameFormSubmit = this._onNameFormSubmit.bind(this);
        this._onServerURLBlur = this._onServerURLBlur.bind(this);
        this._onServerURLFormSubmit = this._onServerURLFormSubmit.bind(this);
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <AkCustomDrawer
                backIcon = { <ArrowLeft label = 'Back' /> }
                isOpen = { this.props.isOpen }
                onBackButton = { this._onBackButton }
                primaryIcon = { <Logo /> } >
                <DrawerContainer>
                    <SettingsContainer>
                        <AvatarContainer>
                            <Avatar
                                size = 'xlarge'
                                src = { this.props._avatarURL } />
                        </AvatarContainer>
                        <form onSubmit = { this._onNameFormSubmit }>
                            <FieldText
                                label = 'Name'
                                onBlur = { this._onNameBlur }
                                shouldFitContainer = { true }
                                type = 'text'
                                value = { this.props._name } />
                        </form>
                        <form onSubmit = { this._onEmailFormSubmit }>
                            <FieldText
                                label = 'Email'
                                onBlur = { this._onEmailBlur }
                                shouldFitContainer = { true }
                                type = 'text'
                                value = { this.props._email } />
                        </form>
                        <form onSubmit = { this._onServerURLFormSubmit }>
                            <FieldText
                                label = 'Server URL'
                                onBlur = { this._onServerURLBlur }
                                placeholder = { config.defaultServerURL }
                                shouldFitContainer = { true }
                                type = 'text'
                                value = { this.props._serverURL } />
                        </form>
                    </SettingsContainer>
                </DrawerContainer>
            </AkCustomDrawer>
        );
    }


    _onBackButton: (*) => void;

    /**
     * Closes the drawer when back button is clicked.
     *
     * @returns {void}
     */
    _onBackButton() {
        this.props.dispatch(closeDrawer());
    }

    _onEmailBlur: (*) => void;

    /**
     * Updates Avatar URL in (redux) state when email is updated.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onEmailBlur(event: SyntheticInputEvent<HTMLInputElement>) {
        this.props.dispatch(setEmail(event.currentTarget.value));
    }

    _onEmailFormSubmit: (*) => void;

    /**
     * Prevents submission of the form and updates email.
     *
     * @param {SyntheticEvent<HTMLFormElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onEmailFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        // $FlowFixMe
        this.props.dispatch(setEmail(event.currentTarget.elements[0].value));
    }

    _onNameBlur: (*) => void;

    /**
     * Updates Avatar URL in (redux) state when name is updated.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onNameBlur(event: SyntheticInputEvent<HTMLInputElement>) {
        this.props.dispatch(setName(event.currentTarget.value));
    }

    _onNameFormSubmit: (*) => void;

    /**
     * Prevents submission of the form and updates name.
     *
     * @param {SyntheticEvent<HTMLFormElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onNameFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        // $FlowFixMe
        this.props.dispatch(setName(event.currentTarget.elements[0].value));
    }

    _onServerURLBlur: (*) => void;

    /**
     * Updates Server URL in (redux) state when it is updated.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onServerURLBlur(event: SyntheticInputEvent<HTMLInputElement>) {
        this.props.dispatch(setServerURL(event.currentTarget.value));
    }

    _onServerURLFormSubmit: (*) => void;

    /**
     * Prevents submission of the form and updates Server URL.
     *
     * @param {SyntheticEvent<HTMLFormElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onServerURLFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        // $FlowFixMe
        const serverURL = event.currentTarget.elements[0].value;

        this.props.dispatch(setServerURL(serverURL));
    }
}

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
 *     _avatarURL: string,
 *     _email: string,
 *     _name: string,
 *     _serverURL: string
 * }}
 */
function _mapStateToProps(state: Object) {
    return {
        _avatarURL: state.settings.avatarURL,
        _email: state.settings.email,
        _name: state.settings.name,
        _serverURL: state.settings.serverURL
    };
}

export default connect(_mapStateToProps)(SettingsDrawer);
