import React, { Component } from 'react';
import { arrayOf, bool, func, object, string } from 'prop-types';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import { Row, Col } from 'react-flexbox-grid';

import {
    toggleShareDescriptionDialogOpen,
    changeShareDescription,
    changeShareTitle,
    toggleShareGist,
    toggleShareTileJSONLink,
    toggleShareBase,
    toggleShareDiff,
    toggleDefaultToDiff,
} from './actions';

class ShareDescriptionDialog extends Component {
    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.changeShareDescription = this.changeShareDescription.bind(this);
        this.changeShareTitle = this.changeShareTitle.bind(this);
        this.toggleShareGist = this.toggleShareGist.bind(this);
        this.toggleShareTileJSONLink = this.toggleShareTileJSONLink.bind(this);
        this.toggleShareBase = this.toggleShareBase.bind(this);
        this.toggleShareDiff = this.toggleShareDiff.bind(this);
        this.toggleDefaultToDiff = this.toggleDefaultToDiff.bind(this);
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

    changeShareTitle(e) {
        this.props.dispatch(changeShareTitle({
            shareTitle: e.target.value,
        }));
    }

    toggleShareGist(event, value) {
        this.props.dispatch(toggleShareGist({
            shareGist: value,
        }));
    }

    toggleShareTileJSONLink(event, value) {
        this.props.dispatch(toggleShareTileJSONLink({
            shareTileJSONLink: value,
        }));
    }

    toggleShareBase(event, value) {
        this.props.dispatch(toggleShareBase({
            shareBase: value,
        }));
    }

    toggleShareDiff(event, value) {
        this.props.dispatch(toggleShareDiff({
            shareDiff: value,
        }));
    }

    toggleDefaultToDiff(event, value) {
        this.props.dispatch(toggleDefaultToDiff({
            defaultToDiff: value,
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
        let diffOptions;
        if (this.props.layers.length >= 2) {
            diffOptions = (
                <Row>
                    <Col xs={6}>
                        <Checkbox
                            label="Include diff view"
                            checked={this.props.shareDiff}
                            onCheck={this.toggleShareDiff}
                        />
                    </Col>
                    <Col xs={6}>
                        <Checkbox
                            label="Default to diff view"
                            checked={this.props.defaultToDiff}
                            onCheck={this.toggleDefaultToDiff}
                            disabled={!this.props.shareDiff}
                        />
                    </Col>
                </Row>
            );
        }
        return (
            <div>
                <Dialog
                    title="Share Options"
                    actions={actions}
                    modal={false}
                    open={this.props.shareDescriptionDialogOpen}
                    onRequestClose={this.handleCancel}
                >
                    <TextField
                        name="shareTitle"
                        hintText="Map Title"
                        value={this.props.shareTitle}
                        onChange={this.changeShareTitle}
                        fullWidth
                    />
                    <TextField
                        name="shareDescription"
                        hintText="Map Description"
                        value={this.props.shareDescription}
                        onChange={this.changeShareDescription}
                        fullWidth
                    />
                    <br /><br />
                    <Checkbox
                        label="Link to Github Gist"
                        checked={this.props.shareGist}
                        onCheck={this.toggleShareGist}
                    />
                    <Checkbox
                        label="Link to TileJSON.io"
                        checked={this.props.shareTileJSONLink}
                        onCheck={this.toggleShareTileJSONLink}
                    />
                    <Checkbox
                        label="Include base layer"
                        checked={this.props.shareBase}
                        onCheck={this.toggleShareBase}
                    />
                    {diffOptions}
                </Dialog>
            </div>
        );
    }
}

ShareDescriptionDialog.propTypes = {
    dispatch: func.isRequired,
    shareDescriptionDialogOpen: bool.isRequired,
    shareTitle: string.isRequired,
    shareDescription: string.isRequired,
    share: func.isRequired,
    shareGist: bool.isRequired,
    shareTileJSONLink: bool.isRequired,
    shareBase: bool.isRequired,
    layers: arrayOf(object).isRequired,
    shareDiff: bool.isRequired,
    defaultToDiff: bool.isRequired,

};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(ShareDescriptionDialog);
