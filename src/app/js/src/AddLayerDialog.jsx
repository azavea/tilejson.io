import React, { Component } from 'react';
import { bool, func, number, string } from 'prop-types';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import {
    changeLayerName,
    changeLayerUrl,
    toggleAddLayerDialog,
    toggleEditLayerDialog,
} from './actions';

class AddLayerDialog extends Component {
    constructor(props) {
        super(props);
        this.changeName = this.changeName.bind(this);
        this.changeUrl = this.changeUrl.bind(this);
        this.closeAddLayerDialog = this.closeAddLayerDialog.bind(this);
        this.closeEditLayerDialog = this.closeEditLayerDialog.bind(this);
        this.addOnKeyDown = this.addOnKeyDown.bind(this);
        this.editLayer = this.editLayer.bind(this);
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

    closeEditLayerDialog() {
        this.props.dispatch(toggleEditLayerDialog({
            showEditLayerDialog: false,
        }));
    }

    addOnKeyDown(e) {
        if (e.keyCode === 13) {
            if (this.props.editMode) {
                this.props.editLayer(this.props.editLayerId);
            } else {
                this.props.addLayer();
            }
        }
    }

    editLayer() {
        this.props.editLayer(this.props.editLayerId);
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                onClick={this.props.editMode ?
                    this.closeEditLayerDialog :
                    this.closeAddLayerDialog}
            />,
            <FlatButton
                label={this.props.editMode ? 'Save' : 'Add'}
                primary
                onClick={this.props.editMode ? this.editLayer : this.props.addLayer}
            />,
        ];
        const title = this.props.editMode ? 'Edit Layer' : 'Add Layer';
        return (
            <div>
                <Dialog
                    title={title}
                    actions={actions}
                    modal={false}
                    open={this.props.editMode ?
                        this.props.showEditLayerDialog :
                        this.props.showAddLayerDialog}
                    onRequestClose={this.closeAddLayerDialog}
                >
                    <TextField
                        hintText="Layer Name"
                        fullWidth
                        onChange={this.changeName}
                        value={this.props.name}
                        onKeyDown={this.addOnKeyDown}
                    />
                    <TextField
                        hintText="Tile URL"
                        fullWidth
                        onChange={this.changeUrl}
                        value={this.props.url}
                        onKeyDown={this.addOnKeyDown}
                    />
                </Dialog>
            </div>
        );
    }
}

AddLayerDialog.propTypes = {
    dispatch: func.isRequired,
    name: string.isRequired,
    url: string.isRequired,
    showAddLayerDialog: bool.isRequired,
    showEditLayerDialog: bool.isRequired,
    editMode: bool.isRequired,
    editLayerId: number.isRequired,
    addLayer: func,
    editLayer: func,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(AddLayerDialog);
