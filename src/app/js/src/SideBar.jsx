import React, { Component } from 'react';
import { arrayOf, bool, func, object, string } from 'prop-types';
import { connect } from 'react-redux';

import TileLayer from 'ol/layer/tile';
import XYZ from 'ol/source/xyz';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import ExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import TextField from 'material-ui/TextField';

import { Grid, Row, Col } from 'react-flexbox-grid';

import { validate } from 'tilejson-validator';

import LayerBoxes from './LayerBoxes';
import QuickAddLayerBox from './QuickAddLayerBox';

import {
    changeTileJson,
    changeTileJSONParseError,
    toggleCollapse,
    toggleErrorSnackbarOpen,
    toggleTileJSONEditMode,
    toggleDiffMode,
    toggleShareDescriptionDialogOpen,
    githubLogin,
    githubLogout,
    toggleErrorDialog,
} from './actions';
import {
    map,
    getDefaultTileJSON,
    authenticator,
    authConfig,
} from './constants';

class SideBar extends Component {
    constructor(props) {
        super(props);
        this.collapse = this.collapse.bind(this);
        this.editTileJSON = this.editTileJSON.bind(this);
        this.renderTileJSON = this.renderTileJSON.bind(this);
        this.openDiffMode = this.openDiffMode.bind(this);
        this.share = this.share.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    collapse() {
        this.props.dispatch(toggleCollapse({
            isCollapsed: true,
        }));
        setTimeout(() => {
            map.updateSize();
        }, 100);
    }

    editTileJSON() {
        this.props.dispatch(toggleTileJSONEditMode({
            tileJSONEditMode: true,
        }));
    }

    openDiffMode() {
        this.props.dispatch(toggleDiffMode({
            diffMode: true,
        }));
        setTimeout(() => {
            map.updateSize();
        }, 100);
    }

    share() {
        this.props.dispatch(toggleShareDescriptionDialogOpen({
            shareDescriptionDialogOpen: true,
        }));
    }

    login() {
        if (this.props.githubToken !== '') {
            return;
        }
        authenticator.authenticate(authConfig, (err, data) => {
            if (err) {
                this.props.dispatch(toggleErrorDialog({
                    errorDialogOpen: true,
                    errorDialogTitle: 'GitHub Authentication Error',
                    errorDialogMessage: 'Your GitHub authentication seems to have failed. Try again later.',
                }));
            } else {
                this.props.dispatch(githubLogin({
                    githubToken: data.token,
                }));
            }
        });
    }

    logout() {
        this.props.dispatch(githubLogout());
    }

    renderTileJSON() {
        // Get tileJSON from textarea
        const tileJSONString = document.getElementById('jsonTextarea').value;
        let tileJSON;

        // Check if tileJSON can be parsed
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

        // Check if tileJSON is an array
        if (tileJSON.constructor !== Array) {
            this.props.dispatch(changeTileJSONParseError({
                tileJSONParseError: 'Input must be formatted as an array of TileJSON.',
            }));
            this.props.dispatch(toggleErrorSnackbarOpen({
                errorSnackbarOpen: true,
            }));
            return;
        }

        // Validate each individual object
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

        // Remove all layers except baseLayer from map
        this.props.removeLayers();
        const tileJSONList = getDefaultTileJSON();

        // Add new layers to map
        for (let i = 0; i < tileJSON.length; i += 1) {
            const newLayer = new TileLayer({
                source: new XYZ({
                    url: tileJSON[i].tiles[0],
                }),
            });
            this.props.addLayer(newLayer);
            tileJSONList.push(tileJSON[i]);
        }

        // Dispatch actions on success
        this.props.dispatch(changeTileJson({
            tileJSON: tileJSONList,
        }));
        this.props.dispatch(changeTileJSONParseError({
            tileJSONParseError: '',
        }));
        document.getElementById('jsonTextarea').value = JSON.stringify(tileJSONList, null, '\t');
    }

    render() {
        const sideBarFunction = 1;
        let sideBarItems;
        if (sideBarFunction === 0) {
            sideBarItems = (
                <div>
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
                </div>
            );
        } else if (sideBarFunction === 1) {
            sideBarItems = (
                <div>
                    <br />
                    <LayerBoxes
                        addLayer={this.props.addLayer}
                        removeLayer={this.props.removeLayer}
                        changeBaseLayer={this.props.changeBaseLayer}
                        changeOpacity={this.props.changeOpacity}
                        toggleVisibility={this.props.toggleVisibility}
                    />
                </div>
            );
        }
        const loginButton = (
            <FlatButton
                onClick={this.login}
                label="Login"
            />
        );
        const logoutButton = (
            <FlatButton
                onClick={this.logout}
                label="Logout"
            />
        );
        return (
            <Col xs={4} id="menu">
                <AppBar
                    title="TileJSON.io"
                    iconElementLeft={
                        <IconButton onClick={this.collapse}><ExpandLess /></IconButton>
                    }
                    iconElementRight={
                        this.props.githubToken === '' ? loginButton : logoutButton
                    }
                />
                <Grid fluid>
                    <br />
                    <Row>
                        <Col xs={4}>
                            <FlatButton
                                onClick={this.openDiffMode}
                                label="Diff"
                                disabled={this.props.layers.length < 2}
                                primary
                                fullWidth
                            />
                        </Col>
                        <Col xs={4}>
                            <FlatButton
                                onClick={this.share}
                                label="Share"
                                disabled={this.props.layers.length === 0}
                                primary
                                fullWidth
                            />
                        </Col>
                        <Col xs={4}>
                            <FlatButton
                                onClick={this.props.clearLayers}
                                label="Clear"
                                disabled={this.props.layers.length === 0}
                                primary
                                fullWidth
                            />
                        </Col>
                    </Row>
                    <br />
                    <QuickAddLayerBox
                        addLayer={this.props.addLayer}
                        openAddLayerDialog={this.props.openAddLayerDialog}
                    />
                    {sideBarItems}
                </Grid>
            </Col>
        );
    }
}

SideBar.propTypes = {
    dispatch: func.isRequired,
    addLayer: func.isRequired,
    removeLayers: func.isRequired,
    removeLayer: func.isRequired,
    openAddLayerDialog: func.isRequired,
    clearLayers: func.isRequired,
    tileJSONEditMode: bool.isRequired,
    tileJSONString: string.isRequired,
    changeBaseLayer: func.isRequired,
    layers: arrayOf(object).isRequired,
    changeOpacity: func.isRequired,
    toggleVisibility: func.isRequired,
    githubToken: string.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(SideBar);
