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
export const TOGGLE_SHARE_GIST = 'TOGGLE_SHARE_GIST';
export const TOGGLE_SHARE_TILE_JSON_LINK = 'TOGGLE_SHARE_TILE_JSON_LINK';
export const TOGGLE_SHARE_BASE = 'TOGGLE_SHARE_BASE';
export const TOGGLE_SHARE_DIFF = 'TOGGLE_SHARE_DIFF';
export const TOGGLE_DEFAULT_TO_DIFF = 'TOGGLE_DEFAULT_TO_DIFF';
export const RESET_SHARE_VALUES = 'RESET_SHARE_VALUES';

export const TOGGLE_SHARE_DESCRIPTION_DIALOG_OPEN =
    'TOGGLE_SHARE_DESCRIPTION_DIALOG_OPEN';

export const CHANGE_LAYER_OPACITY = 'CHANGE_LAYER_OPACITY';
export const TOGGLE_LAYER_VISIBILITY = 'TOGGLE_LAYER_VISIBILITY';
export const TOGGLE_BASE_LAYER_VISIBILITY = 'TOGGLE_BASE_LAYER_VISIBILITY';

export const LOAD_GIST = 'LOAD_GIST';

export const TOGGLE_ERROR_DIALOG = 'TOGGLE_ERROR_DIALOG';

export const GITHUB_LOGIN = 'GITHUB_LOGIN';
export const GITHUB_LOGOUT = 'GITHUB_LOGOUT';

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

export function toggleShareGist(payload) {
    return {
        type: TOGGLE_SHARE_GIST,
        payload,
    };
}

export function toggleShareTileJSONLink(payload) {
    return {
        type: TOGGLE_SHARE_TILE_JSON_LINK,
        payload,
    };
}

export function toggleShareBase(payload) {
    return {
        type: TOGGLE_SHARE_BASE,
        payload,
    };
}

export function toggleShareDiff(payload) {
    return {
        type: TOGGLE_SHARE_DIFF,
        payload,
    };
}

export function toggleDefaultToDiff(payload) {
    return {
        type: TOGGLE_DEFAULT_TO_DIFF,
        payload,
    };
}

export function resetShareValues() {
    return {
        type: RESET_SHARE_VALUES,
    };
}

export function toggleShareDescriptionDialogOpen(payload) {
    return {
        type: TOGGLE_SHARE_DESCRIPTION_DIALOG_OPEN,
        payload,
    };
}

export function changeLayerOpacity(payload) {
    return {
        type: CHANGE_LAYER_OPACITY,
        payload,
    };
}

export function toggleLayerVisibility(payload) {
    return {
        type: TOGGLE_LAYER_VISIBILITY,
        payload,
    };
}

export function toggleBaseLayerVisibility(payload) {
    return {
        type: TOGGLE_BASE_LAYER_VISIBILITY,
        payload,
    };
}

export function loadGist(payload) {
    return {
        type: LOAD_GIST,
        payload,
    };
}

export function toggleErrorDialog(payload) {
    return {
        type: TOGGLE_ERROR_DIALOG,
        payload,
    };
}

export function githubLogin(payload) {
    return {
        type: GITHUB_LOGIN,
        payload,
    };
}

export function githubLogout() {
    return {
        type: GITHUB_LOGOUT,
    };
}
