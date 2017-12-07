import React, { Component } from 'react';
import { arrayOf, func, object, string } from 'prop-types';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { Card, CardTitle, CardText } from 'material-ui/Card';

import { Row, Col } from 'react-flexbox-grid';

import {
    changeLayerUrl,
} from './actions';

import {
    exampleURL,
} from './constants';

class QuickAddLayerBox extends Component {
    constructor(props) {
        super(props);
        this.changeUrl = this.changeUrl.bind(this);
        this.quickAddOnKeyDown = this.quickAddOnKeyDown.bind(this);
    }

    componentDidMount() {
        this.nameInput.focus();
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
        let paperZDepth = 1;
        let cardTitle = null;
        let cardText = null;
        if (this.props.layers.length === 0) {
            paperZDepth = 3;
            cardTitle = <CardTitle title="Welcome to TileJSON.io" />;
            cardText = (
                <div>
                    Add your first layer to the map by entering a Tile URL below.
                    Here is what a Tile URL looks like: <span className="code">{exampleURL}</span>.
                    <br /><br />
                </div>
            );
        }
        return (
            <Card zDepth={paperZDepth}>
                {cardTitle}
                <CardText>
                    {cardText}
                    <TextField
                        hintText="Tile URL"
                        value={this.props.url}
                        onChange={this.changeUrl}
                        onKeyDown={this.quickAddOnKeyDown}
                        ref={(input) => { this.nameInput = input; }}
                        fullWidth
                    />
                    <br />
                    <Row>
                        <Col xsOffset={4} xs={4}>
                            <FlatButton
                                label="Add"
                                onClick={this.props.addLayer}
                                primary
                                fullWidth
                            />
                        </Col>
                        <Col xs={4}>
                            <FlatButton
                                onClick={this.props.openAddLayerDialog}
                                label="More"
                                primary
                                fullWidth
                            />
                        </Col>
                    </Row>
                </CardText>
            </Card>
        );
    }
}

QuickAddLayerBox.propTypes = {
    dispatch: func.isRequired,
    openAddLayerDialog: func.isRequired,
    addLayer: func.isRequired,
    url: string.isRequired,
    layers: arrayOf(object).isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(QuickAddLayerBox);
