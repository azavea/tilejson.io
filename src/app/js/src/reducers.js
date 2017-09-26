import { combineReducers } from 'redux';

import {
    CHANGE_LAYER_NAME,
    CHANGE_LAYER_URL,
    CHANGE_TILE_JSON,
    CLEAR_SCREEN,
    CHANGE_SHARE_LINK,
} from './actions';

import {
    getDefaultTileJSON,
} from './constants';

const initialState = {
    name: '',
    url: '',
    tileJSON: getDefaultTileJSON(),
    tileJSONString: JSON.stringify(getDefaultTileJSON(), null, '\t'),
    shareLink: '',
};

function mainReducer(state = initialState, action) {
    switch (action.type) {
        case CHANGE_LAYER_NAME:
            return Object.assign({}, state, {
                name: action.payload.name,
            });
        case CHANGE_LAYER_URL:
            return Object.assign({}, state, {
                url: action.payload.url,
            });
        case CHANGE_TILE_JSON:
            return Object.assign({}, state, {
                tileJSON: action.payload.tileJSON,
                tileJSONString: JSON.stringify(action.payload.tileJSON, null, '\t'),
            });
        case CLEAR_SCREEN:
            return Object.assign({}, state, {
                tileJSON: getDefaultTileJSON(),
                tileJSONString: JSON.stringify(getDefaultTileJSON(), null, '\t'),
                shareLink: '',
                url: '',
                name: '',
            });
        case CHANGE_SHARE_LINK:
            return Object.assign({}, state, {
                shareLink: action.payload.shareLink,
            });
        default:
            return state;
    }
}

export default combineReducers({
    main: mainReducer,
});
