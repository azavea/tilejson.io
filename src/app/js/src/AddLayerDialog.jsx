import React, { Component } from 'react';
import { arrayOf, bool, func, object, string } from 'prop-types';
import { connect } from 'react-redux';

import TileLayer from 'ol/layer/tile';
import XYZ from 'ol/source/xyz';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import {
    changeLayerName,
    changeLayerUrl,
    changeTileJson,
    toggleAddLayerDialog,
    addLayer,
} from './actions';

class AddLayerDialog extends Component {
    constructor(props) {
        super(props);
        this.changeName = this.changeName.bind(this);
        this.changeUrl = this.changeUrl.bind(this);
        this.addLayer = this.addLayer.bind(this);
        this.closeAddLayerDialog = this.closeAddLayerDialog.bind(this);
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

    closeAddLayerDialog() {
        this.props.dispatch(toggleAddLayerDialog({
            showAddLayerDialog: false,
        }));
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
        const layerNum = this.props.addLayer(newLayer);
        const layerName = (this.props.name === '' ? `Layer ${layerNum - 1}` : this.props.name);
        const newTileJSON = {
            tilejson: '2.2.0',
            name: layerName,
            version: '1.0.0',
            scheme: 'xyz',
            tiles: [
                this.props.url,
            ],
        };
        this.props.dispatch(addLayer({
            newLayer: {
                name: layerName,
                url: this.props.url,
            },
        }));
        const tileJSONList = this.props.tileJSON;
        tileJSONList.push(newTileJSON);
        this.props.dispatch(changeTileJson({
            tileJSON: tileJSONList,
        }));
        if (document.getElementById('jsonTextarea')) {
            document.getElementById('jsonTextarea').value = JSON.stringify(tileJSONList, null, '\t');
        }
        this.props.dispatch(toggleAddLayerDialog({
            showAddLayerDialog: false,
        }));
        this.props.dispatch(changeLayerName({
            name: '',
        }));
        this.props.dispatch(changeLayerUrl({
            url: '',
        }));
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                onClick={this.closeAddLayerDialog}
            />,
            <FlatButton
                label="Add"
                primary
                onClick={this.addLayer}
            />,
        ];
        return (
            <div>
                <Dialog
                    title="Add Layer"
                    actions={actions}
                    modal={false}
                    open={this.props.showAddLayerDialog}
                    onRequestClose={this.closeAddLayerDialog}
                >
                    <TextField hintText="Layer Name" fullWidth onChange={this.changeName} value={this.props.name} />
                    <TextField hintText="Tile URL" fullWidth onChange={this.changeUrl} value={this.props.url} />
                </Dialog>
            </div>
        );
    }
}

AddLayerDialog.propTypes = {
    dispatch: func.isRequired,
    addLayer: func.isRequired,
    name: string.isRequired,
    url: string.isRequired,
    tileJSON: arrayOf(object).isRequired,
    showAddLayerDialog: bool.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(AddLayerDialog);
