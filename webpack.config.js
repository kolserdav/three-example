// @ts-check

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env) => {
  const { NODE_ENV } = env;
  return {
    mode: NODE_ENV,
    entry: {
      main: './src/js/main/index.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].min.js',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.html',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(scss|css)$/i,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'static'),
      },
      compress: true,
      port: 9000,
    },
  };
};
