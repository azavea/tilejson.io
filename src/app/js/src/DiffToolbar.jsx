import React, { Component } from 'react';
import { arrayOf, func, number, object } from 'prop-types';
import { connect } from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Slider from 'material-ui/Slider';
import { Col } from 'react-flexbox-grid';
import TileLayer from 'ol/layer/tile';
import XYZ from 'ol/source/xyz';
import Map from 'ol/map';

import {
    map,
    diffMuiTheme,
} from './constants';
import {
    changeDiffLeftLayerId,
    changeDiffRightLayerId,
} from './actions';

class DiffToolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            swipeValue: 0.5,
        };
        this.leftLayerChange = this.leftLayerChange.bind(this);
        this.rightLayerChange = this.rightLayerChange.bind(this);
        this.changeSwipeValue = this.changeSwipeValue.bind(this);
    }

    componentDidMount() {
        const layers = map.getLayers().getArray();
        const view = map.getView();
        this.diffMap = new Map({
            layers: [
                layers[0],
                new TileLayer({
                    source: new XYZ({
                        url: this.props.layers[this.props.diffLayerLeftId].url,
                    }),
                }),
                new TileLayer({
                    source: new XYZ({
                        url: this.props.layers[this.props.diffLayerRightId].url,
                    }),
                }),
            ],
            view,
        });

        const diffMapLayers = this.diffMap.getLayers().getArray();

        diffMapLayers[1].on('precompose', (event) => {
            const ctx = event.context;
            const width = ctx.canvas.width * this.state.swipeValue;

            ctx.save();
            ctx.beginPath();
            ctx.rect(0, 0, width, ctx.canvas.height);
            ctx.clip();
        });
        diffMapLayers[1].on('postcompose', (event) => {
            const ctx = event.context;
            ctx.restore();
        });

        diffMapLayers[2].on('precompose', (event) => {
            const ctx = event.context;
            const width = ctx.canvas.width * this.state.swipeValue;

            ctx.save();
            ctx.beginPath();
            ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height);
            ctx.clip();
        });
        diffMapLayers[2].on('postcompose', (event) => {
            const ctx = event.context;
            const width = ctx.canvas.width * this.state.swipeValue;

            ctx.restore();

            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.fillRect(width - 6, 0, 12, ctx.canvas.height);

            ctx.strokeStyle = '#7d7d7d';

            ctx.beginPath();
            ctx.moveTo(width - 6, 0);
            ctx.lineTo(width - 6, ctx.canvas.height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(width + 6, 0);
            ctx.lineTo(width + 6, ctx.canvas.height);
            ctx.stroke();

            ctx.restore();
        });

        this.diffMap.setTarget('diffMap');
    }

    componentWillUnmount() {
        this.diffMap.setTarget(null);
    }

    leftLayerChange(event, index, value) {
        const diffMapLayers = this.diffMap.getLayers().getArray();
        diffMapLayers[1].setSource(new XYZ({
            url: this.props.layers[value].url,
        }));
        this.props.dispatch(changeDiffLeftLayerId({
            id: value,
        }));
    }

    rightLayerChange(event, index, value) {
        const diffMapLayers = this.diffMap.getLayers().getArray();
        diffMapLayers[2].setSource(new XYZ({
            url: this.props.layers[value].url,
        }));
        this.props.dispatch(changeDiffRightLayerId({
            id: value,
        }));
    }

    changeSwipeValue(event, value) {
        this.setState({
            swipeValue: value,
        }, this.diffMap.render());
    }

    render() {
        const leftDropdown = this.props.layers.map((layer, i) => {
            if (i === this.props.diffLayerRightId) {
                return null;
            }
            return (<MenuItem key={i} value={i} primaryText={layer.name} />);
        });
        const rightDropdown = this.props.layers.map((layer, i) => {
            if (i === this.props.diffLayerLeftId) {
                return null;
            }
            return (<MenuItem key={i} value={i} primaryText={layer.name} />);
        });
        return (
            <MuiThemeProvider muiTheme={diffMuiTheme}>
                <Col xs={12} id="diffToolbar" style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <Toolbar>
                        <ToolbarGroup>
                            <ToolbarTitle text="Left Layer" />
                            <DropDownMenu
                                value={this.props.diffLayerLeftId}
                                onChange={this.leftLayerChange}
                            >
                                {leftDropdown}
                            </DropDownMenu>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <DropDownMenu
                                value={this.props.diffLayerRightId}
                                onChange={this.rightLayerChange}
                            >
                                {rightDropdown}
                            </DropDownMenu>
                            <ToolbarTitle text="Right Layer" />
                        </ToolbarGroup>
                    </Toolbar>
                    <div id="diffMap" className="diffMap" />
                    <div id="overDiffMap" className="overDiffMap">
                        <Slider className="slider" value={this.state.swipeValue} onChange={this.changeSwipeValue} sliderStyle={{ marginBottom: 0, marginTop: 0 }} />
                    </div>
                </Col>
            </MuiThemeProvider>
        );
    }
}

DiffToolbar.propTypes = {
    dispatch: func.isRequired,
    layers: arrayOf(object).isRequired,
    diffLayerLeftId: number.isRequired,
    diffLayerRightId: number.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(DiffToolbar);
