import React, { Component } from 'react';
import { arrayOf, bool, func, object, string } from 'prop-types';
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
    toggleTileJSONEditMode,
    changeTileJSONParseError,
} from './actions';
import {
    baseLayer,
    map,
    getDefaultTileJSON,
    getBaseLayerTileJSON,
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
        this.editTileJSON = this.editTileJSON.bind(this);
        this.renderTileJSON = this.renderTileJSON.bind(this);
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
        const layerName = (this.props.name === '' ? `Layer ${this.layers.length - 1}` : this.props.name);
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
        document.getElementById('jsonTextarea').value = JSON.stringify(tileJSONList, null, '\t');
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
        const tileJSONList = getDefaultTileJSON();
        document.getElementById('jsonTextarea').value = JSON.stringify(tileJSONList, null, '\t');
    }

    share() {
        const tileJSON = this.props.tileJSON;
        tileJSON.unshift(getBaseLayerTileJSON());
        gistRequest.files['tile.json'].content = JSON.stringify(tileJSON, null, '\t');
        axios.post('https://api.github.com/gists', gistRequest)
            .then((response) => {
                this.props.dispatch(changeShareLink({
                    shareLink: `http://bl.ocks.org/d/${response.data.id}/`,
                }));
            });
    }

    editTileJSON() {
        this.props.dispatch(toggleTileJSONEditMode({
            tileJSONEditMode: true,
        }));
    }

    renderTileJSON() {
        const tileJSONString = document.getElementById('jsonTextarea').value;
        let tileJSON;
        try {
            tileJSON = JSON.parse(tileJSONString);
        } catch (e) {
            this.props.dispatch(changeTileJSONParseError({
                tileJSONParseError: e.toString(),
            }));
            return;
        }
        if (tileJSON.constructor !== Array) {
            this.props.dispatch(changeTileJSONParseError({
                tileJSONParseError: 'Input must be formatted as an array of TileJSON.',
            }));
            return;
        }
        for (let i = 0; i < this.layers.length; i += 1) {
            // TODO: Validate tileJSON[i] using tilejson-validator
            if (this.layers[i] !== baseLayer) {
                map.removeLayer(this.layers[i]);
            }
        }
        this.layers = [
            baseLayer,
        ];
        const tileJSONList = getDefaultTileJSON();
        for (let i = 0; i < tileJSON.length; i += 1) {
            const newLayer = new TileLayer({
                source: new XYZ({
                    url: tileJSON[i].tiles[0],
                }),
            });
            map.addLayer(newLayer);
            this.layers.push(newLayer);
            tileJSONList.push(tileJSON[i]);
        }
        this.props.dispatch(changeTileJson({
            tileJSON: tileJSONList,
        }));
        this.props.dispatch(changeTileJSONParseError({
            tileJSONParseError: '',
        }));
        document.getElementById('jsonTextarea').value = JSON.stringify(tileJSONList, null, '\t');
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
                    <textarea id="jsonTextarea" defaultValue={this.props.tileJSONString} disabled={!this.props.tileJSONEditMode} />
                    <br /><br />
                    <button onClick={this.props.tileJSONEditMode ? this.renderTileJSON : this.editTileJSON} id="editButton">{this.props.tileJSONEditMode ? 'Render' : 'Edit'}</button>
                    <span href={this.props.tileJSONParseError} id="shareLink">{this.props.tileJSONParseError}</span>
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
    tileJSONEditMode: bool.isRequired,
    tileJSONParseError: string.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(App);
