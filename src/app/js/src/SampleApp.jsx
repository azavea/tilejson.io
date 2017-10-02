import React, { Component } from 'react';
import { arrayOf, func, object, string } from 'prop-types';
import { connect } from 'react-redux';

import TileLayer from 'ol/layer/tile';
import XYZ from 'ol/source/xyz';

import axios from 'axios';

import gistRequest from '../data/request.json';
import {
    changeLayerName,
    changeLayerUrl,
    changeTileJson,
    clearScreen,
    changeShareLink,
} from './actions';
import {
    baseLayer,
    map,
} from './constants';

class App extends Component {
    constructor(props) {
        super(props);
        this.layers = [
            baseLayer,
        ];
        this.changeUrl = this.changeUrl.bind(this);
        this.changeName = this.changeName.bind(this);
        this.addLayer = this.addLayer.bind(this);
        this.clearLayers = this.clearLayers.bind(this);
        this.share = this.share.bind(this);
        this.changeTileJSON = this.changeTileJSON.bind(this);
    }

    componentDidMount() {
        map.setTarget('map');
    }

    changeName(e) {
        this.props.dispatch(changeLayerName({
            name: e.target.value,
        }));
    }

    changeUrl(e) {
        this.props.dispatch(changeLayerUrl({
            url: e.target.value,
        }));
    }

    addLayer() {
        const newLayer = new TileLayer({
            source: new XYZ({
                url: this.props.url,
            }),
        });
        map.addLayer(newLayer);
        this.layers.push(newLayer);
        const layerName = (this.props.name === '' ? `Layer ${this.layers.length}` : this.props.name);
        const newTileJSON = {
            tilejson: '2.2.0',
            name: layerName,
            version: '1.0.0',
            scheme: 'xyz',
            tiles: [
                this.props.url,
            ],
        };
        const tileJSONList = this.props.tileJSON;
        tileJSONList.push(newTileJSON);
        this.props.dispatch(changeTileJson({
            tileJSON: tileJSONList,
        }));
    }

    clearLayers() {
        for (let i = 0; i < this.layers.length; i += 1) {
            if (this.layers[i] !== baseLayer) {
                map.removeLayer(this.layers[i]);
            }
        }
        this.layers = [
            baseLayer,
        ];
        this.props.dispatch(clearScreen());
    }

    share() {
        gistRequest.files['tile.json'].content = JSON.stringify(this.props.tileJSON, null, '\t');
        axios.post('https://api.github.com/gists', gistRequest)
            .then((response) => {
                this.props.dispatch(changeShareLink({
                    shareLink: `http://bl.ocks.org/d/${response.data.id}/`,
                }));
            });
    }

    changeTileJSON(e) {
        console.log(this.props.tileJSON);
        console.log(e.target.value);
        // TODO: validate the string, convert to array, dispatch
    }

    render() {
        return (
            <div>
                <div id="menu">
                    <h1>TileJSON.io</h1>
                    <input type="text" name="layerName" placeholder="Layer Name" id="layerNameInput" onChange={this.changeName} value={this.props.name} />
                    <input type="text" name="tileUrl" placeholder="Tile URL" id="tileUrlInput" onChange={this.changeUrl} value={this.props.url} />
                    <button onClick={this.addLayer} id="addLayerButton">Add</button>
                    <br /><br />
                    <button onClick={this.share} id="shareButton">Share</button>
                    <a href={this.props.shareLink} id="shareLink">{this.props.shareLink}</a>
                    <br /><br />
                    <button onClick={this.clearLayers} id="clearButton">Clear</button>
                    <br /><br />
                    <textarea id="jsonTextarea" onChange={this.changeTileJSON} value={this.props.tileJSONString} />
                </div>
                <div id="map" className="map" />
            </div>
        );
    }
}

App.propTypes = {
    dispatch: func.isRequired,
    name: string.isRequired,
    url: string.isRequired,
    tileJSON: arrayOf(object).isRequired,
    tileJSONString: string.isRequired,
    shareLink: string.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(App);
