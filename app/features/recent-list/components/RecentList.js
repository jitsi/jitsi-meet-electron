
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';

import { conferenceJoined } from '../../conference';
import { conferenceRemoved } from '../actions';


// ---------------------------------------------------------------------------
// Trash icon SVG path — matches the web version's bin icon (Font Awesome trash-alt)
// ---------------------------------------------------------------------------

const TRASH_ICON_PATH
    = 'M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16'
    + ' 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16'
    + ' 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432'
    + ' 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0'
    + ' 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16'
    + ' 16 0 0 0 16-16V48a16 16 0 0 0-16-16z';

// ---------------------------------------------------------------------------
// Styled components — flat row layout matching the web client
// ---------------------------------------------------------------------------

const Panel = styled.div`
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    overflow: hidden;
`;

const ListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 320px;
    overflow-y: auto;

    /* Thin custom scrollbar */
    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.35);
    }
`;

const SectionHeader = styled.div`
    margin-bottom: 10px;
`;


const MeetingRow = styled.div`
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    cursor: pointer;
    transition: background 0.15s ease;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: rgba(255, 255, 255, 0.08);
    }

    &:hover .delete-btn {
        opacity: 1;
    }
`;

const DateColumn = styled.div`
    flex-shrink: 0;
    width: 100px;
    margin-right: 16px;
`;

const DateText = styled.div`
    color: rgba(255, 255, 255, 0.9);
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
`;

const TimeText = styled.div`
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
    margin-top: 2px;
    white-space: nowrap;
`;

const InfoColumn = styled.div`
    flex: 1;
    min-width: 0;
`;

const RoomName = styled.div`
    color: white;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Duration = styled.div`
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
    margin-top: 2px;
`;

const DeleteButton = styled.button`
    background: none;
    border: none;
    color: #6ea8fe;
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.15s ease, color 0.15s ease;
    margin-left: 8px;

    &:hover {
        color: rgba(255, 255, 255, 0.85);
    }
`;

// ---------------------------------------------------------------------------

/**
 * Recent List — flat row layout matching the Jitsi web client.
 */
class RecentList extends Component {
    /**
     * Initializes a new {@code RecentList} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this._onJoinConference = this._onJoinConference.bind(this);
        this._onRemoveConference = this._onRemoveConference.bind(this);
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        const { t } = this.props;

        if (!this.props._recentList || this.props._recentList.length === 0) {
            return null;
        }

        return (
            <div>
                <SectionHeader>
                    { t('recentListLabel') }
                </SectionHeader>
                <Panel>
                    <ListWrapper>
                        {
                            this.props._recentList.map(
                                conference => this._renderMeetingRow(conference)
                            )
                        }
                    </ListWrapper>
                </Panel>
            </div>
        );
    }

    /**
     * Returns a human-readable room name: URL-decoded, last path segment.
     *
     * @param {string} room - Raw room value from the store.
     * @returns {string}
     */
    _formatRoomName(room) {
        if (!room) {
            return '';
        }
        try {
            return decodeURIComponent(room.split('/').pop() || room);
        } catch (e) {
            return room;
        }
    }

    /**
     * Handles clicking a meeting row to join.
     *
     * @param {Object} conference - Conference to join.
     * @returns {void}
     */
    _onJoinConference(conference) {
        this.props.dispatch(conferenceJoined(conference));
        window.jitsiNodeAPI.ipc.send('open-meeting-window', conference);
    }

    /**
     * Handles clicking the delete button to remove a conference.
     *
     * @param {Event} e - Click event.
     * @param {Object} conference - Conference to remove.
     * @returns {void}
     */
    _onRemoveConference(e, conference) {
        e.stopPropagation();
        this.props.dispatch(conferenceRemoved(conference));
    }

    /**
     * Renders a single meeting row matching the web client layout.
     *
     * @param {Object} conference - Conference details.
     * @returns {ReactElement}
     */
    _renderMeetingRow(conference) {
        const { t } = this.props;

        return (
            <MeetingRow
                key = { conference.startTime }
                // eslint-disable-next-line react/jsx-no-bind
                onClick = { this._onJoinConference.bind(this, conference) }>
                <DateColumn>
                    <DateText>
                        { moment(conference.startTime).format('MMM D, YYYY') }
                    </DateText>
                    <TimeText>
                        { moment(conference.startTime).format('h:mm A') }
                    </TimeText>
                </DateColumn>
                <InfoColumn>
                    <RoomName title = { this._formatRoomName(conference.room) }>
                        { this._formatRoomName(conference.room) }
                    </RoomName>
                    <Duration>
                        { moment.duration(
                            moment(conference.endTime || Date.now())
                                .diff(moment(conference.startTime))
                        ).humanize() }
                    </Duration>
                </InfoColumn>
                <DeleteButton
                    className = 'delete-btn'
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick = { this._onRemoveConference.bind(this, conference) }
                    title = { t('remove') }>
                    <svg
                        fill = 'currentColor'
                        height = '22'
                        viewBox = '0 0 448 512'
                        width = '22'
                        xmlns = 'http://www.w3.org/2000/svg'>
                        <path d = { TRASH_ICON_PATH } />
                    </svg>
                </DeleteButton>
            </MeetingRow>
        );
    }
<<<<<<< HEAD

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
        const start = moment(startTime);
        const end = moment(endTime || Date.now());

        return moment.duration(end.diff(start)).humanize();
    }

    /**
     * Returns the Date/Time of the conference in string format.
     *
     * @param {Object} conference - Conference Details.
     * @returns {string} - Date/Time and Duration.
     */
    _renderStartTime(conference) {
        const { startTime } = conference;

        return moment(startTime).calendar();
    }
=======
>>>>>>> 9c09a3e (feat(two-window): redesigned Recent Meetings UI and two-window layout)
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
 * @returns {{ _recentList: Array }}
 */
function _mapStateToProps(state) {
    return {
        _recentList: state.recentList.recentList
    };
}

export default compose(connect(_mapStateToProps), withTranslation())(RecentList);
