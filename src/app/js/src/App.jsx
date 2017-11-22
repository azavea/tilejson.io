import React, { Component } from 'react';
import { arrayOf, bool, func, number, object, string } from 'prop-types';
import { connect } from 'react-redux';

import axios from 'axios';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';
import { Row, Col } from 'react-flexbox-grid';

import TileLayer from 'ol/layer/tile';
import Attribution from 'ol/attribution';
import XYZ from 'ol/source/xyz';

import gistRequest from '../data/request.json';
import gistRequestDiff from '../data/request-diff.json';
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
    changeCurrentBaseLayer,
    changeShareTitle,
    changeShareDescription,
} from './actions';
import {
    baseLayer,
    map,
    getDefaultTileJSON,
    getBaseLayerTileJSON,
    baseLayers,
    muiTheme,
} from './constants';
import AddLayerDialog from './AddLayerDialog';
import ShareDialog from './ShareDialog';
import ShareDescriptionDialog from './ShareDescriptionDialog';
import NavBar from './NavBar';
import SideBar from './SideBar';
import DiffToolbar from './DiffToolbar';

class App extends Component {
    constructor(props) {
        super(props);
        this.layers = [
            baseLayer,
        ];
        this.layersCounter = 1;
        this.clearLayers = this.clearLayers.bind(this);
        this.share = this.share.bind(this);
        this.handleErrorSbRequestClose = this.handleErrorSbRequestClose.bind(this);
        this.openAddLayerDialog = this.openAddLayerDialog.bind(this);
        this.addLayer = this.addLayer.bind(this);
        this.removeLayers = this.removeLayers.bind(this);
        this.removeLayer = this.removeLayer.bind(this);
        this.editLayer = this.editLayer.bind(this);
        this.getLayerName = this.getLayerName.bind(this);
        this.getLayerTileJSON = this.getLayerTileJSON.bind(this);
        this.changeBaseLayer = this.changeBaseLayer.bind(this);
        this.shareDiff = this.shareDiff.bind(this);
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
        for (let i = 1; i < this.layers.length; i += 1) {
            map.removeLayer(this.layers[i]);
        }
        this.layers = [
            this.layers[0],
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

    changeBaseLayer(i) {
        // Set source of changed layer on the ol map
        const layers = map.getLayers().getArray();
        layers[0].setSource(new XYZ({
            attributions: [
                new Attribution({
                    html: baseLayers[i].attribution,
                }),
            ],
            url: baseLayers[i].url,
        }));
        // Change the layer on list of layers maintained
        this.layers[0] = map.getLayers().getArray()[0];
        // Change currentBaseLayer in redux state
        this.props.dispatch(changeCurrentBaseLayer({
            currentBaseLayer: i,
        }));
    }

    clearLayers() {
        for (let i = 1; i < this.layers.length; i += 1) {
            map.removeLayer(this.layers[i]);
        }
        this.layers = [
            this.layers[0],
        ];
        this.props.dispatch(clearScreen());
        const tileJSONList = getDefaultTileJSON();
        if (document.getElementById('jsonTextarea')) {
            document.getElementById('jsonTextarea').value = JSON.stringify(tileJSONList, null, '\t');
        }
    }

    share() {
        const tileJSON = this.props.tileJSON.slice(0);
        tileJSON.unshift(getBaseLayerTileJSON(this.props.currentBaseLayer));
        gistRequest.files['tile.json'].content = JSON.stringify(tileJSON, null, '\t');
        const info = {};
        if (this.props.shareTitle !== '') {
            info.title = this.props.shareTitle;
        } else {
            info.title = 'Shared Map';
        }
        if (this.props.shareDescription !== '') {
            info.description = this.props.shareDescription;
        }
        const view = map.getView();
        info.center = view.getCenter();
        info.zoom = view.getZoom();
        gistRequest.files['info.json'].content = JSON.stringify(info, null, '\t');
        axios.post('https://api.github.com/gists', gistRequest)
            .then((response) => {
                this.props.dispatch(changeShareLink({
                    shareLink: `http://bl.ocks.org/d/${response.data.id}/`,
                }));
                this.props.dispatch(toggleShareSnackbarOpen({
                    shareSnackbarOpen: true,
                }));
            });
        this.props.dispatch(changeShareDescription({
            shareDescription: '',
        }));
        this.props.dispatch(changeShareTitle({
            shareTitle: '',
        }));
    }

    shareDiff() {
        const tileJSON = [
            getBaseLayerTileJSON(this.props.currentBaseLayer),
            this.props.tileJSON[this.props.diffLayerLeftId],
            this.props.tileJSON[this.props.diffLayerRightId],
        ];
        gistRequestDiff.files['tile.json'].content = JSON.stringify(tileJSON, null, '\t');
        const info = {};
        if (this.props.shareTitle !== '') {
            info.title = this.props.shareTitle;
        } else {
            info.title = 'Shared Map';
        }
        if (this.props.shareDescription !== '') {
            info.description = this.props.shareDescription;
        }
        const view = map.getView();
        info.center = view.getCenter();
        info.zoom = view.getZoom();
        gistRequestDiff.files['info.json'].content = JSON.stringify(info, null, '\t');
        axios.post('https://api.github.com/gists', gistRequestDiff)
            .then((response) => {
                this.props.dispatch(changeShareLink({
                    shareLink: `http://bl.ocks.org/d/${response.data.id}/`,
                }));
                this.props.dispatch(toggleShareSnackbarOpen({
                    shareSnackbarOpen: true,
                }));
            });
        this.props.dispatch(changeShareDescription({
            shareDescription: '',
        }));
        this.props.dispatch(changeShareTitle({
            shareTitle: '',
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
        const errorSnackbarStyle = {
            backgroundColor: '#fd4582',
        };
        let bar;
        let diffToolbar;
        if (this.props.isCollapsed || this.props.diffMode) {
            bar = (
                <NavBar />
            );
            if (this.props.diffMode) {
                diffToolbar = (<DiffToolbar />);
            }
        } else {
            bar = (
                <SideBar
                    openAddLayerDialog={this.openAddLayerDialog}
                    clearLayers={this.clearLayers}
                    addLayer={this.addLayer}
                    removeLayers={this.removeLayers}
                    removeLayer={this.removeLayer}
                    changeBaseLayer={this.changeBaseLayer}
                    openDiffMode={this.openDiffMode}
                />
            );
        }
        let mapClassName = 'map mapCollapsed';
        if (this.props.diffMode) {
            mapClassName = 'map mapDiff';
        } else if (this.props.isCollapsed) {
            mapClassName = 'map mapExpanded';
        }
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <Row>
                        {bar}
                        {diffToolbar}
                        <Col
                            xs={this.props.isCollapsed || this.props.diffMode ? 12 : 8}
                            id="map"
                            className={mapClassName}
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
                        <ShareDialog />
                        <ShareDescriptionDialog
                            share={this.share}
                            shareDiff={this.shareDiff}
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
    tileJSONParseError: string.isRequired,
    errorSnackbarOpen: bool.isRequired,
    isCollapsed: bool.isRequired,
    currentBaseLayer: number.isRequired,
    diffMode: bool.isRequired,
    shareTitle: string.isRequired,
    shareDescription: string.isRequired,
    diffLayerLeftId: number.isRequired,
    diffLayerRightId: number.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(App);
