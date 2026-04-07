/**
 * AtlasKit components will deflect from appearance if css-reset is not present.
 */
import '@atlaskit/css-reset';

import { SpotlightManager } from '@atlaskit/onboarding';
import Spinner from '@atlaskit/spinner';
import React, { Component, Suspense } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { MeetingApp } from './features/app';
import { persistor, store } from './features/redux';

import './i18n';

/**
 * Component encapsulating MeetingApp component with redux store using provider.
 */
class Root extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <Provider store = { store }>
                <PersistGate
                    loading = { null }
                    persistor = { persistor }>
                    <SpotlightManager>
                        <Suspense fallback = { <Spinner /> } >
                            <MeetingApp />
                        </Suspense>
                    </SpotlightManager>
                </PersistGate>
            </Provider>
        );
    }
}

/**
 * Render the meeting window application.
 */
render(<Root />, document.getElementById('app'));
