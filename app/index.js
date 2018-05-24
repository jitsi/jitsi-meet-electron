// @flow

import React from 'react';
import { render } from 'react-dom';

import { App } from './features/app';

/**
 * Render the main / root application.
 * $FlowFixMe
 */
render(<App />, document.getElementById('app'));
