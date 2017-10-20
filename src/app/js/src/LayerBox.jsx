import React, { Component } from 'react';
import { bool, func, number, string } from 'prop-types';
import { connect } from 'react-redux';

import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';
import ActionCodeIcon from 'material-ui/svg-icons/action/code';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';
import EditorModeEditIcon from 'material-ui/svg-icons/editor/mode-edit';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';

import { Grid, Row, Col } from 'react-flexbox-grid';

import {
    toggleLayerBoxDetails,
} from './actions';

class LayerBox extends Component {
    constructor(props) {
        super(props);
        this.collapseDetails = this.collapseDetails.bind(this);
        this.expandDetails = this.expandDetails.bind(this);
    }

    collapseDetails() {
        this.props.dispatch(toggleLayerBoxDetails({
            i: this.props.i,
            detailView: false,
        }));
    }

    expandDetails() {
        this.props.dispatch(toggleLayerBoxDetails({
            i: this.props.i,
            detailView: true,
        }));
    }

    render() {
        const smallIcon = {
            width: 18,
            height: 18,
            color: '#8b8b8b',
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
                <Grid fluid>
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
        return (
            <Paper zDepth={1}>
                <Toolbar>
                    <ToolbarGroup>
                        <ToolbarTitle style={{ fontSize: '11pt' }} text={this.props.layerName} />
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <IconButton iconStyle={smallIcon} touch disabled>
                            <ActionCodeIcon />
                        </IconButton>
                        <IconButton iconStyle={smallIcon} touch disabled>
                            <EditorModeEditIcon />
                        </IconButton>
                        <IconButton iconStyle={smallIcon} touch disabled>
                            <ActionDeleteIcon />
                        </IconButton>
                        {expandOrCollapseButton}
                    </ToolbarGroup>
                </Toolbar>
                {details}
            </Paper>
        );
    }
}

LayerBox.propTypes = {
    dispatch: func.isRequired,
    layerName: string.isRequired,
    layerUrl: string.isRequired,
    i: number.isRequired,
    // layers: arrayOf(shape({
    //     name: string.isRequired,
    //     url: string.isRequired,
    //     detailView: bool.isRequired,
    // })).isRequired,
    viewDetail: bool.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(LayerBox);
