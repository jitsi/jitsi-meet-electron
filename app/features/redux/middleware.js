
import { applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';

export default applyMiddleware(
    createLogger()
);
