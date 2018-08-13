const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

const javascript = {
  test: /\.js$/,
  exclude: ['node_modules'],
  use: ['babel-loader']
};

const css = {
  test: /\.css$/,
  exclude: ['node_modules'],
  use: [
    'style-loader',
    'css-loader'
  ]
};

const commonConfig = {
  entry: {
    main: './src/js/index.js'
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve('./dist')
  },
  module: {
    rules: [javascript, css]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};

let config;
if (devMode) {
  config = merge(commonConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
      host: 'localhost',
      port: 7777,
      open: true
    }
  });
} else {
  config = merge(commonConfig, {
    mode: 'production'
  });
}


module.exports = config;
