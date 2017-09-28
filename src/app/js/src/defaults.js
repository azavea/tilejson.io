export const baseLayerUrl = 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png';

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
