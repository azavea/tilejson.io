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
    TOGGLE_ADD_LAYER_DIALOG,
    TOGGLE_EDIT_LAYER_DIALOG,
    ADD_LAYER,
    TOGGLE_LAYER_BOX_INFO,
    REMOVE_LAYER,
    EDIT_LAYER,
    POST_ADD_EDIT_CLEAR,
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
    showAddLayerDialog: false,
    layers: [],
    showEditLayerDialog: false,
    editLayerId: -1,
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
                layers: [],
                showEditLayerDialog: false,
                editLayerId: -1,
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
        case TOGGLE_ADD_LAYER_DIALOG:
            return Object.assign({}, state, {
                showAddLayerDialog: action.payload.showAddLayerDialog,
            });
        case TOGGLE_EDIT_LAYER_DIALOG:
            return Object.assign({}, state, {
                showEditLayerDialog: action.payload.showEditLayerDialog,
                editLayerId: action.payload.i,
                name: action.payload.showEditLayerDialog ?
                    state.layers[action.payload.i].name : state.name,
                url: action.payload.showEditLayerDialog ?
                    state.layers[action.payload.i].url : state.url,
            });
        case ADD_LAYER: {
            const layers = state.layers;
            const newLayer = {
                name: action.payload.newLayer.name,
                url: action.payload.newLayer.url,
                tileJSON: action.payload.newLayer.tileJSON,
                detailView: false,
                sourceView: false,
            };
            layers.push(newLayer);
            return Object.assign({}, state, {
                layers,
            });
        }
        case TOGGLE_LAYER_BOX_INFO: {
            const layers = state.layers.map((layer, i) => {
                const newLayer = Object.assign({}, layer);
                if (i === action.payload.i) {
                    if (Object.hasOwnProperty.call(action.payload, 'detailView')) {
                        newLayer.detailView = action.payload.detailView;
                    }
                    if (Object.hasOwnProperty.call(action.payload, 'sourceView')) {
                        newLayer.sourceView = action.payload.sourceView;
                    }
                }
                return newLayer;
            });
            return Object.assign({}, state, {
                layers,
            });
        }
        case REMOVE_LAYER: {
            const tileJSON = [...state.tileJSON.slice(0, action.payload.i),
                ...state.tileJSON.slice(action.payload.i + 1)];
            const layers = [...state.layers.slice(0, action.payload.i),
                ...state.layers.slice(action.payload.i + 1)];
            return Object.assign({}, state, {
                tileJSON,
                layers,
            });
        }
        case EDIT_LAYER: {
            const layers = state.layers;
            const newLayer = {
                name: action.payload.newLayer.name,
                url: action.payload.newLayer.url,
                tileJSON: action.payload.newLayer.tileJSON,
                detailView: false,
                sourceView: false,
            };
            layers[action.payload.i] = newLayer;
            return Object.assign({}, state, {
                layers,
            });
        }
        case POST_ADD_EDIT_CLEAR:
            return Object.assign({}, state, {
                url: '',
                name: '',
                showAddLayerDialog: false,
                showEditLayerDialog: false,
                editLayerId: -1,
            });
        default:
            return state;
    }
}

export default combineReducers({
    main: mainReducer,
});
