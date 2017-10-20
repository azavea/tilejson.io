import React, { Component } from 'react';
import { bool, func, number, shape, string } from 'prop-types';
import { connect } from 'react-redux';

import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';
import ActionCodeIcon from 'material-ui/svg-icons/action/code';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';
import EditorModeEditIcon from 'material-ui/svg-icons/editor/mode-edit';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';

import ReactJson from 'react-json-view';

import { Grid, Row, Col } from 'react-flexbox-grid';

import {
    toggleLayerBoxInfo,
} from './actions';

class LayerBox extends Component {
    constructor(props) {
        super(props);
        this.collapseDetails = this.collapseDetails.bind(this);
        this.expandDetails = this.expandDetails.bind(this);
        this.collapseSource = this.collapseSource.bind(this);
        this.expandSource = this.expandSource.bind(this);
    }

    collapseDetails() {
        this.props.dispatch(toggleLayerBoxInfo({
            i: this.props.i,
            detailView: false,
        }));
    }

    expandDetails() {
        this.props.dispatch(toggleLayerBoxInfo({
            i: this.props.i,
            detailView: true,
        }));
    }

    collapseSource() {
        this.props.dispatch(toggleLayerBoxInfo({
            i: this.props.i,
            sourceView: false,
        }));
    }

    expandSource() {
        this.props.dispatch(toggleLayerBoxInfo({
            i: this.props.i,
            sourceView: true,
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
        const fontSize9 = {
            fontSize: '9pt',
        };
        const sourceStyle = {
            fontSize: '9pt',
            backgroundColor: '#f7f7f7',
        };
        let details;
        let expandOrCollapseButton = (
            <IconButton
                iconStyle={smallIcon}
                onClick={this.expandDetails}
                touch
            >
                <NavigationExpandMoreIcon />
            </IconButton>
        );
        if (this.props.viewDetail) {
            details = (
                <Grid style={fontSize9} fluid>
                    <br />
                    <Row>
                        <Col xs={3}>
                            Name
                        </Col>
                        <Col xs={9}>
                            <div className="detailValue">
                                {this.props.layerName}
                            </div>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={3}>
                            URL
                        </Col>
                        <Col xs={9}>
                            <div className="detailValue">
                                {this.props.layerUrl}
                            </div>
                        </Col>
                    </Row>
                    <br />
                </Grid>
            );
            expandOrCollapseButton = (
                <IconButton
                    iconStyle={smallIcon}
                    onClick={this.collapseDetails}
                    touch
                >
                    <NavigationExpandLessIcon />
                </IconButton>
            );
        }
        let source;
        if (this.props.viewSource) {
            source = (
                <Grid style={sourceStyle} className="detailValue" fluid>
                    <br />
                    <ReactJson
                        name={false}
                        src={this.props.layerTileJSON}
                        displayObjectSize={false}
                        indentWidth={2}
                    />
                    <br />
                </Grid>
            );
        }
        return (
            <Paper zDepth={1} style={{ overflow: 'hidden' }}>
                <Toolbar>
                    <ToolbarGroup>
                        <ToolbarTitle style={fontSize11} text={this.props.layerName} />
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <IconButton iconStyle={smallIcon} touch disabled>
                            <EditorModeEditIcon />
                        </IconButton>
                        <IconButton iconStyle={smallIcon} touch disabled>
                            <ActionDeleteIcon />
                        </IconButton>
                        <IconButton
                            onClick={this.props.viewSource ?
                                this.collapseSource : this.expandSource}
                            iconStyle={smallIcon}
                            touch
                        >
                            <ActionCodeIcon />
                        </IconButton>
                        {expandOrCollapseButton}
                    </ToolbarGroup>
                </Toolbar>
                {details}
                {source}
            </Paper>
        );
    }
}

LayerBox.propTypes = {
    dispatch: func.isRequired,
    layerName: string.isRequired,
    layerUrl: string.isRequired,
    i: number.isRequired,
    viewDetail: bool.isRequired,
    viewSource: bool.isRequired,
    layerTileJSON: shape({}).isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(LayerBox);
