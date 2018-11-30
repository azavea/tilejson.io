import React, { Component } from 'react';
import { string } from 'prop-types';
import { connect } from 'react-redux';

import { Card, CardHeader, CardText } from 'material-ui/Card';

class MapInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
        };
        this.toggleInfo = this.toggleInfo.bind(this);
    }

    toggleInfo() {
        this.setState({
            open: !this.state.open,
        });
    }

    render() {
        const showDescription = this.props.shareDescription !== '';
        let cardText = null;
        if (showDescription) {
            cardText = (
                <CardText expandable>
                    {this.props.shareDescription}
                </CardText>
            );
        }
        return (
            <Card id="mapInfo">
                <CardHeader
                    title={this.props.shareTitle}
                    actAsExpander={showDescription}
                    showExpandableButton={showDescription}
                />
                {cardText}
            </Card>
        );
    }
}

MapInfo.propTypes = {
    shareTitle: string.isRequired,
    shareDescription: string.isRequired,
};

function mapStateToProps(state) {
    return state.main;
}

export default connect(mapStateToProps)(MapInfo);
