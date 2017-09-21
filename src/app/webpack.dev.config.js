var webpack = require('webpack');
var config = require('./webpack.common.config');

config.plugins.push(
    new webpack.SourceMapDevToolPlugin({
        filename: '[file].map',
        exclude: ['vendor.bundle.[hash].js'],
    }),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('development'),
        },
    }),
    new webpack.LoaderOptionsPlugin({
        debug: true
    })
);

config.watchOptions = {
    poll: 1000,
};

module.exports = config;
