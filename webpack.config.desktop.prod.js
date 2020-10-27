var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var AppCachePlugin = require('appcache-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var SwigWebpackPlugin = require('swig-webpack-plugin');

module.exports = {
    //devtool: 'source-map',
    entry: [
        './app/src/index'
    ],
    output: {
        path: path.join(__dirname, 'dist/desktop'),
        filename: 'static/app.[hash].js',
        publicPath: '',
        hash: true
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            output: {comments: false},
            compressor: {
                warnings: false
            }
        }),
        new ExtractTextPlugin('static/styles.[hash].css', {
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            template: 'app/index.desktop.prod.html',
            inject: true
        }),
        new AppCachePlugin({
            cache: ['/'],
            network: ['*'],
            fallback: ['/ /'],
            exclude: []
        }),
        new SwigWebpackPlugin({
            filename: 'package.json',
            template: 'desktop/package.json'
        }),
        new SwigWebpackPlugin({
            filename: 'app.js',
            template: 'desktop/app.js'
        }),
        new SwigWebpackPlugin({
            filename: 'manifest.json',
            template: './app/manifest.json'
        })
    ],
    module: {
        loaders: [{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('css!postcss')
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('css?sourceMap!postcss?sourceMap!sass?sourceMap')
        }, {
            test: /\.less/,
            loader: ExtractTextPlugin.extract('css?sourceMap!postcss?sourceMap!less?sourceMap')
        }, {
            test: /\.js$/,
            loaders: ['babel'],
            include: [path.join(__dirname, 'app/src'), path.join(__dirname, 'node_modules/clipboard/src')]
        }, {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loaders: [
                'file?name=images/[name].[ext]',
                'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
            ]
        }, {
            test: /\.(woff|woff2|eot|ttf|svg)$/,
            loader: 'file?name=fonts/[name].[ext]'
        }, {
            test: /\.(ico)$/,
            loader: 'file?name=[name].[ext]'
        }, {
            test: /\.(swf)$/,
            loader: 'file?name=swf/[name].[ext]'
        }]
    },
    postcss: [autoprefixer({browsers: ['> 1%', 'IE 8']})]
};
