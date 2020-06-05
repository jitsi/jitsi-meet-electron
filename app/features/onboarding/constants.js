// @flow

import {
    OnboardingModal,
    ConferenceURLSpotlight,
    SettingsDrawerSpotlight,
    NameSettingSpotlight,
    EmailSettingSpotlight,
    StartMutedTogglesSpotlight,
    ServerSettingSpotlight,
    ServerTimeoutSpotlight,
    AlwaysOnTopWindowSpotlight
} from './components';

export const advenaceSettingsSteps = [
    'server-setting',
    'server-timeout',
    'always-on-top-window'
];

export const onboardingSteps = {
    'welcome-page': [
        'onboarding-modal',
        'conference-url',
        'settings-drawer-button'
    ],
    'settings-drawer': [
        'name-setting',
        'email-setting',
        'start-muted-toggles',
        ...advenaceSettingsSteps
    ]
};

export const onboardingComponents = {
    'onboarding-modal': OnboardingModal,
    'conference-url': ConferenceURLSpotlight,
    'settings-drawer-button': SettingsDrawerSpotlight,
    'name-setting': NameSettingSpotlight,
    'email-setting': EmailSettingSpotlight,
    'start-muted-toggles': StartMutedTogglesSpotlight,
    'server-setting': ServerSettingSpotlight,
    'server-timeout': ServerTimeoutSpotlight,
    'always-on-top-window': AlwaysOnTopWindowSpotlight
};
