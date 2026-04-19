
import Button from '@atlaskit/button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { addRecentListEntry, removeRecentListEntry } from '../actions';
import {
    ConferenceCard,
    ConferenceTitle,
    Label,
    RecentListContainer,
    RecentListWrapper,
    TruncatedText
} from '../styled';

const DAY_SECONDS = 24 * 60 * 60;
const HOUR_SECONDS = 60 * 60;
const MINUTE_SECONDS = 60;


/**
 * Recent List Component.
 */
class RecentList extends Component {
    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        const { t } = this.props;

        if (this.props._recentList.length === 0) {
            return null;
        }

        return (
            <RecentListWrapper>
                <Label>{t('recentListLabel')}</Label>
                <RecentListContainer>
                    {
                        this.props._recentList.map(
                            conference => this._renderRecentListEntry(conference)
                        )
                    }
                </RecentListContainer>
            </RecentListWrapper>
        );
    }

    /**
     * Creates a handler for navigating to a conference.
     *
     * @param {Object} conference - Conference Details.
     * @returns {void}
     */
    _onNavigateToConference(conference) {
        return () => {
            this.props.dispatch(addRecentListEntry(conference));
            window.jitsiNodeAPI.ipc.send('open-meeting-window', conference);
        };
    }

    /**
     * Creates a handler for removing a conference from the recents list.
     *
     * @param {Object} conference - Conference Details.
     * @returns {void}
     */
    _onRemoveConference(conference) {
        return e => {
            this.props.dispatch(removeRecentListEntry(conference));
            e.stopPropagation();
        };
    }


    /**
     * Renders the conference card.
     *
     * @param {Object} conference - Conference Details.
     * @returns {ReactElement}
     */
    _renderRecentListEntry(conference) {
        return (
            <ConferenceCard
                key = { conference.startTime }
                onClick = { this._onNavigateToConference(conference) }>
                <ConferenceTitle>
                    {conference.room}
                </ConferenceTitle>
                <TruncatedText>
                    {this._renderServerURL(conference.serverURL)}
                </TruncatedText>
                <TruncatedText>
                    {this._renderStartTime(conference)}
                </TruncatedText>
                <TruncatedText>
                    {this._renderDuration(conference)}
                </TruncatedText>
                <Button
                    appearance = 'subtle'
                    iconBefore = { <CrossIcon primaryColor = 'white' /> }
                    onClick = { this._onRemoveConference(conference) }
                    spacing = 'none' />
            </ConferenceCard>
        );
    }

    /**
     * Returns formatted Server URL.
     *
     * @param {string} serverURL - Server URL.
     * @returns {string} - Formatted server URL.
     */
    _renderServerURL(serverURL) {
        if (!serverURL) {
            return '';
        }

        // Strip protocol to make it cleaner.
        return `${serverURL.replace('https://', '')}`;
    }

    /**
     * Returns the duration of the conference in string format.
     *
     * @param {Object} conference - Conference Details.
     * @returns {string} - Date/Time and Duration.
     */
    _renderDuration(conference) {
        const { startTime, endTime } = conference;
        const startTimestamp = Date.parse(startTime);
        const endTimestamp = Date.parse(endTime || Date.now());

        if (Number.isNaN(startTimestamp) || Number.isNaN(endTimestamp)) {
            return '';
        }

        const totalSeconds = Math.max(0, Math.round((endTimestamp - startTimestamp) / 1000));
        const days = Math.floor(totalSeconds / DAY_SECONDS);
        const hours = Math.floor((totalSeconds % DAY_SECONDS) / HOUR_SECONDS);
        const minutes = Math.floor((totalSeconds % HOUR_SECONDS) / MINUTE_SECONDS);
        const seconds = totalSeconds % MINUTE_SECONDS;

        if (days > 0) {
            return `${days}d ${hours}h`;
        }

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }

        if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        }

        return `${seconds}s`;
    }

    /**
     * Returns the Date/Time of the conference in string format.
     *
     * @param {Object} conference - Conference Details.
     * @returns {string} - Date/Time and Duration.
     */
    _renderStartTime(conference) {
        const { startTime } = conference;
        const timestamp = Date.parse(startTime);

        if (Number.isNaN(timestamp)) {
            return '';
        }

        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(timestamp);
    }
}

RecentList.propTypes = {
    _recentList: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
};

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
 *     _recentList: Array<RecentListItem>
 * }}
 */
function _mapStateToProps(state) {
    return {
        _recentList: state.recentList.recentList
    };
}

export default compose(connect(_mapStateToProps), withTranslation())(RecentList);
