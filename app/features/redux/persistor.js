// @flow

import { persistStore } from 'redux-persist';

import store from './store';

export default persistStore(store);
