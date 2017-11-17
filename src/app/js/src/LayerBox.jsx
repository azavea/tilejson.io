import React, { Component } from 'react';
import { bool, func, number, shape, string } from 'prop-types';
import { connect } from 'react-redux';

import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';
import ActionOpacityIcon from 'material-ui/svg-icons/action/opacity';
import EditorModeEditIcon from 'material-ui/svg-icons/editor/mode-edit';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import Slider from 'material-ui/Slider';

import ReactJson from 'react-json-view';

import { Grid, Row, Col } from 'react-flexbox-grid';

import {
    toggleLayerBoxInfo,
    toggleEditLayerDialog,
    changeLayerOpacity,
} from './actions';

class LayerBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacityControl: false,
            opacity: this.props.opacity,
        };
        this.collapseDetails = this.collapseDetails.bind(this);
        this.expandDetails = this.expandDetails.bind(this);
        this.removeLayer = this.removeLayer.bind(this);
        this.openEditLayerDialog = this.openEditLayerDialog.bind(this);
        this.handleOpacityOpen = this.handleOpacityOpen.bind(this);
        this.handleOpacityClose = this.handleOpacityClose.bind(this);
        this.changeOpacity = this.changeOpacity.bind(this);
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

    removeLayer() {
        this.props.removeLayer(this.props.i);
    }

    openEditLayerDialog() {
        this.props.dispatch(toggleEditLayerDialog({
            showEditLayerDialog: true,
            i: this.props.i,
        }));
    }

    changeOpacity(event, value) {
        this.props.dispatch(changeLayerOpacity({
            opacity: value,
            i: this.props.i,
        }));
        this.setState({
            opacity: value,
        });
        this.props.changeOpacity(this.props.i, value);
    }

    handleOpacityOpen() {
        this.setState({
            opacityControl: true,
        });
    }

    handleOpacityClose() {
        this.setState({
            opacityControl: false,
        });
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
        let source;
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
        let sliderOrControls = (
            <div>
                <IconButton
                    iconStyle={smallIcon}
                    onClick={this.openEditLayerDialog}
                    touch
                >
                    <EditorModeEditIcon />
                </IconButton>
                <IconButton
                    iconStyle={smallIcon}
                    onClick={this.removeLayer}
                    touch
                >
                    <ActionDeleteIcon />
                </IconButton>
                {expandOrCollapseButton}
            </div>
        );
        if (this.state.opacityControl) {
            sliderOrControls = (
                <Slider
                    value={this.state.opacity}
                    onChange={this.changeOpacity}
                    sliderStyle={{ width: 144, marginTop: 0, marginBottom: 0 }}
                />
            );
        }
        return (
            <Paper zDepth={1} style={{ overflow: 'hidden' }}>
                <Toolbar>
                    <ToolbarGroup>
                        <ToolbarTitle style={fontSize11} text={this.props.layerName} />
                    </ToolbarGroup>
                    <ToolbarGroup lastChild>
                        <IconButton
                            iconStyle={smallIcon}
                            onClick={this.state.opacityControl ?
                                this.handleOpacityClose : this.handleOpacityOpen}
                            touch
                        >
                            <ActionOpacityIcon />
                        </IconButton>
                        {sliderOrControls}
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
    layerTileJSON: shape({}).isRequired,
    removeLayer: func.isRequired,
    opacity: number.isRequired,
    changeOpacity: func.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(LayerBox);
