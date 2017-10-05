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
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import { Grid, Row, Col } from 'react-flexbox-grid';
import FlatButton from 'material-ui/FlatButton';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

import { validate } from 'tilejson-validator';

import gistRequest from '../data/request.json';
import {
    changeTileJson,
    clearScreen,
    changeShareLink,
    toggleTileJSONEditMode,
    changeTileJSONParseError,
    toggleShareSnackbarOpen,
    toggleErrorSnackbarOpen,
    toggleCollapse,
    toggleAddLayerDialog,
} from './actions';
import {
    baseLayer,
    map,
    getDefaultTileJSON,
    getBaseLayerTileJSON,
} from './constants';
import AddLayerDialog from './AddLayerDialog';

class App extends Component {
    constructor(props) {
        super(props);
        this.layers = [
            baseLayer,
        ];
        this.clearLayers = this.clearLayers.bind(this);
        this.share = this.share.bind(this);
        this.editTileJSON = this.editTileJSON.bind(this);
        this.renderTileJSON = this.renderTileJSON.bind(this);
        this.handleShareSbRequestClose = this.handleShareSbRequestClose.bind(this);
        this.handleErrorSbRequestClose = this.handleErrorSbRequestClose.bind(this);
        this.collapse = this.collapse.bind(this);
        this.expand = this.expand.bind(this);
        this.openAddLayerDialog = this.openAddLayerDialog.bind(this);
        this.addLayer = this.addLayer.bind(this);
    }

    componentDidMount() {
        map.setTarget('map');
    }

    addLayer(layer) {
        this.layers.push(layer);
        return this.layers.length;
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

    collapse() {
        this.props.dispatch(toggleCollapse({
            isCollapsed: true,
        }));
        setTimeout(() => {
            map.updateSize();
        }, 100);
    }

    expand() {
        this.props.dispatch(toggleCollapse({
            isCollapsed: false,
        }));
        setTimeout(() => {
            map.updateSize();
        }, 100);
    }

    openAddLayerDialog() {
        this.props.dispatch(toggleAddLayerDialog({
            showAddLayerDialog: true,
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
        for (let i = 0; i < tileJSON.length; i += 1) {
            if (!validate(tileJSON[i])) {
                const objectName = tileJSON[i].name ? tileJSON[i].name : i + 1;
                this.props.dispatch(changeTileJSONParseError({
                    tileJSONParseError: `Input object ${objectName} is not a valid TileJSON.`,
                }));
                this.props.dispatch(toggleErrorSnackbarOpen({
                    errorSnackbarOpen: true,
                }));
                return;
            }
        }
        for (let i = 0; i < this.layers.length; i += 1) {
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
        const errorSnackbarStyle = {
            backgroundColor: '#fd4582',
        };
        let sideBar;
        if (this.props.isCollapsed) {
            const styleWhiteText = {
                color: '#fff',
            };
            const styleBlueBackground = {
                backgroundColor: '#00bcd6',
            };
            sideBar = (
                <Col xs={12} id="header">
                    <Toolbar style={styleBlueBackground}>
                        <ToolbarGroup firstChild>
                            <IconButton onClick={this.expand}><ExpandMore color="white" /></IconButton>
                            <ToolbarTitle text="TileJSON.io" style={styleWhiteText} />
                        </ToolbarGroup>
                        <ToolbarGroup lastChild>
                            <FlatButton onClick={this.openAddLayerDialog} label="Add Layer" style={styleWhiteText} />
                            <FlatButton onClick={this.share} label="Share" style={styleWhiteText} />
                            <FlatButton onClick={this.clearLayers} label="Clear" style={styleWhiteText} />
                        </ToolbarGroup>
                    </Toolbar>
                </Col>
            );
        } else {
            sideBar = (
                <Col xs={4} id="menu">
                    <AppBar title="TileJSON.io" iconElementLeft={<IconButton onClick={this.collapse}><ExpandLess /></IconButton>} />
                    <Grid fluid>
                        <br />
                        <Row>
                            <Col xs={4}>
                                <FlatButton onClick={this.openAddLayerDialog} label="Add" primary fullWidth />
                            </Col>
                            <Col xs={4}>
                                <FlatButton onClick={this.share} label="Share" primary fullWidth />
                            </Col>
                            <Col xs={4}>
                                <FlatButton onClick={this.clearLayers} label="Clear" primary fullWidth />
                            </Col>
                        </Row>
                        <br />
                        <TextField
                            id="jsonTextarea"
                            multiLine
                            rows={10}
                            rowsMax={10}
                            defaultValue={this.props.tileJSONString}
                            disabled={!this.props.tileJSONEditMode}
                            fullWidth
                        />
                        <FlatButton
                            onClick={
                                this.props.tileJSONEditMode ?
                                this.renderTileJSON : this.editTileJSON
                            }
                            label={this.props.tileJSONEditMode ? 'Render' : 'Edit'}
                            fullWidth
                            primary
                        />
                    </Grid>
                </Col>
            );
        }
        return (
            <MuiThemeProvider>
                <div>
                    <Row>
                        {sideBar}
                        <Col xs={this.props.isCollapsed ? 12 : 8} id="map" className="map" />
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
                            addLayer={this.addLayer}
                        />
                    </Row>
                </div>
            </MuiThemeProvider>
        );
    }
}

App.propTypes = {
    dispatch: func.isRequired,
    tileJSON: arrayOf(object).isRequired,
    tileJSONString: string.isRequired,
    shareLink: string.isRequired,
    tileJSONEditMode: bool.isRequired,
    tileJSONParseError: string.isRequired,
    shareSnackbarOpen: bool.isRequired,
    errorSnackbarOpen: bool.isRequired,
    isCollapsed: bool.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(App);
