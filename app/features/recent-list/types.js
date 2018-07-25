// @flow

export type RecentListItem = {

    /**
     * Timestamp of ending time of conference.
     */
    endTime: number;

    /**
     * Conference Room Name.
     */
    room: string;

    /**
     * Conference Server URL.
     */
    serverURL: string;

    /**
     * Timestamp of starting time of conference.
     */
    startTime: number;
};
