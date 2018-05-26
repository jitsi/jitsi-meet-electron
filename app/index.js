// @flow

import React from 'react';
import { render } from 'react-dom';

import { App } from './features/app';

/**
 * AtlasKit components will deflect from appearance if css-reset is not present.
 */
import '@atlaskit/css-reset';

/**
 * Render the main / root application.
 * $FlowFixMe
 */
render(<App />, document.getElementById('app'));
