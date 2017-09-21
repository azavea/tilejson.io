import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';

const middlewares = [thunk, routerMiddleware(browserHistory)];

if (process.env.NODE_ENV === 'development') {
    const logger = createLogger();
    middlewares.push(logger);
}

const createStoreWithMiddleware =
    applyMiddleware(...middlewares)(createStore);

export { createStoreWithMiddleware as default };
