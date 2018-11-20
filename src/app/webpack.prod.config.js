var webpack = require('webpack');
var path = require('path');
var config = require('./webpack.common.config');

config.output.path = path.join(__dirname, '../dist');

config.plugins.push(
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
        },
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
        },
        sourceMap: true
    }),
    new webpack.LoaderOptionsPlugin({
        minimize: true
    })
);

module.exports = config;
