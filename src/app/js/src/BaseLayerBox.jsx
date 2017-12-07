import React, { Component } from 'react';
import { bool, func, number } from 'prop-types';
import { connect } from 'react-redux';

import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import {
    toggleBaseLayerVisibility,
} from './actions';

import {
    baseLayers,
} from './constants';

class BaseLayerBox extends Component {
    constructor(props) {
        super(props);
        this.changeBaseLayer = this.changeBaseLayer.bind(this);
        this.toggleVisibilityOn = this.toggleVisibilityOn.bind(this);
        this.toggleVisibilityOff = this.toggleVisibilityOff.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
    }

    changeBaseLayer(event, value) {
        if (value === baseLayers.length) {
            this.toggleVisibilityOff();
        } else {
            this.toggleVisibilityOn();
            this.props.changeBaseLayer(value);
        }
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
        const baseLayerDropdown = baseLayers.map((layer, i) => (
            <MenuItem key={i} value={i} primaryText={layer.name} />
        ));
        baseLayerDropdown.push(
            <MenuItem key={baseLayers.length} value={baseLayers.length} primaryText={'None'} />,
        );
        return (
            <Paper zDepth={1} style={{ overflow: 'hidden' }}>
                <Toolbar style={{ backgroundColor: 'white' }}>
                    <ToolbarGroup>
                        <ToolbarTitle style={fontSize11} text="Base Layer" />
                    </ToolbarGroup>
                    <ToolbarGroup lastChild>
                        <DropDownMenu
                            value={this.props.baseLayerVisible ?
                                this.props.currentBaseLayer : baseLayers.length}
                            onChange={this.changeBaseLayer}
                        >
                            {baseLayerDropdown}
                        </DropDownMenu>
                    </ToolbarGroup>
                </Toolbar>
            </Paper>
        );
    }
}

BaseLayerBox.propTypes = {
    dispatch: func.isRequired,
    currentBaseLayer: number.isRequired,
    changeBaseLayer: func.isRequired,
    toggleVisibility: func.isRequired,
    baseLayerVisible: bool.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(BaseLayerBox);
