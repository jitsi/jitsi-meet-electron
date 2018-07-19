// @flow

import Flag, { FlagGroup } from '@atlaskit/flag';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { hideNotification, showNotification } from '../actions';
import type { Notification } from '../types';

type Props = {

    /**
     * Redux Dispatch.
     */
    dispatch: Dispatch<*>;

    /**
     * Array of all the notifications.
     */
    _notifications: Array<Notification>
};

/**
 * Notifications Container component.
 */
class NotificationsContainer extends Component<Props, *> {
    /**
     * Initializes a new {@code NotificationsContainer} instance.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this._onDismissed = this._onDismissed.bind(this);
    }

    /**
     * For Testing.
     *
     * @returns {void}
     */
    componentDidMount() {
        const notification = {
            title: 'Title',
            description: 'Description'
        };

        this.props.dispatch(showNotification(notification));
        this.props.dispatch(showNotification(notification));
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <FlagGroup onDismissed = { this._onDismissed }>
                {
                    this.props._notifications.map(
                        (notification: Notification) =>
                            this._renderNotification(notification)
                    )
                }
            </FlagGroup>
        );
    }

    _onDismissed: (*) => void;

    /**
     * Remove notification from redux state.
     *
     * @param {string} uuid - The unique identifier for the notification.
     * @returns {void}
     */
    _onDismissed(uuid: string) {
        this.props.dispatch(hideNotification(uuid));
    }

    /**
     * Render Notification Component from object.
     *
     * @param {Notification} notification - Notification Object.
     * @returns {void}
     */
    _renderNotification(notification: Notification) {
        return (
            <Flag
                description = { notification.description }
                id = { notification.uuid }
                isDismissAllowed = { true }
                key = { notification.uuid }
                title = { notification.title } />
        );
    }
}

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
 *     _notifications: Array<Object>
 * }}
 */
function _mapStateToProps(state: Object) {
    return {
        _notifications: state.notifications.notifications
    };
}


export default connect(_mapStateToProps)(NotificationsContainer);
