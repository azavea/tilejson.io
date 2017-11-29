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
    TOGGLE_BASE_LAYER_DETAILS,
    CHANGE_CURRENT_BASE_LAYER,
    TOGGLE_DIFF_MODE,
    CHANGE_DIFF_LEFT_LAYER_ID,
    CHANGE_DIFF_RIGHT_LAYER_ID,
    CHANGE_SHARE_TITLE,
    CHANGE_SHARE_DESCRIPTION,
    TOGGLE_SHARE_GIST,
    TOGGLE_SHARE_TILE_JSON_LINK,
    TOGGLE_SHARE_BASE,
    TOGGLE_SHARE_DIFF,
    TOGGLE_DEFAULT_TO_DIFF,
    RESET_SHARE_VALUES,
    TOGGLE_SHARE_DESCRIPTION_DIALOG_OPEN,
    CHANGE_LAYER_OPACITY,
    TOGGLE_LAYER_VISIBILITY,
    TOGGLE_BASE_LAYER_VISIBILITY,
} from './actions';

import {
    getDefaultTileJSON,
    defaultBaseLayer,
    defaultShareGist,
    defaultShareTileJSONLink,
    defaultShareBase,
    defaultShareDiff,
    defaultDefaultToDiff,
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
    currentBaseLayer: defaultBaseLayer,
    baseLayerDetails: false,
    diffMode: false,
    diffLayerLeftId: -1,
    diffLayerRightId: -1,
    swipeValue: 0.5,
    shareTitle: '',
    shareDescription: '',
    shareGist: defaultShareGist,
    shareTileJSONLink: defaultShareTileJSONLink,
    shareBase: defaultShareBase,
    shareDiff: defaultShareDiff,
    defaultToDiff: defaultDefaultToDiff,
    shareDescriptionDialogOpen: false,
    baseLayerVisible: true,
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
                baseLayerDetails: false,
                diffMode: false,
                diffLayerLeftId: -1,
                diffLayerRightId: -1,
                swipeValue: 0.5,
                shareTitle: '',
                shareDescription: '',
                shareGist: defaultShareGist,
                shareTileJSONLink: defaultShareTileJSONLink,
                shareBase: defaultShareBase,
                shareDiff: defaultShareDiff,
                defaultToDiff: defaultDefaultToDiff,
                shareDescriptionDialogOpen: false,
                baseLayerVisible: true,
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
                opacity: 1,
                visible: true,
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
                opacity: layers[action.payload.i].opacity,
                visible: layers[action.payload.i].visible,
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
        case TOGGLE_BASE_LAYER_DETAILS:
            return Object.assign({}, state, {
                baseLayerDetails: action.payload.baseLayerDetails,
            });
        case CHANGE_CURRENT_BASE_LAYER:
            return Object.assign({}, state, {
                currentBaseLayer: action.payload.currentBaseLayer,
            });
        case TOGGLE_DIFF_MODE: {
            if (action.payload.diffMode) {
                if (state.layers.length < 2) {
                    return state;
                }
                return Object.assign({}, state, {
                    diffMode: true,
                    diffLayerLeftId: 0,
                    diffLayerRightId: 1,
                    shareDiff: true,
                    defaultToDiff: true,
                });
            }
            return Object.assign({}, state, {
                diffMode: false,
                diffLayerLeftId: -1,
                diffLayerRightId: -1,
                shareDiff: false,
                defaultToDiff: false,
            });
        }
        case CHANGE_DIFF_LEFT_LAYER_ID:
            return Object.assign({}, state, {
                diffLayerLeftId: action.payload.id,
            });
        case CHANGE_DIFF_RIGHT_LAYER_ID:
            return Object.assign({}, state, {
                diffLayerRightId: action.payload.id,
            });
        case CHANGE_SHARE_TITLE:
            return Object.assign({}, state, {
                shareTitle: action.payload.shareTitle,
            });
        case CHANGE_SHARE_DESCRIPTION:
            return Object.assign({}, state, {
                shareDescription: action.payload.shareDescription,
            });
        case TOGGLE_SHARE_GIST:
            return Object.assign({}, state, {
                shareGist: action.payload.shareGist,
            });
        case TOGGLE_SHARE_TILE_JSON_LINK:
            return Object.assign({}, state, {
                shareTileJSONLink: action.payload.shareTileJSONLink,
            });
        case TOGGLE_SHARE_BASE:
            return Object.assign({}, state, {
                shareBase: action.payload.shareBase,
            });
        case TOGGLE_SHARE_DIFF:
            return Object.assign({}, state, {
                shareDiff: action.payload.shareDiff,
            });
        case TOGGLE_DEFAULT_TO_DIFF:
            return Object.assign({}, state, {
                defaultToDiff: action.payload.defaultToDiff,
            });
        case RESET_SHARE_VALUES:
            return Object.assign({}, state, {
                shareTitle: '',
                shareDescription: '',
                shareGist: defaultShareGist,
                shareTileJSONLink: defaultShareTileJSONLink,
                shareBase: defaultShareBase,
                shareDiff: defaultShareDiff,
                defaultToDiff: defaultDefaultToDiff,
            });
        case TOGGLE_SHARE_DESCRIPTION_DIALOG_OPEN:
            return Object.assign({}, state, {
                shareDescriptionDialogOpen:
                    action.payload.shareDescriptionDialogOpen,
            });
        case CHANGE_LAYER_OPACITY: {
            const layers = state.layers;
            layers[action.payload.i].opacity = action.payload.opacity;
            return Object.assign({}, state, {
                layers,
            });
        }
        case TOGGLE_LAYER_VISIBILITY: {
            const layers = state.layers;
            layers[action.payload.i].visible = action.payload.visible;
            return Object.assign({}, state, {
                layers,
            });
        }
        case TOGGLE_BASE_LAYER_VISIBILITY:
            return Object.assign({}, state, {
                baseLayerVisible: action.payload.visible,
            });
        default:
            return state;
    }
}

export default combineReducers({
    main: mainReducer,
});
