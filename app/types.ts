import type { ComponentType } from 'react';

/**
 * Details of a conference (a room on a given server). {@code startTime} and
 * {@code endTime} are added once the conference is stored in the recent list.
 */
export interface IConference {
    endTime?: number;
    room: string;
    serverURL: string;
    startTime?: number;
}

/**
 * Redux state of the navbar feature.
 */
export interface INavbarState {
    openDrawer?: ComponentType<any>;
}

/**
 * Redux state of the recent-list feature.
 */
export interface IRecentListState {
    recentList: IConference[];
}

/**
 * Redux state of the settings feature.
 */
export interface ISettingsState {
    alwaysOnTopWindowEnabled: boolean;
    disableAGC: boolean;
    serverTimeout?: number;
    serverURL?: string;
}

/**
 * The (combined) redux state of the application.
 */
export interface IState {
    navbar: INavbarState;
    recentList: IRecentListState;
    settings: ISettingsState;
}
