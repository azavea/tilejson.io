import React, { Component } from 'react';
import { arrayOf, bool, func, object, string } from 'prop-types';
import { connect } from 'react-redux';

import axios from 'axios';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';
import { Row, Col } from 'react-flexbox-grid';

import TileLayer from 'ol/layer/tile';
import XYZ from 'ol/source/xyz';

import gistRequest from '../data/request.json';
import {
    changeTileJson,
    clearScreen,
    changeShareLink,
    toggleShareSnackbarOpen,
    toggleErrorSnackbarOpen,
    toggleAddLayerDialog,
    addLayer,
    removeLayer,
    editLayer,
    postAddEditClear,
} from './actions';
import {
    baseLayer,
    map,
    getDefaultTileJSON,
    getBaseLayerTileJSON,
} from './constants';
import AddLayerDialog from './AddLayerDialog';
import NavBar from './NavBar';
import SideBar from './SideBar';

class App extends Component {
    constructor(props) {
        super(props);
        this.layers = [
            baseLayer,
        ];
        this.layersCounter = 1;
        this.clearLayers = this.clearLayers.bind(this);
        this.share = this.share.bind(this);
        this.handleShareSbRequestClose = this.handleShareSbRequestClose.bind(this);
        this.handleErrorSbRequestClose = this.handleErrorSbRequestClose.bind(this);
        this.openAddLayerDialog = this.openAddLayerDialog.bind(this);
        this.addLayer = this.addLayer.bind(this);
        this.removeLayers = this.removeLayers.bind(this);
        this.removeLayer = this.removeLayer.bind(this);
        this.editLayer = this.editLayer.bind(this);
        this.getLayerName = this.getLayerName.bind(this);
        this.getLayerTileJSON = this.getLayerTileJSON.bind(this);
    }

    componentDidMount() {
        map.setTarget('map');
    }

    getLayerName() {
        let layerName = this.props.name;
        if (layerName === '') {
            layerName = `Layer ${this.layersCounter}`;
            this.layersCounter += 1;
        }
        return layerName;
    }

    getLayerTileJSON() {
        return {
            tilejson: '2.2.0',
            name: this.getLayerName(),
            version: '1.0.0',
            scheme: 'xyz',
            tiles: [
                this.props.url,
            ],
        };
    }

    addLayer() {
        if (this.props.url === '') {
            return;
        }
        const newLayer = new TileLayer({
            source: new XYZ({
                url: this.props.url,
            }),
        });
        const newTileJSON = this.getLayerTileJSON();
        const tileJSONList = this.props.tileJSON;
        tileJSONList.push(newTileJSON);
        this.props.dispatch(addLayer({
            newLayer: {
                name: newTileJSON.name,
                url: this.props.url,
                tileJSON: newTileJSON,
            },
        }));
        this.props.dispatch(changeTileJson({
            tileJSON: tileJSONList,
        }));

        // Add layer to the ol map
        map.addLayer(newLayer);
        // Add layer to list of layers maintained
        this.layers.push(newLayer);
        // Clear artifacts of add
        this.props.dispatch(postAddEditClear());
    }

    removeLayers() {
        for (let i = 0; i < this.layers.length; i += 1) {
            if (this.layers[i] !== baseLayer) {
                map.removeLayer(this.layers[i]);
            }
        }
        this.layers = [
            baseLayer,
        ];
    }

    removeLayer(i) {
        // Remove layer from the ol map
        map.removeLayer(this.layers[i + 1]);
        // Remove layer from list of layers maintained
        this.layers.splice(i + 1, 1);
        // Remove layer from the redux global state
        this.props.dispatch(removeLayer({
            i,
        }));
    }

    editLayer(i) {
        if (this.props.url === '') {
            return;
        }
        const newTileJSON = this.getLayerTileJSON();
        const tileJSONList = this.props.tileJSON;
        tileJSONList[i] = newTileJSON;
        this.props.dispatch(editLayer({
            newLayer: {
                name: newTileJSON.name,
                url: this.props.url,
                tileJSON: newTileJSON,
            },
            i,
        }));
        this.props.dispatch(changeTileJson({
            tileJSON: tileJSONList,
        }));

        // Set source of changed layer on the ol map
        const layers = map.getLayers().getArray();
        layers[i + 1].setSource(new XYZ({
            url: this.props.url,
        }));
        // Change the layer on list of layers maintained
        this.layers[i + 1] = map.getLayers().getArray()[i + 1];
        // Clear artifacts of change
        this.props.dispatch(postAddEditClear());
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
        if (document.getElementById('jsonTextarea')) {
            document.getElementById('jsonTextarea').value = JSON.stringify(tileJSONList, null, '\t');
        }
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

    openAddLayerDialog() {
        this.props.dispatch(toggleAddLayerDialog({
            showAddLayerDialog: true,
        }));
    }

    render() {
        const shareSnackbarMessage = (
            <a className="snackbarLink" href={this.props.shareLink}>{this.props.shareLink}</a>
        );
        const errorSnackbarStyle = {
            backgroundColor: '#fd4582',
        };
        let bar;
        if (this.props.isCollapsed) {
            bar = (
                <NavBar
                    openAddLayerDialog={this.openAddLayerDialog}
                    share={this.share}
                    clearLayers={this.clearLayers}
                />
            );
        } else {
            bar = (
                <SideBar
                    openAddLayerDialog={this.openAddLayerDialog}
                    share={this.share}
                    clearLayers={this.clearLayers}
                    addLayer={this.addLayer}
                    removeLayers={this.removeLayers}
                    removeLayer={this.removeLayer}
                />
            );
        }
        return (
            <MuiThemeProvider>
                <div>
                    <Row>
                        {bar}
                        <Col
                            xs={this.props.isCollapsed ? 12 : 8}
                            id="map"
                            className={this.props.isCollapsed ?
                                'map mapExpanded' : 'map mapCollapsed'}
                        />
                        <Snackbar
                            open={this.props.shareSnackbarOpen}
                            message={shareSnackbarMessage}
                            onRequestClose={this.handleShareSbRequestClose}
                        />
                        <Snackbar
                            open={this.props.errorSnackbarOpen}
                            message={this.props.tileJSONParseError}
                            onRequestClose={this.handleErrorSbRequestClose}
                            bodyStyle={errorSnackbarStyle}
                        />
                        <AddLayerDialog
                            editMode={false}
                            addLayer={this.addLayer}
                        />
                        <AddLayerDialog
                            editMode
                            editLayer={this.editLayer}
                        />
                    </Row>
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
    shareLink: string.isRequired,
    tileJSONParseError: string.isRequired,
    shareSnackbarOpen: bool.isRequired,
    errorSnackbarOpen: bool.isRequired,
    isCollapsed: bool.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(App);
