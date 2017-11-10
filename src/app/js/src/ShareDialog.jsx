import React, { Component } from 'react';
import { bool, func, string } from 'prop-types';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import {
    toggleShareSnackbarOpen,
    toggleShareUrlCopied,
} from './actions';

class ShareDialog extends Component {
    constructor(props) {
        super(props);
        this.closeShareDialog = this.closeShareDialog.bind(this);
        this.onCopy = this.onCopy.bind(this);
    }

    onCopy() {
        this.props.dispatch(toggleShareUrlCopied({
            shareUrlCopied: true,
        }));
    }

    closeShareDialog() {
        this.props.dispatch(toggleShareSnackbarOpen({
            shareSnackbarOpen: false,
        }));
    }

    render() {
        const actions = [
            <FlatButton
                label="Close"
                onClick={this.closeShareDialog}
            />,
            <CopyToClipboard
                text={this.props.shareLink}
                onCopy={this.onCopy}
            >
                <FlatButton
                    label="Copy URL"
                    primary
                />
            </CopyToClipboard>,
        ];
        return (
            <div>
                <Dialog
                    title="Share URL"
                    actions={actions}
                    modal={false}
                    open={this.props.shareSnackbarOpen}
                    onRequestClose={this.closeShareDialog}
                >
                    <TextField
                        name="shareUrl"
                        value={this.props.shareLink}
                        fullWidth
                    />
                </Dialog>
            </div>
        );
    }
}

ShareDialog.propTypes = {
    dispatch: func.isRequired,
    shareSnackbarOpen: bool.isRequired,
    shareLink: string.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(ShareDialog);
