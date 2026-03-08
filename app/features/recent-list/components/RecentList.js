import Button from "@atlaskit/button";
import CrossIcon from "@atlaskit/icon/glyph/cross";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { compose } from "redux";
import styled from "styled-components";

import { conferenceRemoved } from "../actions";
import {
  ConferenceCard,
  ConferenceTitle,
  Label,
  RecentListContainer,
  RecentListWrapper,
  TruncatedText,
} from "../styled";

const DeleteButton = styled(Button)`
  opacity: 0.7;
  transition: all 0.25s ease;
  padding: 0.5em !important;

  &:hover {
    opacity: 1 !important;
    transform: scale(1.15);
    background-color: rgba(255, 255, 255, 0.2) !important;
  }
`;

const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.8em;
`;

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
        <Label>{t("recentListLabel")}</Label>
        <RecentListContainer>
          {this.props._recentList.map((conference) =>
            this._renderRecentListEntry(conference),
          )}
        </RecentListContainer>
      </RecentListWrapper>
    );
  }

  /**
   * Creates a handler for navigatint to a conference.
   *
   * @param {Object} conference - Conference Details.
   * @returns {void}
   */
  _onNavigateToConference(conference) {
    return () => this.props.dispatch(push("/conference", conference));
  }

  /**
   * Creates a handler for removing a conference from the recents list.
   *
   * @param {Object} conference - Conference Details.
   * @returns {void}
   */
  _onRemoveConference(conference) {
    return (e) => {
      this.props.dispatch(conferenceRemoved(conference));
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
        key={conference.startTime}
        onClick={this._onNavigateToConference(conference)}
        title={`Join ${conference.room}`}
      >
        <CardContent>
          <ConferenceTitle>{conference.room}</ConferenceTitle>
          <TruncatedText>
            {this._renderServerURL(conference.serverURL)}
          </TruncatedText>
          <TruncatedText>{this._renderStartTime(conference)}</TruncatedText>
          <TruncatedText>{this._renderDuration(conference)}</TruncatedText>
        </CardContent>
        <CardFooter>
          <DeleteButton
            appearance="subtle"
            iconBefore={<CrossIcon primaryColor="white" />}
            onClick={this._onRemoveConference(conference)}
            spacing="none"
            title="Remove from recent"
          />
        </CardFooter>
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
    // Strip protocol to make it cleaner.
    return `${serverURL.replace("https://", "")}`;
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
}

RecentList.propTypes = {
  _recentList: PropTypes.array,
  dispatch: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
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
    _recentList: state.recentList.recentList,
  };
}

export default compose(
  connect(_mapStateToProps),
  withTranslation(),
)(RecentList);
