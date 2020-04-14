// @flow

import Avatar from '@atlaskit/avatar';
import FieldText from '@atlaskit/field-text';
import ArrowLeft from '@atlaskit/icon/glyph/arrow-left';
import { AkCustomDrawer } from '@atlaskit/navigation';
import { SpotlightTarget } from '@atlaskit/onboarding';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { closeDrawer, DrawerContainer, Logo } from '../../navbar';
import { Onboarding, startOnboarding } from '../../onboarding';
import { AvatarContainer, SettingsContainer, TogglesContainer } from '../styled';
import { setEmail, setName } from '../actions';

import AlwaysOnTopWindowToggle from './AlwaysOnTopWindowToggle';
import ServerURLField from './ServerURLField';
import StartMutedToggles from './StartMutedToggles';

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
    }

    /**
     * Start Onboarding once component is mounted.
     *
     * NOTE: It automatically checks if the onboarding is shown or not.
     *
     * @param {Props} prevProps - Props before component updated.
     * @returns {void}
     */
    componentDidUpdate(prevProps: Props) {
        if (!prevProps.isOpen && this.props.isOpen) {

            // TODO - Find a better way for this.
            // Delay for 300ms to let drawer open.
            setTimeout(() => {
                this.props.dispatch(startOnboarding('settings-drawer'));
            }, 300);
        }
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
                        <SpotlightTarget
                            name = 'name-setting'>
                            <form onSubmit = { this._onNameFormSubmit }>
                                <FieldText
                                    label = 'Name'
                                    onBlur = { this._onNameBlur }
                                    shouldFitContainer = { true }
                                    type = 'text'
                                    value = { this.props._name } />
                            </form>
                        </SpotlightTarget>
                        <SpotlightTarget
                            name = 'email-setting'>
                            <form onSubmit = { this._onEmailFormSubmit }>
                                <FieldText
                                    label = 'Email'
                                    onBlur = { this._onEmailBlur }
                                    shouldFitContainer = { true }
                                    type = 'text'
                                    value = { this.props._email } />
                            </form>
                        </SpotlightTarget>
                        <SpotlightTarget
                            name = 'server-setting'>
                            <ServerURLField />
                        </SpotlightTarget>
                        <TogglesContainer>
                            <SpotlightTarget
                                name = 'start-muted-toggles'>
                                <StartMutedToggles />
                            </SpotlightTarget>
                            <SpotlightTarget
                                name = 'always-on-top-window'>
                                <AlwaysOnTopWindowToggle />
                            </SpotlightTarget>
                        </TogglesContainer>
                        <Onboarding section = 'settings-drawer' />
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
}

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
 *     _avatarURL: string,
 *     _email: string,
 *     _name: string
 * }}
 */
function _mapStateToProps(state: Object) {
    return {
        _avatarURL: state.settings.avatarURL,
        _email: state.settings.email,
        _name: state.settings.name
    };
}

export default connect(_mapStateToProps)(SettingsDrawer);
