import React, { Component } from 'react';
import { func, string } from 'prop-types';
import { connect } from 'react-redux';

import IconButton from 'material-ui/IconButton';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import {
    changeLayerUrl,
} from './actions';

class QuickAddLayerBox extends Component {
    constructor(props) {
        super(props);
        this.changeUrl = this.changeUrl.bind(this);
        this.quickAddOnKeyDown = this.quickAddOnKeyDown.bind(this);
    }

    changeUrl(e) {
        this.props.dispatch(changeLayerUrl({
            url: e.target.value,
        }));
    }

    quickAddOnKeyDown(e) {
        if (e.keyCode === 13) {
            this.props.addLayer();
        }
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
        return (
            <Paper zDepth={1} style={{ overflow: 'hidden' }}>
                <Toolbar>
                    <ToolbarGroup>
                        <ToolbarTitle style={fontSize11} text="Quick Add" />
                        <TextField
                            style={fontSize11}
                            hintText="Tile URL"
                            onChange={this.changeUrl}
                            value={this.props.url}
                            onKeyDown={this.quickAddOnKeyDown}
                        />
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <IconButton iconStyle={smallIcon} onClick={this.props.addLayer} touch>
                            <ContentAddIcon />
                        </IconButton>
                    </ToolbarGroup>
                </Toolbar>
            </Paper>
        );
    }
}

QuickAddLayerBox.propTypes = {
    dispatch: func.isRequired,
    addLayer: func.isRequired,
    url: string.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(QuickAddLayerBox);
