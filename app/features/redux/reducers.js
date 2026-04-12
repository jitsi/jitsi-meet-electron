
import { combineReducers } from 'redux';

import { reducer as navbarReducer } from '../navbar';
import { reducer as onboardingReducer } from '../onboarding';
import { reducer as recentListReducer } from '../recent-list';
import { reducer as settingsReducer } from '../settings';

export default combineReducers({
    navbar: navbarReducer,
    onboarding: onboardingReducer,
    recentList: recentListReducer,
    settings: settingsReducer
});
