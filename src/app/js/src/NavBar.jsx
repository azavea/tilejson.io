import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

import { Col } from 'react-flexbox-grid';

import {
    toggleCollapse,
} from './actions';
import {
    map,
} from './constants';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.expand = this.expand.bind(this);
    }

    expand() {
        this.props.dispatch(toggleCollapse({
            isCollapsed: false,
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
        return (
            <Col xs={12} id="header">
                <Toolbar style={styleBlueBackground}>
                    <ToolbarGroup firstChild>
                        <IconButton onClick={this.expand}><ExpandMore color="white" /></IconButton>
                        <ToolbarTitle text="TileJSON.io" style={styleWhiteText} />
                    </ToolbarGroup>
                    <ToolbarGroup lastChild>
                        <FlatButton onClick={this.props.openAddLayerDialog} label="Add Layer" style={styleWhiteText} />
                        <FlatButton onClick={this.props.share} label="Share" style={styleWhiteText} />
                        <FlatButton onClick={this.props.clearLayers} label="Clear" style={styleWhiteText} />
                    </ToolbarGroup>
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
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(NavBar);
