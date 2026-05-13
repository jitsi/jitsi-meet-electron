
import { generateRoomWithoutSeparator } from '@jitsi/js-utils/random';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';

import config from '../../config';
import { Navbar } from '../../navbar';
import { RecentList, addRecentListEntry } from '../../recent-list';
import Button from '../../shared/components/Button';
import FieldText from '../../shared/components/FieldText';
import Page from '../../shared/components/Page';
import { createConferenceObjectFromURL } from '../../utils';
import { Body, Form, Header, Label, Wrapper } from '../styled';


const MainFieldText = styled(FieldText)`
    input {
        height: 3em;
    }
`;

const MainGoButton = styled(Button)`
    height: 3em;
`;


/**
 * Welcome Component.
 */
class Welcome extends Component {
    /**
     * Initializes a new {@code Welcome} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        // Initialize url value in state if passed using location state object.
        let url = '';

        // Check and parse url if exists in location state.
        if (props.location?.state) {
            const { room, serverURL } = props.location.state;

            if (room && serverURL) {
                url = `${serverURL}/${room}`;
            }
        }

        this.state = {
            animateTimeoutId: undefined,
            generatedRoomname: '',
            roomPlaceholder: '',
            updateTimeoutId: undefined,
            url
        };

        // Bind event handlers.
        this._animateRoomnameChanging = this._animateRoomnameChanging.bind(this);
        this._onURLChange = this._onURLChange.bind(this);
        this._onFormSubmit = this._onFormSubmit.bind(this);
        this._onJoin = this._onJoin.bind(this);
        this._updateRoomname = this._updateRoomname.bind(this);
    }

    /**
     * Start generating random room names.
     *
     * @returns {void}
     */
    componentDidMount() {
        this._updateRoomname();
    }

    /**
     * Stop all timers when unmounting.
     *
     * @returns {voidd}
     */
    componentWillUnmount() {
        this._clearTimeouts();
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <Page navigation = { <Navbar /> }>
                <Wrapper>
                    { this._renderHeader() }
                    { this._renderBody() }
                </Wrapper>
            </Page>
        );
    }


    /**
     * Animates the changing of the room name.
     *
     * @param {string} word - The part of room name that should be added to
     * placeholder.
     * @private
     * @returns {void}
     */
    _animateRoomnameChanging(word) {
        let animateTimeoutId;
        const roomPlaceholder = this.state.roomPlaceholder + word.slice(0, 1);

        if (word.length > 1) {
            animateTimeoutId
                = setTimeout(
                    () => {
                        this._animateRoomnameChanging(
                            word.substring(1, word.length));
                    },
                    70);
        }
        this.setState({
            animateTimeoutId,
            roomPlaceholder
        });
    }

    /**
     * Method that clears timeouts for animations and updates of room name.
     *
     * @private
     * @returns {void}
     */
    _clearTimeouts() {
        clearTimeout(this.state.animateTimeoutId);
        clearTimeout(this.state.updateTimeoutId);
    }


    /**
     * Prevents submission of the form and delegates the join logic.
     *
     * @param {Event} event - Event by which this function is called.
     * @returns {void}
     */
    _onFormSubmit(event) {
        event.preventDefault();
        this._onJoin();
    }


    /**
     * Redirect and join conference.
     *
     * @returns {void}
     */
    _onJoin() {
        const inputURL = this.state.url || this.state.generatedRoomname;
        const conference = createConferenceObjectFromURL(
            inputURL,
            this.props._serverURL || config.defaultServerURL
        );

        // Don't navigate if conference couldn't be created
        if (!conference) {
            return;
        }

        this.props.dispatch(addRecentListEntry(conference));
        window.jitsiNodeAPI.ipc.send('open-meeting-window', conference);
    }


    /**
     * Keeps URL input value and URL in state in sync.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onURLChange(event) {
        this.setState({
            url: event.currentTarget.value
        });
    }

    /**
     * Renders the body for the welcome page.
     *
     * @returns {ReactElement}
     */
    _renderBody() {
        return (
            <Body>
                <RecentList />
            </Body>
        );
    }

    /**
     * Renders the header for the welcome page.
     *
     * @returns {ReactElement}
     */
    _renderHeader() {
        const locationState = this.props.location?.state;
        const locationError = locationState && locationState.error;
        const { t } = this.props;

        return (
            <Header>
                <Form onSubmit = { this._onFormSubmit }>
                    <Label>{ t('enterConferenceNameOrUrl') } </Label>
                    <MainFieldText
                        autoFocus = { true }
                        isInvalid = { locationError }
                        isLabelHidden = { true }
                        onChange = { this._onURLChange }
                        placeholder = { this.state.roomPlaceholder }
                        shouldFitContainer = { true }
                        type = 'text'
                        value = { this.state.url } />
                    <MainGoButton
                        appearance = 'primary'
                        onClick = { this._onJoin }
                        type = 'button'>
                        { t('go') }
                    </MainGoButton>
                </Form>
            </Header>
        );
    }


    /**
     * Triggers the generation of a new room name and initiates an animation of
     * its changing.
     *
     * @protected
     * @returns {void}
     */
    _updateRoomname() {
        const generatedRoomname = generateRoomWithoutSeparator();
        const roomPlaceholder = '';
        const updateTimeoutId = setTimeout(this._updateRoomname, 10000);

        this._clearTimeouts();
        this.setState(
            {
                generatedRoomname,
                roomPlaceholder,
                updateTimeoutId
            },
            () => this._animateRoomnameChanging(generatedRoomname));
    }
}

Welcome.propTypes = {
    _serverURL: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object,
    t: PropTypes.func.isRequired
};

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {Object}
 */
function _mapStateToProps(state) {
    return {
        _serverURL: state.settings.serverURL
    };
}

export default compose(connect(_mapStateToProps), withTranslation())(Welcome);
