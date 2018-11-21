import TileLayer from 'ol/layer/tile';
import XYZ from 'ol/source/xyz';
import Attribution from 'ol/attribution';
import Map from 'ol/map';
import View from 'ol/view';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Netlify from 'netlify-auth-providers';

export const baseLayers = [
    {
        name: 'OpenStreetMap.Mapnik',
        url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',
    },
    {
        name: 'Esri.WorldImagery',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
];

export const defaultBaseLayer = 0;

export const baseLayerUrl = baseLayers[defaultBaseLayer].url;

export const baseLayer = new TileLayer({
    source: new XYZ({
        attributions: [
            new Attribution({
                html: baseLayers[defaultBaseLayer].attribution,
            }),
        ],
        url: baseLayerUrl,
    }),
});

export const map = new Map({
    layers: [
        baseLayer,
    ],
    view: new View({
        center: [0, 0],
        zoom: 2,
    }),
});

export function getDefaultTileJSON() {
    return [];
}

export function getBaseLayerTileJSON(i) {
    return {
        tilejson: '2.2.0',
        name: 'base',
        version: '1.0.0',
        scheme: 'xyz',
        tiles: [
            baseLayers[i].url,
        ],
    };
}

export const diffMuiTheme = getMuiTheme({
    slider: {
        handleSize: 36,
        handleSizeDisabled: 36,
        handleSizeActive: 36,
        trackSize: 0,
        rippleColor: 'none',
        handleColorZero: '#7d7d7d',
        handleFillColor: '#7d7d7d',
        selectionColor: '#7d7d7d',
    },
    dropDownMenu: {
        accentColor: '#000',
    },
});

export const appMuiTheme = getMuiTheme({
    dropDownMenu: {
        accentColor: '#000',
    },
    button: {
        iconButtonSize: 36,
    },
});

export const defaultShareGist = false;
export const defaultShareTileJSONLink = false;
export const defaultShareBase = false;
export const defaultShareDiff = false;
export const defaultDefaultToDiff = false;

export const exampleURL = 'https://a.tiles.azavea.com/nlcd/{z}/{x}/{y}.png';

export const authenticator = new Netlify({ site_id: '55b9f51c-02f8-4555-a1e9-320fca59bcc5' });
export const authConfig = {
    provider: 'github',
    scope: 'gist,read:user',
};

export const shareLink = 'http://bl.ocks.org/d/';
