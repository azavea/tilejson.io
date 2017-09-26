export const CHANGE_LAYER_NAME = 'CHANGE_LAYER_NAME';
export const CHANGE_LAYER_URL = 'CHANGE_LAYER_URL';
export const CHANGE_TILE_JSON = 'CHANGE_TILE_JSON';
export const CLEAR_SCREEN = 'CLEAR_SCREEN';
export const CHANGE_SHARE_LINK = 'CHANGE_SHARE_LINK';

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
