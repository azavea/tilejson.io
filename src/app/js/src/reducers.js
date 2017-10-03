import { combineReducers } from 'redux';

import {
    CHANGE_LAYER_NAME,
    CHANGE_LAYER_URL,
    CHANGE_TILE_JSON,
    CLEAR_SCREEN,
    CHANGE_SHARE_LINK,
    TOGGLE_TILE_JSON_EDIT_MODE,
    CHANGE_TILE_JSON_PARSE_ERROR,
} from './actions';

import {
    getDefaultTileJSON,
} from './constants';

const initialState = {
    name: '',
    url: '',
    tileJSON: getDefaultTileJSON(),
    tileJSONString: JSON.stringify(getDefaultTileJSON(), null, '\t'),
    tileJSONEditMode: false,
    tileJSONParseError: '',
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
                layers: action.payload.layers,
                tileJSON: action.payload.tileJSON,
                tileJSONString: JSON.stringify(action.payload.tileJSON, null, '\t'),
                tileJSONEditMode: false,
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
        case TOGGLE_TILE_JSON_EDIT_MODE:
            return Object.assign({}, state, {
                tileJSONEditMode: action.payload.tileJSONEditMode,
            });
        case CHANGE_TILE_JSON_PARSE_ERROR:
            return Object.assign({}, state, {
                tileJSONParseError: action.payload.tileJSONParseError,
            });
        default:
            return state;
    }
}

export default combineReducers({
    main: mainReducer,
});
