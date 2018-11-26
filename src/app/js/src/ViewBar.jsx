import React, { Component } from 'react';
import { arrayOf, bool, func, object, string } from 'prop-types';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';
import { Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator } from 'material-ui/Toolbar';

import { Col } from 'react-flexbox-grid';

import {
    toggleDiffMode,
} from './actions';
import {
    map,
} from './constants';

class ViewBar extends Component {
    constructor(props) {
        super(props);
        this.openGist = this.openGist.bind(this);
        this.openSite = this.openSite.bind(this);
        this.openDiffMode = this.openDiffMode.bind(this);
    }

    openGist() {
        window.open(`https://gist.github.com/${this.props.viewGistID}`, '_blank');
    }

    openSite() {
        window.open(`https://tilejson.io/g/${this.props.viewGistID}`, '_blank');
    }

    openDiffMode() {
        this.props.dispatch(toggleDiffMode({
            diffMode: true,
        }));
        setTimeout(() => {
            map.updateSize();
        }, 100);
    }

    render() {
        const styleTitle = {
            color: '#fff',
            cursor: 'pointer',
        };
        const styleWhiteText = {
            color: '#fff',
        };
        const styleBlueBackground = {
            backgroundColor: '#00bcd6',
        };
        const toolbarSeparator = (
            <ToolbarSeparator style={{ paddingTop: 24 }} />
        );
        let leftToolbarGroup = null;
        let rightToolbarGroup = null;
        if (this.props.shareTileJSONLink) {
            leftToolbarGroup = (
                <ToolbarGroup>
                    <ToolbarTitle
                        text="TileJSON.io"
                        style={styleTitle}
                        onClick={this.openSite}
                    />
                </ToolbarGroup>
            );
        }
        if (this.props.shareGist || this.props.shareDiff) {
            const gistButton = (
                <FlatButton
                    label="Gist"
                    style={styleWhiteText}
                    onClick={this.openGist}
                />
            );
            const diffButton = (
                <FlatButton
                    label="Diff"
                    style={styleWhiteText}
                    onClick={this.openDiffMode}
                    disabled={this.props.layers.length < 2}
                />
            );
            rightToolbarGroup = (
                <ToolbarGroup firstChild={!leftToolbarGroup} lastChild>
                    {this.props.shareGist ? gistButton : null}
                    {this.props.shareDiff ? diffButton : null}
                </ToolbarGroup>
            );
        }
        return (
            <Col xs={12} id="floatingheader">
                <Toolbar style={styleBlueBackground}>
                    {leftToolbarGroup}
                    {leftToolbarGroup && rightToolbarGroup ? toolbarSeparator : null}
                    {rightToolbarGroup}
                </Toolbar>
            </Col>
        );
    }
}

ViewBar.propTypes = {
    dispatch: func.isRequired,
    layers: arrayOf(object).isRequired,
    viewGistID: string.isRequired,
    shareTileJSONLink: bool.isRequired,
    shareGist: bool.isRequired,
    shareDiff: bool.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(ViewBar);
