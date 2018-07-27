// @flow

import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { push } from 'react-router-redux';

import {
    ConferenceCard,
    ConferenceTitle,
    RecentListContainer,
    TruncatedText
} from '../styled';
import type { RecentListItem } from '../types';

type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;

    /**
     * Array of recent conferences.
     */
    _recentList: Array<RecentListItem>;
};

/**
 * Recent List Component.
 */
class RecentList extends Component<Props, *> {
    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <RecentListContainer>
                {
                    this.props._recentList.map(
                        conference => this._renderRecentListEntry(conference)
                    )
                }
            </RecentListContainer>
        );
    }

    /**
     * Creates a handler for navigatint to a conference.
     *
     * @param {RecentListItem} conference - Conference Details.
     * @returns {void}
     */
    _onNavigateToConference(conference: RecentListItem) {
        return () => this.props.dispatch(push('/conference', conference));
    }

    /**
     * Renders the conference card.
     *
     * @param {RecentListItem} conference - Conference Details.
     * @returns {ReactElement}
     */
    _renderRecentListEntry(conference: RecentListItem) {
        return (
            <ConferenceCard
                key = { conference.startTime }
                onClick = { this._onNavigateToConference(conference) }>
                <ConferenceTitle>
                    { conference.room }
                </ConferenceTitle>
                <TruncatedText>
                    { this._renderServerURL(conference.serverURL) }
                </TruncatedText>
                <TruncatedText>
                    { this._renderStartTime(conference) }
                </TruncatedText>
                <TruncatedText>
                    { this._renderDuration(conference) }
                </TruncatedText>
            </ConferenceCard>
        );
    }

    /**
     * Returns formatted Server URL.
     *
     * @param {string} serverURL - Server URL.
     * @returns {string} - Formatted server URL.
     */
    _renderServerURL(serverURL: string) {
        // Strip protocol to make it cleaner.
        return `${serverURL.replace('https://', '')}`;

    }

    /**
     * Returns the duration of the conference in string format.
     *
     * @param {RecentListItem} conference - Conference Details.
     * @returns {string} - Date/Time and Duration.
     */
    _renderDuration(conference: RecentListItem) {
        const { startTime, endTime } = conference;
        const start = moment(startTime);
        const end = moment(endTime || Date.now());

        return moment.duration(end.diff(start)).humanize();
    }

    /**
     * Returns the Date/Time of the conference in string format.
     *
     * @param {RecentListItem} conference - Conference Details.
     * @returns {string} - Date/Time and Duration.
     */
    _renderStartTime(conference: RecentListItem) {
        const { startTime } = conference;

        return moment(startTime).calendar();
    }
}

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
 *     _recentList: Array<RecentListItem>
 * }}
 */
function _mapStateToProps(state: Object) {
    return {
        _recentList: state.recentList.recentList
    };
}

export default connect(_mapStateToProps)(RecentList);
