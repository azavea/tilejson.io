import React, { Component } from 'react';
import { arrayOf, func, object } from 'prop-types';
import { connect } from 'react-redux';

import LayerBox from './LayerBox';
import QuickAddLayerBox from './QuickAddLayerBox';
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
                />
                <br />
            </div>,
        );
        return (
            <div>
                <QuickAddLayerBox
                    addLayer={this.props.addLayer}
                />
                <br />
                <BaseLayerBox
                    changeBaseLayer={this.props.changeBaseLayer}
                />
                <br />
                {layerBoxes}
            </div>
        );
    }
}

LayerBoxes.propTypes = {
    addLayer: func.isRequired,
    removeLayer: func.isRequired,
    layers: arrayOf(object).isRequired,
    changeBaseLayer: func.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(LayerBoxes);
