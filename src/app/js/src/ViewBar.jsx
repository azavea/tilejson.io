import React, { Component } from 'react';
import { arrayOf, func, object, string } from 'prop-types';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';
import { Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator } from 'material-ui/Toolbar';

import { Col } from 'react-flexbox-grid';

import {
    toggleDiffMode,
} from './actions';
import {
    map,
} from './constants';

class ViewBar extends Component {
    constructor(props) {
        super(props);
        this.openGist = this.openGist.bind(this);
        this.openDiffMode = this.openDiffMode.bind(this);
    }

    openGist() {
        window.open(`https://gist.github.com/${this.props.viewGistID}`, '_blank');
    }

    openDiffMode() {
        this.props.dispatch(toggleDiffMode({
            diffMode: true,
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
            <Col xs={12} id="floatingheader">
                <Toolbar style={styleBlueBackground}>
                    <ToolbarGroup>
                        <ToolbarTitle
                            text="TileJSON.io"
                            style={styleWhiteText}
                        />
                    </ToolbarGroup>
                    <ToolbarSeparator style={{ paddingTop: 24 }} />
                    <ToolbarGroup lastChild>
                        <FlatButton
                            label="Gist"
                            style={styleWhiteText}
                            onClick={this.openGist}
                        />
                        <FlatButton
                            label="Diff"
                            style={styleWhiteText}
                            onClick={this.openDiffMode}
                            disabled={this.props.layers.length < 2}
                        />
                    </ToolbarGroup>
                </Toolbar>
            </Col>
        );
    }
}

ViewBar.propTypes = {
    dispatch: func.isRequired,
    layers: arrayOf(object).isRequired,
    viewGistID: string.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(ViewBar);
