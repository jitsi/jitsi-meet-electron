// @flow

/**
 * AtlasKit components will deflect from appearance if css-reset is not present.
 */
import '@atlaskit/css-reset';

import { SpotlightManager } from '@atlaskit/onboarding';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { App } from './features/app';
import { persistor, store } from './features/redux';

/**
 * Component encapsulating App component with redux store using provider.
 */
class Root extends Component<*> {
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
                        <App />
                    </SpotlightManager>
                </PersistGate>
            </Provider>
        );
    }
}

/**
 * Render the main / root application.
 *
 * $FlowFixMe.
 */
render(<Root />, document.getElementById('app'));
