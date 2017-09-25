import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';

import Map from 'ol/map';
import View from 'ol/view';
import TileLayer from 'ol/layer/tile';
import XYZ from 'ol/source/xyz';

const url = 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png';

function getDefaultTileJSON() {
    return [
        {
            tilejson: '2.2.0',
            name: 'base',
            version: '1.0.0',
            scheme: 'xyz',
            tiles: [
                url,
            ],
        },
    ];
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            url: '',
            tileJSON: getDefaultTileJSON(),
            map: {},
            baseLayer: {},
            layers: [],
            shareLink: '',
        };
        this.changeUrl = this.changeUrl.bind(this);
        this.changeName = this.changeName.bind(this);
        this.addLayer = this.addLayer.bind(this);
        this.initBaseMap = this.initBaseMap.bind(this);
        this.createMap = this.createMap.bind(this);
        this.clearLayers = this.clearLayers.bind(this);
    }

    componentDidMount() {
        this.initBaseMap();
    }

    initBaseMap() {
        const baseLayer = new TileLayer({
            source: new XYZ({
                url,
            }),
        });
        this.setState({
            baseLayer,
            layers: [
                baseLayer,
            ],
        }, this.createMap);
    }

    createMap() {
        this.setState({
            map: new Map({
                target: 'map',
                layers: [
                    this.state.baseLayer,
                ],
                view: new View({
                    center: [0, 0],
                    zoom: 2,
                }),
            }),
        });
    }

    changeName(e) {
        this.setState({
            name: e.target.value,
        });
    }

    changeUrl(e) {
        this.setState({
            url: e.target.value,
        });
    }

    addLayer() {
        const newLayer = new TileLayer({
            source: new XYZ({
                url: this.state.url,
            }),
        });
        this.state.map.addLayer(newLayer);
        this.state.layers.push(newLayer);
        const layerName = (this.state.name === '' ? `Layer ${this.state.layers.length}` : this.state.name);
        const newTileJSON = {
            tilejson: '2.2.0',
            name: layerName,
            version: '1.0.0',
            scheme: 'xyz',
            tiles: [
                this.state.url,
            ],
        };
        const tileJSONList = this.state.tileJSON;
        tileJSONList.push(newTileJSON);
        this.setState({
            tileJSON: tileJSONList,
        });
    }

    clearLayers() {
        for (let i = 0; i < this.state.layers.length; i += 1) {
            if (this.state.layers[i] !== this.state.baseLayer) {
                this.state.map.removeLayer(this.state.layers[i]);
            }
        }
        this.setState({
            tileJSON: getDefaultTileJSON(),
            shareLink: '',
            url: '',
            name: '',
        });
        this.state.layers = [
            this.state.baseLayer,
        ];
    }

    render() {
        return (
            <div>
                <div id="menu">
                    <h1>TileJSON.io</h1>
                    <input type="text" name="layerName" placeholder="Layer Name" id="layerNameInput" onChange={this.changeName} value={this.state.name} />
                    <input type="text" name="tileUrl" placeholder="Tile URL" id="tileUrlInput" onChange={this.changeUrl} value={this.state.url} />
                    <button onClick={this.addLayer} id="addLayerButton">Add</button>
                    <br /><br />
                    <button onClick={this.clearLayers} id="clearButton">Clear</button>
                    <br /><br />
                </div>
                <div id="map" className="map" />
            </div>
        );
    }
}

App.propTypes = {
    dispatch: func.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(App);
