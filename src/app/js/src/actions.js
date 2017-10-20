export const CHANGE_LAYER_NAME = 'CHANGE_LAYER_NAME';
export const CHANGE_LAYER_URL = 'CHANGE_LAYER_URL';
export const CHANGE_TILE_JSON = 'CHANGE_TILE_JSON';
export const CHANGE_SHARE_LINK = 'CHANGE_SHARE_LINK';

export const CLEAR_SCREEN = 'CLEAR_SCREEN';

export const TOGGLE_TILE_JSON_EDIT_MODE = 'TOGGLE_TILE_JSON_EDIT_MODE';
export const CHANGE_TILE_JSON_PARSE_ERROR = 'CHANGE_TILE_JSON_PARSE_ERROR';
export const TOGGLE_SHARE_SNACKBAR_OPEN = 'TOGGLE_SHARE_SNACKBAR_OPEN';
export const TOGGLE_ERROR_SNACKBAR_OPEN = 'TOGGLE_ERROR_SNACKBAR_OPEN';
export const TOGGLE_COLLAPSE = 'TOGGLE_COLLAPSE';
export const TOGGLE_ADD_LAYER_DIALOG = 'TOGGLE_ADD_LAYER_DIALOG';

export const ADD_LAYER = 'ADD_LAYER';
export const TOGGLE_LAYER_BOX_INFO = 'TOGGLE_LAYER_BOX_INFO';

export function changeLayerName(payload) {
    return {
        type: CHANGE_LAYER_NAME,
        payload,
    };
}

export function changeLayerUrl(payload) {
    return {
        type: CHANGE_LAYER_URL,
        payload,
    };
}

export function changeTileJson(payload) {
    return {
        type: CHANGE_TILE_JSON,
        payload,
    };
}

export function clearScreen() {
    return {
        type: CLEAR_SCREEN,
    };
}

export function changeShareLink(payload) {
    return {
        type: CHANGE_SHARE_LINK,
        payload,
    };
}

export function toggleTileJSONEditMode(payload) {
    return {
        type: TOGGLE_TILE_JSON_EDIT_MODE,
        payload,
    };
}

export function changeTileJSONParseError(payload) {
    return {
        type: CHANGE_TILE_JSON_PARSE_ERROR,
        payload,
    };
}

export function toggleShareSnackbarOpen(payload) {
    return {
        type: TOGGLE_SHARE_SNACKBAR_OPEN,
        payload,
    };
}

export function toggleErrorSnackbarOpen(payload) {
    return {
        type: TOGGLE_ERROR_SNACKBAR_OPEN,
        payload,
    };
}

export function toggleCollapse(payload) {
    return {
        type: TOGGLE_COLLAPSE,
        payload,
    };
}

export function toggleAddLayerDialog(payload) {
    return {
        type: TOGGLE_ADD_LAYER_DIALOG,
        payload,
    };
}

export function addLayer(payload) {
    return {
        type: ADD_LAYER,
        payload,
    };
}

export function toggleLayerBoxInfo(payload) {
    return {
        type: TOGGLE_LAYER_BOX_INFO,
        payload,
    };
}
