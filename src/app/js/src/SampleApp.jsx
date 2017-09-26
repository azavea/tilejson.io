import React, { Component } from 'react';
import { arrayOf, bool, func, object, string } from 'prop-types';
import { connect } from 'react-redux';

import TileLayer from 'ol/layer/tile';
import XYZ from 'ol/source/xyz';

import axios from 'axios';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import gistRequest from '../data/request.json';
import {
    changeLayerName,
    changeLayerUrl,
    changeTileJson,
    clearScreen,
    changeShareLink,
    toggleTileJSONEditMode,
    changeTileJSONParseError,
    toggleShareSnackbarOpen,
    toggleErrorSnackbarOpen,
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
        this.handleShareSbRequestClose = this.handleShareSbRequestClose.bind(this);
        this.handleErrorSbRequestClose = this.handleErrorSbRequestClose.bind(this);
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
                this.props.dispatch(toggleShareSnackbarOpen({
                    shareSnackbarOpen: true,
                }));
            });
    }

    editTileJSON() {
        this.props.dispatch(toggleTileJSONEditMode({
            tileJSONEditMode: true,
        }));
    }

    handleShareSbRequestClose() {
        this.props.dispatch(toggleShareSnackbarOpen({
            shareSnackbarOpen: false,
        }));
    }

    handleErrorSbRequestClose() {
        this.props.dispatch(toggleErrorSnackbarOpen({
            errorSnackbarOpen: false,
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
            this.props.dispatch(toggleErrorSnackbarOpen({
                errorSnackbarOpen: true,
            }));
            return;
        }
        if (tileJSON.constructor !== Array) {
            this.props.dispatch(changeTileJSONParseError({
                tileJSONParseError: 'Input must be formatted as an array of TileJSON.',
            }));
            this.props.dispatch(toggleErrorSnackbarOpen({
                errorSnackbarOpen: true,
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
        const shareSnackbarMessage = (
            <a className="snackbarLink" href={this.props.shareLink}>{this.props.shareLink}</a>
        );
        return (
            <MuiThemeProvider>
                <div>
                    <div id="menu">
                        <AppBar title="TileJSON.io" iconElementLeft={<IconButton><ExpandLess /></IconButton>} />
                        <TextField hintText="Layer Name" fullWidth onChange={this.changeName} value={this.props.name} />
                        <TextField hintText="Tile URL" fullWidth onChange={this.changeUrl} value={this.props.url} />
                        <RaisedButton onClick={this.addLayer} label="Add Layer" fullWidth />
                        <br /><br />
                        <RaisedButton onClick={this.share} label="Share" fullWidth />
                        <br /><br />
                        <RaisedButton onClick={this.clearLayers} label="Clear" fullWidth />
                        <br /><br />
                        <TextField
                            id="jsonTextarea"
                            multiLine
                            rows={6}
                            rowsMax={6}
                            defaultValue={this.props.tileJSONString}
                            disabled={!this.props.tileJSONEditMode}
                            fullWidth
                        />
                        <RaisedButton
                            onClick={
                                this.props.tileJSONEditMode ?
                                this.renderTileJSON : this.editTileJSON
                            }
                            label={this.props.tileJSONEditMode ? 'Render' : 'Edit'}
                            fullWidth
                        />
                    </div>
                    <div id="map" className="map" />
                    <Snackbar
                        open={this.props.shareSnackbarOpen}
                        message={shareSnackbarMessage}
                        onRequestClose={this.handleShareSbRequestClose}
                    />
                    <Snackbar
                        open={this.props.errorSnackbarOpen}
                        message={this.props.tileJSONParseError}
                        onRequestClose={this.handleErrorSbRequestClose}
                    />
                </div>
            </MuiThemeProvider>
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
    shareSnackbarOpen: bool.isRequired,
    errorSnackbarOpen: bool.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(App);
