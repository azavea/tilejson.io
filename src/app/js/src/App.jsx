import React, { Component } from 'react';
import { arrayOf, bool, func, number, object, shape, string } from 'prop-types';
import { connect } from 'react-redux';

import axios from 'axios';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';
import { Row, Col } from 'react-flexbox-grid';

import TileLayer from 'ol/layer/tile';
import Attribution from 'ol/attribution';
import XYZ from 'ol/source/xyz';

import gistRequest from '../data/request.json';
import {
    changeTileJson,
    clearScreen,
    changeGistID,
    toggleShareSnackbarOpen,
    toggleErrorSnackbarOpen,
    toggleAddLayerDialog,
    addLayer,
    removeLayer,
    editLayer,
    postAddEditClear,
    changeCurrentBaseLayer,
    resetShareValues,
    loadGist,
    toggleErrorDialog,
    toggleEditMode,
} from './actions';
import {
    appMuiTheme,
    baseLayer,
    map,
    getDefaultTileJSON,
    getBaseLayerTileJSON,
    baseLayers,
} from './constants';
import AddLayerDialog from './AddLayerDialog';
import ShareDialog from './ShareDialog';
import ShareDescriptionDialog from './ShareDescriptionDialog';
import ErrorDialog from './ErrorDialog';
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
        this.changeOpacity = this.changeOpacity.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
        this.loadGist = this.loadGist.bind(this);
        if (this.props.match.params.id) {
            if (this.props.match.params.mode && this.props.match.params.mode === 'view') {
                this.props.dispatch(toggleEditMode({
                    editMode: false,
                }));
            } else {
                this.props.history.replace(`/g/${this.props.match.params.id}/edit`);
            }
            this.loadGist();
        } else {
            this.props.history.push('/');
        }
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
        this.props.history.push('/');
        this.props.dispatch(clearScreen());
        const tileJSONList = getDefaultTileJSON();
        if (document.getElementById('jsonTextarea')) {
            document.getElementById('jsonTextarea').value = JSON.stringify(tileJSONList, null, '\t');
        }
    }

    share() {
        if (this.props.githubToken === '') {
            return;
        }
        let tileJSON = this.props.tileJSON.slice(0);
        tileJSON = tileJSON.map((t, i) => {
            const newT = Object.assign({}, t);
            newT.opacity = this.props.layers[i].opacity;
            newT.visible = this.props.layers[i].visible;
            return newT;
        });
        gistRequest.files['tile.json'].content = JSON.stringify(tileJSON, null, '\t');
        const view = map.getView();
        const info = {
            baseLayer: getBaseLayerTileJSON(this.props.currentBaseLayer),
            diffLayerLeftId: this.props.diffLayerLeftId,
            diffLayerRightId: this.props.diffLayerRightId,
            shareGist: this.props.shareGist,
            shareTileJSONLink: this.props.shareTileJSONLink,
            shareBase: this.props.shareBase,
            shareDiff: this.props.shareDiff,
            defaultToDiff: this.props.defaultToDiff,
            center: view.getCenter(),
            zoom: view.getZoom(),
            currentBaseLayer: this.props.currentBaseLayer,
        };
        if (this.props.shareTitle !== '') {
            info.title = this.props.shareTitle;
            gistRequest.description += this.props.shareTitle;
        }
        if (this.props.shareDescription !== '') {
            info.description = this.props.shareDescription;
        }
        gistRequest.files['info.json'].content = JSON.stringify(info, null, '\t');
        const requestConfig = {
            headers: {
                Authorization: `Bearer ${this.props.githubToken}`,
            },
        };
        axios.post('https://api.github.com/gists', gistRequest, requestConfig)
            .then((response) => {
                this.props.dispatch(changeGistID({
                    gistID: response.data.id,
                }));
                this.props.dispatch(toggleShareSnackbarOpen({
                    shareSnackbarOpen: true,
                }));
            });
        this.props.dispatch(resetShareValues());
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

    changeOpacity(i, opacity) {
        this.layers[i + 1].setOpacity(opacity);
    }

    toggleVisibility(i, visible) {
        this.layers[i + 1].setVisible(visible);
    }

    loadGist() {
        axios.get(`https://api.github.com/gists/${this.props.match.params.id}`)
            .then((response) => {
                if (response.data.files['tile.json'].content === undefined ||
                    response.data.files['info.json'].content === undefined) {
                    return;
                }
                const tileJSON = JSON.parse(response.data.files['tile.json'].content);
                const infoJSON = JSON.parse(response.data.files['info.json'].content);
                if (tileJSON === undefined || infoJSON === undefined) {
                    return;
                }
                this.props.dispatch(loadGist({
                    tileJSON,
                    infoJSON,
                }));
                tileJSON.forEach((t) => {
                    const newLayer = new TileLayer({
                        source: new XYZ({
                            url: t.tiles[0],
                        }),
                    });
                    map.addLayer(newLayer);
                    newLayer.setVisible(t.visible);
                    newLayer.setOpacity(t.opacity);
                    this.layers.push(newLayer);
                    this.layersCounter += 1;
                });
                map.getView().setCenter(infoJSON.center);
                map.getView().setZoom(infoJSON.zoom);
                if (!infoJSON.shareBase) {
                    this.layers[0].setVisible(false);
                }
                if (infoJSON.currentBaseLayer !== undefined) {
                    this.changeBaseLayer(infoJSON.currentBaseLayer);
                }
            })
            .catch(() => {
                this.props.history.push('/');
                this.props.dispatch(toggleErrorDialog({
                    errorDialogOpen: true,
                    errorDialogTitle: 'Gist Not Found',
                    errorDialogMessage: 'The GitHub Gist ID specified was not found.',
                }));
            });
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
                    changeOpacity={this.changeOpacity}
                    toggleVisibility={this.toggleVisibility}
                />
            );
        }
        return (
            <MuiThemeProvider muiTheme={appMuiTheme}>
                <div>
                    <Row>
                        {bar}
                        {diffToolbar}
                        <Col
                            xs={this.props.isCollapsed || this.props.diffMode ? 12 : 8}
                            id="map"
                            className="map"
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
                        />
                        <ErrorDialog />
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
    layers: arrayOf(object).isRequired,
    shareGist: bool.isRequired,
    shareTileJSONLink: bool.isRequired,
    shareBase: bool.isRequired,
    shareDiff: bool.isRequired,
    defaultToDiff: bool.isRequired,
    match: shape({
        params: shape({
            id: string,
        }),
    }),
    history: shape({
        push: func,
    }),
    githubToken: string.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(App);
