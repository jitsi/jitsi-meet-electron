
/**
 * AtlasKit components will deflect from appearance if css-reset is not present.
 */
import '@atlaskit/css-reset';

import { SpotlightManager } from '@atlaskit/onboarding';
import Spinner from '@atlaskit/spinner';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { App, MeetingApp } from './features/app';
import { persistor, store } from './features/redux';

import './i18n';

/**
 * Component encapsulating a given entry-point component with the redux store
 * and other required wrappers.
 */
class Root extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @returns {ReactElement}
     */
    render() {
        const { component: EntryPoint } = this.props;

        return (
            <Provider store = { store }>
                <PersistGate
                    loading = { null }
                    persistor = { persistor }>
                    <SpotlightManager>
                        <Suspense fallback = { <Spinner /> } >
                            <EntryPoint />
                        </Suspense>
                    </SpotlightManager>
                </PersistGate>
            </Provider>
        );
    }
}

Root.propTypes = {
    component: PropTypes.elementType.isRequired
};

/**
 * A map of available entry-point components.
 */
const entryPoints = {
    APP: App,
    MEETING: MeetingApp
};

/**
 * Renders the given entry-point into the DOM.
 *
 * @param {string} entryPoint - The key of the entry-point to render.
 * @returns {void}
 */
window.renderEntryPoint = function(entryPoint) {
    render(
        <Root component = { entryPoints[entryPoint] } />,
        document.getElementById('app')
    );
};
