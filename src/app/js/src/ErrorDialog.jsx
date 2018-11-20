import React, { Component } from 'react';
import { bool, func, string } from 'prop-types';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import {
    toggleErrorDialog,
} from './actions';

class ErrorDialog extends Component {
    constructor(props) {
        super(props);
        this.closeGistNotFoundDialog = this.closeGistNotFoundDialog.bind(this);
    }

    closeGistNotFoundDialog() {
        this.props.dispatch(toggleErrorDialog({
            errorDialogOpen: false,
            errorDialogTitle: '',
            errorDialogMessage: '',
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
                    title={this.props.errorDialogTitle}
                    actions={actions}
                    modal={false}
                    open={this.props.errorDialogOpen}
                    onRequestClose={this.closeGistNotFoundDialog}
                >
                    <p>{this.props.errorDialogMessage}</p>
                </Dialog>
            </div>
        );
    }
}

ErrorDialog.propTypes = {
    dispatch: func.isRequired,
    errorDialogOpen: bool.isRequired,
    errorDialogTitle: string.isRequired,
    errorDialogMessage: string.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(ErrorDialog);
