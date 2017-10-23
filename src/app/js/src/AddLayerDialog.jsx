import React, { Component } from 'react';
import { bool, func, string } from 'prop-types';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import {
    changeLayerName,
    changeLayerUrl,
    toggleAddLayerDialog,
} from './actions';

class AddLayerDialog extends Component {
    constructor(props) {
        super(props);
        this.changeName = this.changeName.bind(this);
        this.changeUrl = this.changeUrl.bind(this);
        this.closeAddLayerDialog = this.closeAddLayerDialog.bind(this);
        this.addOnKeyDown = this.addOnKeyDown.bind(this);
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

    addOnKeyDown(e) {
        if (e.keyCode === 13) {
            this.props.addLayer();
        }
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
                onClick={this.props.addLayer}
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
    addLayer: func.isRequired,
    name: string.isRequired,
    url: string.isRequired,
    showAddLayerDialog: bool.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(AddLayerDialog);
