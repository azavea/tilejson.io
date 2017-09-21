import React from 'react';
import { render } from 'react-dom';

import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import '../../sass/main.scss';
import App from './SampleApp';

import createStoreWithMiddleware from './store';
import reducers from './reducers';

const store = createStoreWithMiddleware(reducers);
render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App} />
        </Router>
    </Provider>,
    document.getElementById('root'),
);
