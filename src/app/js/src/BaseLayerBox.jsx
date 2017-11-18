import React, { Component } from 'react';
import { bool, func, number } from 'prop-types';
import { connect } from 'react-redux';

import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';
import ActionVisibilityIcon from 'material-ui/svg-icons/action/visibility';
import ActionVisibilityOffIcon from 'material-ui/svg-icons/action/visibility-off';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

import { Grid, Row } from 'react-flexbox-grid';

import {
    toggleBaseLayerDetails,
    toggleBaseLayerVisibility,
} from './actions';

import {
    baseLayers,
} from './constants';

class BaseLayerBox extends Component {
    constructor(props) {
        super(props);
        this.expandDetails = this.expandDetails.bind(this);
        this.collapseDetails = this.collapseDetails.bind(this);
        this.changeBaseLayer = this.changeBaseLayer.bind(this);
        this.toggleVisibilityOn = this.toggleVisibilityOn.bind(this);
        this.toggleVisibilityOff = this.toggleVisibilityOff.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
    }

    changeBaseLayer(event, value) {
        this.props.changeBaseLayer(value);
    }

    expandDetails() {
        this.props.dispatch(toggleBaseLayerDetails({
            baseLayerDetails: true,
        }));
    }

    collapseDetails() {
        this.props.dispatch(toggleBaseLayerDetails({
            baseLayerDetails: false,
        }));
    }

    toggleVisibility(value) {
        this.props.dispatch(toggleBaseLayerVisibility({
            visible: value,
        }));
        this.props.toggleVisibility(-1, value);
    }

    toggleVisibilityOn() {
        this.toggleVisibility(true);
    }

    toggleVisibilityOff() {
        this.toggleVisibility(false);
    }

    render() {
        const fontSize11 = {
            fontSize: '11pt',
        };
        const fontSize9 = {
            fontSize: '9pt',
        };
        const smallIcon = {
            width: 18,
            height: 18,
            color: '#8b8b8b',
        };
        let expandOrCollapseButton = (
            <IconButton
                iconStyle={smallIcon}
                onClick={this.expandDetails}
                touch
            >
                <NavigationExpandMoreIcon />
            </IconButton>
        );
        let baseLayerPicker;
        if (this.props.baseLayerDetails) {
            expandOrCollapseButton = (
                <IconButton
                    iconStyle={smallIcon}
                    onClick={this.collapseDetails}
                    touch
                >
                    <NavigationExpandLessIcon />
                </IconButton>
            );
            const radioButtons = baseLayers.map((layer, i) => (
                <RadioButton
                    key={i}
                    value={i}
                    label={layer.name}
                />
            ));
            baseLayerPicker = (
                <Grid style={fontSize9} fluid>
                    <br />
                    <Row>
                        <RadioButtonGroup
                            name="baseLayerSelection"
                            defaultSelected={this.props.currentBaseLayer}
                            onChange={this.changeBaseLayer}
                        >
                            {radioButtons}
                        </RadioButtonGroup>
                    </Row>
                    <br />
                </Grid>
            );
        }
        return (
            <Paper zDepth={1} style={{ overflow: 'hidden' }}>
                <Toolbar>
                    <ToolbarGroup firstChild>
                        <IconButton
                            iconStyle={smallIcon}
                            onClick={this.props.baseLayerVisible ?
                                this.toggleVisibilityOff : this.toggleVisibilityOn}
                            touch
                        >
                            {this.props.baseLayerVisible ?
                                <ActionVisibilityIcon /> : <ActionVisibilityOffIcon />}
                        </IconButton>
                        <ToolbarTitle style={fontSize11} text="Base Layer" />
                    </ToolbarGroup>
                    <ToolbarGroup lastChild>
                        {expandOrCollapseButton}
                    </ToolbarGroup>
                </Toolbar>
                {baseLayerPicker}
            </Paper>
        );
    }
}

BaseLayerBox.propTypes = {
    dispatch: func.isRequired,
    baseLayerDetails: bool.isRequired,
    currentBaseLayer: number.isRequired,
    changeBaseLayer: func.isRequired,
    toggleVisibility: func.isRequired,
    baseLayerVisible: bool.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(BaseLayerBox);
