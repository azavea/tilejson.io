import React, { Component } from 'react';
import { arrayOf, object } from 'prop-types';
import { connect } from 'react-redux';

import LayerBox from './LayerBox';

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
                />
                <br />
            </div>,
        );
        return (
            <div>
                {layerBoxes}
            </div>
        );
    }
}

LayerBoxes.propTypes = {
    layers: arrayOf(object).isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(LayerBoxes);
