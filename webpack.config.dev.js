const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const Dotenv = require('dotenv-webpack');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    'eventsource-polyfill',
    'webpack-hot-middleware/client',
    './app/src/styles/Preview.scss',
    './app/src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist/web'),
    filename: 'static/app.js',
    //pathinfo: true,
    publicPath: '/'
  },
  plugins: [
    new Dotenv({
      systemvars: true
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    }),
    new webpack.DefinePlugin({
      __DEV__: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: [
          path.join(__dirname, 'app/src'),
          path.join(__dirname, 'node_modules/clipboard/src')
        ]
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        include: [
          path.join(__dirname, 'app/src/pages/promo'),
          path.join(__dirname, 'app/src/pages/install')
        ],
        loaders: [
          'style-loader?sourceMap',
          'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]---[local]---[hash:base64:5]]',
          'sass-loader?sourceMap'
        ]
      },
      {
        test: /\.scss$/,
        include: [
          path.join(__dirname, 'node_modules'),
          path.join(__dirname, 'app/src')
        ],
        exclude: [
          path.join(__dirname, 'app/src/pages/promo'),
          path.join(__dirname, 'app/src/pages/install')
        ],
        loader: 'style-loader!css-loader!sass-loader'
      },
      {
        test: /\.less/,
        loaders: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loaders: ['file-loader?name=images/[name].[ext]']
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loaders: ['file-loader?name=fonts/[name].[ext]']
      },
      {
        test: /\.(ico)$/,
        loaders: ['file-loader?name=[name].[ext]']
      },
      {
        test: /\.(swf)$/,
        loaders: ['file-loader?name=swf/[name].[ext]']
      }
    ]
  }
};
