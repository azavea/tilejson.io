import React, { Component } from 'react';
import { func, number } from 'prop-types';
import { connect } from 'react-redux';

import { inc } from './actions';

class App extends Component {
    constructor(props) {
        super(props);
        this.inc = this.inc.bind(this);
    }

    inc() {
        this.props.dispatch(inc());
    }

    render() {
        return (
            <div className="flex-expand-row height-100vh">
                <p>Hello world</p>
                <p><button onClick={() => this.inc()}>Click Me</button></p>
                <p>{ this.props.n }</p>
            </div>
        );
    }
}

App.propTypes = {
    dispatch: func.isRequired,
    n: number.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(App);
