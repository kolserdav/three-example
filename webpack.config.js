// @ts-check

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PUBLIC_DIR = 'dist';

module.exports = {
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, PUBLIC_DIR),
    filename: 'js/bundle.js',
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
  		filename: 'index.html',
      template: 'src/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, PUBLIC_DIR),
    },
    compress: true,
    port: 9000,
  },
};