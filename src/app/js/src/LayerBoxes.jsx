import React, { Component } from 'react';
import { arrayOf, func, object } from 'prop-types';
import { connect } from 'react-redux';

import LayerBox from './LayerBox';
import BaseLayerBox from './BaseLayerBox';

class LayerBoxes extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const layerBoxes = this.props.layers.map((layer, i) =>
            <div key={i.toString()}>
                <LayerBox
                    i={i}
                    layerName={layer.name}
                    layerUrl={layer.url}
                    viewDetail={layer.detailView}
                    viewSource={layer.sourceView}
                    layerTileJSON={layer.tileJSON}
                    removeLayer={this.props.removeLayer}
                    opacity={layer.opacity}
                    changeOpacity={this.props.changeOpacity}
                    visible={layer.visible}
                    toggleVisibility={this.props.toggleVisibility}
                />
                <br />
            </div>,
        );
        return (
            <div>
                <BaseLayerBox
                    changeBaseLayer={this.props.changeBaseLayer}
                    toggleVisibility={this.props.toggleVisibility}
                />
                <br />
                {layerBoxes}
            </div>
        );
    }
}

LayerBoxes.propTypes = {
    removeLayer: func.isRequired,
    layers: arrayOf(object).isRequired,
    changeBaseLayer: func.isRequired,
    changeOpacity: func.isRequired,
    toggleVisibility: func.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(LayerBoxes);
