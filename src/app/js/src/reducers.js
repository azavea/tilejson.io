import { combineReducers } from 'redux';

import {
    CHANGE_LAYER_NAME,
    CHANGE_LAYER_URL,
    CHANGE_TILE_JSON,
    CLEAR_SCREEN,
    CHANGE_SHARE_LINK,
    TOGGLE_TILE_JSON_EDIT_MODE,
    CHANGE_TILE_JSON_PARSE_ERROR,
    TOGGLE_SHARE_SNACKBAR_OPEN,
    TOGGLE_ERROR_SNACKBAR_OPEN,
    TOGGLE_COLLAPSE,
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
    shareSnackbarOpen: false,
    errorSnackbarOpen: false,
    isCollapsed: false,
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
                tileJSONEditMode: false,
            });
        case CLEAR_SCREEN:
            return Object.assign({}, state, {
                tileJSON: getDefaultTileJSON(),
                tileJSONString: JSON.stringify(getDefaultTileJSON(), null, '\t'),
                shareLink: '',
                url: '',
                name: '',
                tileJSONParseError: '',
                tileJSONEditMode: false,
                shareSnackbarOpen: false,
                errorSnackbarOpen: false,
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
        case TOGGLE_SHARE_SNACKBAR_OPEN:
            return Object.assign({}, state, {
                shareSnackbarOpen: action.payload.shareSnackbarOpen,
            });
        case TOGGLE_ERROR_SNACKBAR_OPEN:
            return Object.assign({}, state, {
                errorSnackbarOpen: action.payload.errorSnackbarOpen,
            });
        case TOGGLE_COLLAPSE:
            return Object.assign({}, state, {
                isCollapsed: action.payload.isCollapsed,
            });
        default:
            return state;
    }
}

export default combineReducers({
    main: mainReducer,
});
