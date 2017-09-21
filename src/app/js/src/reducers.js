import { combineReducers } from 'redux';

import { INC } from './actions';

const initialState = {
    n: 0,
};

function mainReducer(state = initialState, action) {
    switch (action.type) {
        case INC:
            return Object.assign({}, state, {
                n: state.n + 1,
            });
        default:
            return state;
    }
}

export default combineReducers({
    main: mainReducer,
});
