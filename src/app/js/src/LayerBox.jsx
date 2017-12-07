import React, { Component } from 'react';
import { bool, func, number, shape, string } from 'prop-types';
import { connect } from 'react-redux';

import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';
import ActionOpacityIcon from 'material-ui/svg-icons/action/opacity';
import ActionVisibilityIcon from 'material-ui/svg-icons/action/visibility';
import ActionVisibilityOffIcon from 'material-ui/svg-icons/action/visibility-off';
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
    toggleLayerVisibility,
} from './actions';

class LayerBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacityControl: false,
            opacity: this.props.opacity,
            visible: this.props.visible,
        };
        this.collapseDetails = this.collapseDetails.bind(this);
        this.expandDetails = this.expandDetails.bind(this);
        this.removeLayer = this.removeLayer.bind(this);
        this.openEditLayerDialog = this.openEditLayerDialog.bind(this);
        this.handleOpacityOpen = this.handleOpacityOpen.bind(this);
        this.handleOpacityClose = this.handleOpacityClose.bind(this);
        this.changeOpacity = this.changeOpacity.bind(this);
        this.toggleVisibilityOn = this.toggleVisibilityOn.bind(this);
        this.toggleVisibilityOff = this.toggleVisibilityOff.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
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

    toggleVisibility(value) {
        this.props.dispatch(toggleLayerVisibility({
            visible: value,
            i: this.props.i,
        }));
        this.setState({
            visible: value,
        });
        this.props.toggleVisibility(this.props.i, value);
    }

    toggleVisibilityOn() {
        this.toggleVisibility(true);
    }

    toggleVisibilityOff() {
        this.toggleVisibility(false);
    }

    render() {
        const smallIcon = {
            width: 18,
            height: 18,
            color: '#8b8b8b',
        };
        const iconButtonStyle = {
            paddingLeft: 0,
            paddingRight: 0,
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
                style={iconButtonStyle}
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
                    style={iconButtonStyle}
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
        const lastToolbarGroupStyle = {
            marginTop: 4,
        };
        let sliderOrControls = (
            <ToolbarGroup style={lastToolbarGroupStyle} lastChild>
                <IconButton
                    style={iconButtonStyle}
                    iconStyle={smallIcon}
                    onClick={this.handleOpacityOpen}
                    touch
                >
                    <ActionOpacityIcon />
                </IconButton>
                <IconButton
                    style={iconButtonStyle}
                    iconStyle={smallIcon}
                    onClick={this.openEditLayerDialog}
                    touch
                >
                    <EditorModeEditIcon />
                </IconButton>
                <IconButton
                    style={iconButtonStyle}
                    iconStyle={smallIcon}
                    onClick={this.removeLayer}
                    touch
                >
                    <ActionDeleteIcon />
                </IconButton>
                {expandOrCollapseButton}
            </ToolbarGroup>
        );
        if (this.state.opacityControl) {
            const sliderStyle = {
                width: 108,
                marginTop: 0,
                marginBottom: 0,
                marginRight: 24,
            };
            sliderOrControls = (
                <ToolbarGroup style={lastToolbarGroupStyle} lastChild>
                    <IconButton
                        style={iconButtonStyle}
                        iconStyle={smallIcon}
                        onClick={this.handleOpacityClose}
                        touch
                    >
                        <ActionOpacityIcon />
                    </IconButton>
                    <Slider
                        value={this.state.opacity}
                        onChange={this.changeOpacity}
                        sliderStyle={sliderStyle}
                    />
                </ToolbarGroup>
            );
        }
        return (
            <Paper zDepth={1} style={{ overflow: 'hidden' }}>
                <Toolbar>
                    <Grid>
                        <Row>
                            <Col xs={1}>
                                <ToolbarGroup style={lastToolbarGroupStyle} firstChild>
                                    <IconButton
                                        style={iconButtonStyle}
                                        iconStyle={smallIcon}
                                        onClick={this.state.visible ?
                                            this.toggleVisibilityOff : this.toggleVisibilityOn}
                                        touch
                                    >
                                        {this.state.visible ?
                                            <ActionVisibilityIcon /> : <ActionVisibilityOffIcon />}
                                    </IconButton>
                                </ToolbarGroup>
                            </Col>
                            <Col xs={5}>
                                <ToolbarGroup>
                                    <ToolbarTitle style={fontSize11} text={this.props.layerName} />
                                </ToolbarGroup>
                            </Col>
                            <Col xs={6}>
                                {sliderOrControls}
                            </Col>
                        </Row>
                    </Grid>
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
    visible: bool.isRequired,
    toggleVisibility: func.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(LayerBox);
