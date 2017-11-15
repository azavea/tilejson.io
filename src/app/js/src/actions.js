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
export const TOGGLE_EDIT_LAYER_DIALOG = 'TOGGLE_EDIT_LAYER_DIALOG';

export const ADD_LAYER = 'ADD_LAYER';
export const TOGGLE_LAYER_BOX_INFO = 'TOGGLE_LAYER_BOX_INFO';
export const REMOVE_LAYER = 'REMOVE_LAYER';
export const EDIT_LAYER = 'EDIT_LAYER';

export const POST_ADD_EDIT_CLEAR = 'POST_ADD_EDIT_CLEAR';

export const TOGGLE_BASE_LAYER_DETAILS = 'TOGGLE_BASE_LAYER_DETAILS';

export const CHANGE_CURRENT_BASE_LAYER = 'CHANGE_CURRENT_BASE_LAYER';

export const TOGGLE_DIFF_MODE = 'TOGGLE_DIFF_MODE';
export const CHANGE_DIFF_LEFT_LAYER_ID = 'CHANGE_DIFF_LEFT_LAYER_ID';
export const CHANGE_DIFF_RIGHT_LAYER_ID = 'CHANGE_DIFF_RIGHT_LAYER_ID';

export const CHANGE_SHARE_TITLE = 'CHANGE_SHARE_TITLE';
export const CHANGE_SHARE_DESCRIPTION = 'CHANGE_SHARE_DESCRIPTION';
export const TOGGLE_SHARE_DESCRIPTION_DIALOG_OPEN =
    'TOGGLE_SHARE_DESCRIPTION_DIALOG_OPEN';

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

export function toggleEditLayerDialog(payload) {
    return {
        type: TOGGLE_EDIT_LAYER_DIALOG,
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

export function removeLayer(payload) {
    return {
        type: REMOVE_LAYER,
        payload,
    };
}

export function editLayer(payload) {
    return {
        type: EDIT_LAYER,
        payload,
    };
}


export function postAddEditClear(payload) {
    return {
        type: POST_ADD_EDIT_CLEAR,
        payload,
    };
}

export function toggleBaseLayerDetails(payload) {
    return {
        type: TOGGLE_BASE_LAYER_DETAILS,
        payload,
    };
}

export function changeCurrentBaseLayer(payload) {
    return {
        type: CHANGE_CURRENT_BASE_LAYER,
        payload,
    };
}

export function toggleDiffMode(payload) {
    return {
        type: TOGGLE_DIFF_MODE,
        payload,
    };
}

export function changeDiffLeftLayerId(payload) {
    return {
        type: CHANGE_DIFF_LEFT_LAYER_ID,
        payload,
    };
}

export function changeDiffRightLayerId(payload) {
    return {
        type: CHANGE_DIFF_RIGHT_LAYER_ID,
        payload,
    };
}

export function changeShareTitle(payload) {
    return {
        type: CHANGE_SHARE_TITLE,
        payload,
    };
}

export function changeShareDescription(payload) {
    return {
        type: CHANGE_SHARE_DESCRIPTION,
        payload,
    };
}

export function toggleShareDescriptionDialogOpen(payload) {
    return {
        type: TOGGLE_SHARE_DESCRIPTION_DIALOG_OPEN,
        payload,
    };
}
