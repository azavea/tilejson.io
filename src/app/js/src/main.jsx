import React from 'react';
import { render } from 'react-dom';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import '../../sass/main.scss';
import App from './App';

import createStoreWithMiddleware from './store';
import reducers from './reducers';

const store = createStoreWithMiddleware(reducers);
render(
    <Provider store={store}>
        <Router>
            <Switch>
                <Route path="/g/:id/:mode" component={App} />
                <Route exact path="/" component={App} />
                <Route component={App} />
            </Switch>
        </Router>
    </Provider>,
    document.getElementById('root'),
);
