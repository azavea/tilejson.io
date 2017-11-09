import React, { Component } from 'react';
import { bool, func } from 'prop-types';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import NavigationCloseIcon from 'material-ui/svg-icons/navigation/close';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

import { Col } from 'react-flexbox-grid';

import {
    toggleCollapse,
    toggleDiffMode,
} from './actions';
import {
    map,
} from './constants';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.expand = this.expand.bind(this);
        this.closeDiffMode = this.closeDiffMode.bind(this);
    }

    expand() {
        this.props.dispatch(toggleCollapse({
            isCollapsed: false,
        }));
        setTimeout(() => {
            map.updateSize();
        }, 100);
    }

    closeDiffMode() {
        this.props.dispatch(toggleDiffMode({
            diffMode: false,
        }));
        setTimeout(() => {
            map.updateSize();
        }, 100);
    }

    render() {
        const styleWhiteText = {
            color: '#fff',
        };
        const styleBlueBackground = {
            backgroundColor: '#00bcd6',
        };
        let toolbarGroupIconButton = (
            <IconButton onClick={this.expand}><NavigationExpandMoreIcon color="white" /></IconButton>
        );
        let toolbarGroupRight = (
            <ToolbarGroup lastChild>
                <FlatButton onClick={this.props.openAddLayerDialog} label="Add Layer" style={styleWhiteText} />
                <FlatButton onClick={this.props.share} label="Share" style={styleWhiteText} />
                <FlatButton onClick={this.props.clearLayers} label="Clear" style={styleWhiteText} />
            </ToolbarGroup>
        );
        if (this.props.diffMode) {
            toolbarGroupIconButton = (
                <IconButton onClick={this.closeDiffMode}><NavigationCloseIcon color="white" /></IconButton>
            );
            toolbarGroupRight = null;
        }
        return (
            <Col xs={12} id="header">
                <Toolbar style={styleBlueBackground}>
                    <ToolbarGroup firstChild>
                        {toolbarGroupIconButton}
                        <ToolbarTitle text="TileJSON.io" style={styleWhiteText} />
                    </ToolbarGroup>
                    {toolbarGroupRight}
                </Toolbar>
            </Col>
        );
    }
}

NavBar.propTypes = {
    dispatch: func.isRequired,
    openAddLayerDialog: func.isRequired,
    share: func.isRequired,
    clearLayers: func.isRequired,
    diffMode: bool.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(NavBar);
