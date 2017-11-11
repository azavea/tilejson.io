import React, { Component } from 'react';
import { bool, func, string } from 'prop-types';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import {
    toggleShareDescriptionDialogOpen,
    changeShareDescription,
} from './actions';

class ShareDescriptionDialog extends Component {
    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.changeShareDescription = this.changeShareDescription.bind(this);
    }

    handleCancel() {
        this.props.dispatch(toggleShareDescriptionDialogOpen({
            shareDescriptionDialogOpen: false,
        }));
    }

    handleSave() {
        this.props.dispatch(toggleShareDescriptionDialogOpen({
            shareDescriptionDialogOpen: false,
        }));
        this.props.share();
    }

    changeShareDescription(e) {
        this.props.dispatch(changeShareDescription({
            shareDescription: e.target.value,
        }));
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                onClick={this.handleCancel}
            />,
            <FlatButton
                label="Share"
                onClick={this.handleSave}
                primary
            />,
        ];
        return (
            <div>
                <Dialog
                    title="Enter Description of Shared Map"
                    actions={actions}
                    modal={false}
                    open={this.props.shareDescriptionDialogOpen}
                    onRequestClose={this.handleCancel}
                >
                    <TextField
                        name="shareDescription"
                        hintText="Share Description"
                        value={this.props.shareDescription}
                        onChange={this.changeShareDescription}
                        fullWidth
                    />
                </Dialog>
            </div>
        );
    }
}

ShareDescriptionDialog.propTypes = {
    dispatch: func.isRequired,
    shareDescriptionDialogOpen: bool.isRequired,
    shareDescription: string.isRequired,
    share: func.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(ShareDescriptionDialog);
