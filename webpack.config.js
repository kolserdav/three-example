// @ts-check

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env) => {
  const { NODE_ENV } = env;
  return {
    mode: NODE_ENV,
    entry: './src/js/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/bundle.js',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.html',
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'static'),
      },
      compress: true,
      port: 9000,
    },
  };
};
