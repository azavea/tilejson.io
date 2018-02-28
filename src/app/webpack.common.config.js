var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var outputPath = '/usr/dist';

module.exports = {
    entry: {
        app: ['babel-polyfill', './js/src/main.jsx'],
        vendor: [
            'leaflet',
            'react',
            'react-dom',
            'react-leaflet',
            'react-redux',
            'redux',
            'redux-devtools',
            'redux-logger',
            'redux-thunk',
        ],
    },
    output: {
        path: outputPath,
        publicPath: '/',
        filename: '[name].bundle.[hash].js',
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor', 
            filename: 'vendor.bundle.[hash].js', 
            minChunks: Infinity
        }),
        new HtmlWebpackPlugin({
            title: 'Project Name',
            template: 'template.html',
            favicon: 'img/favicon.png',
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    require('autoprefixer'),
                ]
            }
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|lib)\/(?!tilejson-validator)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react'],
                    plugins: ['transform-object-assign'],
                },
            },
            {
                test: /\.jsx?/,
                exclude: /(node_modules|lib|json)/,
                loader: 'eslint-loader',
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }, 
                    {
                        loader: 'resolve-url-loader'
                    }, 
                    {
                        loader: 'postcss-loader'
                    }, 
                    {
                        loader: 'sass-loader?sourceMap'
                    }
                ],
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules',
                include: /flexboxgrid/
            },
            {
                test: /fonts.*\.(woff|woff2|ttf|eot|svg)($|\?)/,
                loader: 'url-loader?limit=25000&name=font/[name].[ext]',
            },
            {
                test: /(img|images).*\.(jpg|png|gif|svg)$/,
                loader: 'url-loader?limit=25000&name=img/[name].[ext]',
            },
            {
                test: /.*\.(json)$/,
                exclude: /node_modules/,
                loader: 'json-loader',
            },
            {
                test: /\.(html)$/,
                loader: 'html-loader?name=[name].[ext]',
            },
            {
                test: require.resolve('leaflet'),
                use: [
                    'expose-loader?L',
                    'expose-loader?leaflet'
                ]
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: ['common', 'node_modules', 'img', 'js'],
    },
    node: {
        fs: 'empty',
    },
    devServer: {
        disableHostCheck: true,
        historyApiFallback: {
            index: '/',
        }
    },
};
