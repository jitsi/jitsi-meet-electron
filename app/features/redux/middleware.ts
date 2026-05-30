
import { applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';

// redux-logger's Middleware type is parameterised for an older redux action
// type and is not assignable to redux v4's applyMiddleware signature, so it is
// cast here.
export default applyMiddleware(
    createLogger() as any
);
