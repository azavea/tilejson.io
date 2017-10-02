import TileLayer from 'ol/layer/tile';
import XYZ from 'ol/source/xyz';
import Map from 'ol/map';
import View from 'ol/view';

export const baseLayerUrl = 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png';

export const baseLayer = new TileLayer({
    source: new XYZ({
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
    return [
        {
            tilejson: '2.2.0',
            name: 'base',
            version: '1.0.0',
            scheme: 'xyz',
            tiles: [
                baseLayerUrl,
            ],
        },
    ];
}
