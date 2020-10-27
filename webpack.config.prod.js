const path = require("path");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const AppCachePlugin = require("appcache-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const SwigWebpackPlugin = require("swig-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  //devtool: 'source-map',
  entry: [
    "./app/src/index"
    //'./app/src/util/DomainChecker.offuscate'
  ],
  output: {
    path: path.join(__dirname, "dist/web"),
    filename: "static/app.[hash].js",
    publicPath: "/"
  },
  plugins: [
    new Dotenv({
      systemvars: true
    }),
    new webpack.DefinePlugin({
      __DEV__: false
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      output: { comments: false },
      beautify: false,
      compressor: {
        warnings: false
      }
    }),
    new ExtractTextPlugin({
      filename: "static/styles.[hash].css",
      allChunks: true
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: false
    }),
    new HtmlWebpackPlugin({
      template: "./app/index.prod.html",
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: "index.nocache.html",
      template: "./app/index.nocache.prod.html",
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: "unauthorized.html",
      template: "./app/unauthorized.html",
      inject: true
    }),
    new AppCachePlugin({
      cache: ["/"],
      network: ["*"],
      fallback: ["/ /"],
      settings: ["prefer-online"],
      exclude: ["index.html", "index.nocache.html", "swf/widget.swf"]
    }),
    new SwigWebpackPlugin({
      filename: "robots.txt",
      template: "./app/robots.txt"
    }),
    new SwigWebpackPlugin({
      filename: "litesearch.xml",
      template: "./app/litesearch.xml"
    }),
    new SwigWebpackPlugin({
      filename: "crossdomain.xml",
      template: "./app/crossdomain.xml"
    }),
    new SwigWebpackPlugin({
      filename: "manifest.json",
      template: "./app/manifest.json"
    })
  ],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("css-loader")
      },
      {
        test: /\.scss$/,
        include: [
          path.join(__dirname, "app/src/pages/promo"),
          path.join(__dirname, "app/src/pages/install")
        ],
        loader: ExtractTextPlugin.extract(
          "css-loader?modules&importLoaders=1&localIdentName=[hash:base64:4]!sass-loader"
        )
      },
      {
        test: /\.scss$/,
        include: [
          path.join(__dirname, "node_modules"),
          path.join(__dirname, "app/src")
        ],
        exclude: [
          path.join(__dirname, "app/src/pages/promo"),
          path.join(__dirname, "app/src/pages/install")
        ],
        loader: ExtractTextPlugin.extract("css-loader!sass-loader")
      },
      {
        test: /\.less/,
        loader: ExtractTextPlugin.extract(
          "css-loader?sourceMap!less-loader?sourceMap"
        )
      },
      {
        test: /\.js$/,
        loaders: ["babel-loader"],
        include: [
          path.join(__dirname, "app/src"),
          path.join(__dirname, "node_modules/clipboard/src")
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          "file-loader?name=images/[name].[ext]",
          {
            loader: "image-webpack-loader",
            query: {
              mozjpeg: {
                progressive: true
              },
              gifsicle: {
                interlaced: false
              },
              optipng: {
                optimizationLevel: 4
              },
              pngquant: {
                quality: "75-90",
                speed: 3
              }
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: "file-loader?name=fonts/[name].[ext]"
      },
      {
        test: /\.(ico)$/,
        loader: "file-loader?name=[name].[ext]"
      },
      {
        test: /\.(swf)$/,
        loader: "file-loader?name=swf/[name].[ext]"
      }
    ]
  }
};
