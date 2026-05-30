import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch, compose } from 'redux';

import type { IConference, IState } from '../../../types';
import Button from '../../shared/components/Button';
import { CrossIcon } from '../../shared/icons';
import { addRecentListEntry, removeRecentListEntry } from '../actions';
import {
    ConferenceCard,
    ConferenceTitle,
    Label,
    RecentListContainer,
    RecentListWrapper,
    TruncatedText
} from '../styled';

interface IProps extends WithTranslation {
    _recentList?: IConference[];
    dispatch: Dispatch;
}

/**
 * Recent List Component.
 */
class RecentList extends Component<IProps> {
    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        const { t } = this.props;

        if (this.props._recentList?.length === 0) {
            return null;
        }

        return (
            <RecentListWrapper>
                <Label>{t('recentListLabel')}</Label>
                <RecentListContainer>
                    {
                        this.props._recentList?.map(
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
    _onNavigateToConference(conference: IConference) {
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
    _onRemoveConference(conference: IConference) {
        return (e: React.MouseEvent) => {
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
    _renderRecentListEntry(conference: IConference) {
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
    _renderServerURL(serverURL?: string) {
        if (!serverURL) {
            return '';
        }

        // Strip protocol to make it cleaner.
        return `${serverURL.replace('https://', '')}`;
    }

    /**
     * Returns the Date/Time of the conference in string format.
     *
     * @param {Object} conference - Conference Details.
     * @returns {string} - Date/Time and Duration.
     */
    _renderStartTime(conference: IConference) {
        const { startTime } = conference;

        if (typeof startTime !== 'number') {
            return '';
        }

        return new Intl.DateTimeFormat(navigator.language, {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(startTime);
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
function _mapStateToProps(state: IState) {
    return {
        _recentList: state.recentList.recentList
    };
}

// redux's compose() returns a loosely-typed function; cast so the connected +
// translated component is usable as JSX / a ComponentType by consumers.
export default compose(connect(_mapStateToProps), withTranslation())(RecentList) as React.ComponentType<any>;
