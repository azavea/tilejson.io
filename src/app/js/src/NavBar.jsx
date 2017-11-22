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
    toggleShareDescriptionDialogOpen,
} from './actions';
import {
    map,
} from './constants';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.expand = this.expand.bind(this);
        this.closeDiffMode = this.closeDiffMode.bind(this);
        this.shareDiff = this.shareDiff.bind(this);
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

    shareDiff() {
        this.props.dispatch(toggleShareDescriptionDialogOpen({
            shareDescriptionDialogOpen: true,
        }));
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
        let toolbarGroupRight = null;
        if (this.props.diffMode) {
            toolbarGroupIconButton = (
                <IconButton onClick={this.closeDiffMode}><NavigationCloseIcon color="white" /></IconButton>
            );
            toolbarGroupRight = (
                <ToolbarGroup lastChild>
                    <FlatButton onClick={this.shareDiff} label="Share" style={styleWhiteText} />
                </ToolbarGroup>
            );
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
    diffMode: bool.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(NavBar);
