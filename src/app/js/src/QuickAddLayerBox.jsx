import React, { Component } from 'react';
import { arrayOf, func, object, string } from 'prop-types';
import { connect } from 'react-redux';

import IconButton from 'material-ui/IconButton';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import TileLayer from 'ol/layer/tile';
import XYZ from 'ol/source/xyz';

import {
    changeLayerUrl,
    changeLayerName,
    changeTileJson,
    toggleAddLayerDialog,
    addLayer,
} from './actions';

class QuickAddLayerBox extends Component {
    constructor(props) {
        super(props);
        this.changeUrl = this.changeUrl.bind(this);
        this.addLayer = this.addLayer.bind(this);
    }

    changeUrl(e) {
        this.props.dispatch(changeLayerUrl({
            url: e.target.value,
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
        const layerName = `Layer ${layerNum - 1}`;
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
                tileJSON: newTileJSON,
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
        const smallIcon = {
            width: 18,
            height: 18,
            color: '#8b8b8b',
        };
        const fontSize11 = {
            fontSize: '11pt',
        };
        return (
            <Paper zDepth={1} style={{ overflow: 'hidden' }}>
                <Toolbar>
                    <ToolbarGroup>
                        <TextField
                            style={fontSize11}
                            hintText="Add Tile URL"
                            onChange={this.changeUrl}
                            value={this.props.url}
                        />
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <IconButton iconStyle={smallIcon} onClick={this.addLayer} touch>
                            <ContentAddIcon />
                        </IconButton>
                    </ToolbarGroup>
                </Toolbar>
            </Paper>
        );
    }
}

QuickAddLayerBox.propTypes = {
    dispatch: func.isRequired,
    addLayer: func.isRequired,
    url: string.isRequired,
    tileJSON: arrayOf(object).isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(QuickAddLayerBox);
