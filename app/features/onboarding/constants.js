// @flow
import { OnboardingModal, OnboardingSpotlight } from './components';
import { openDrawer, closeDrawer } from '../navbar';
import { SettingsDrawer } from '../settings';

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
    'onboarding-modal': { type: OnboardingModal },
    'conference-url': {
        type: OnboardingSpotlight,
        dialogPlacement: 'bottom center',
        target: 'conference-url',
        text: 'onboarding.conferenceUrl'
    },
    'settings-drawer-button': {
        type: OnboardingSpotlight,
        dialogPlacement: 'top right',
        target: 'settings-drawer-button',
        text: 'onboarding.settingsDrawerButton',
        onNext: (props: OnboardingSpotlight.props) => props.dispatch(openDrawer(SettingsDrawer))
    },
    'name-setting': {
        type: OnboardingSpotlight,
        dialogPlacement: 'top right',
        target: 'name-setting',
        text: 'onboarding.nameSetting'
    },
    'email-setting': {
        type: OnboardingSpotlight,
        dialogPlacement: 'top right',
        target: 'email-setting',
        text: 'onboarding.emailSetting'
    },
    'start-muted-toggles': {
        type: OnboardingSpotlight,
        dialogPlacement: 'top right',
        target: 'start-muted-toggles',
        text: 'onboarding.startMutedToggles'
    },
    'server-setting': {
        type: OnboardingSpotlight,
        dialogPlacement: 'top right',
        target: 'server-setting',
        text: 'onboarding.serverSetting'
    },
    'server-timeout': {
        type: OnboardingSpotlight,
        dialogPlacement: 'top right',
        target: 'server-timeout',
        text: 'onboarding.serverTimeout'
    },
    'always-on-top-window': {
        type: OnboardingSpotlight,
        dialogPlacement: 'top right',
        target: 'always-on-top-window',
        text: 'onboarding.alwaysOnTop',
        onNext: (props: OnboardingSpotlight.props) => setTimeout(() => {
            props.dispatch(closeDrawer());
        }, 300)
    }
};
