// @flow

import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

/**
 * AtlasKit components will deflect from appearance if css-reset is not present.
 */
import '@atlaskit/css-reset';

import { App } from './features/app';
import { store } from './features/redux';

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
                <App />
            </Provider>
        );
    }
}

/**
 * Render the main / root application.
 * $FlowFixMe
 */
render(<Root />, document.getElementById('app'));
