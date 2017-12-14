import React, { Component } from 'react';
import { bool, func } from 'prop-types';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import {
    toggleGistNotFoundDialog,
} from './actions';

class GistNotFoundDialog extends Component {
    constructor(props) {
        super(props);
        this.closeGistNotFoundDialog = this.closeGistNotFoundDialog.bind(this);
    }

    closeGistNotFoundDialog() {
        this.props.dispatch(toggleGistNotFoundDialog({
            gistNotFoundDialogOpen: false,
        }));
    }

    render() {
        const actions = [
            <FlatButton
                label="Close"
                onClick={this.closeGistNotFoundDialog}
            />,
        ];
        return (
            <div>
                <Dialog
                    title="Gist Not Found"
                    actions={actions}
                    modal={false}
                    open={this.props.gistNotFoundDialogOpen}
                    onRequestClose={this.closeGistNotFoundDialog}
                >
                    <p>The GitHub Gist ID specified was not found.</p>
                </Dialog>
            </div>
        );
    }
}

GistNotFoundDialog.propTypes = {
    dispatch: func.isRequired,
    gistNotFoundDialogOpen: bool.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(GistNotFoundDialog);
