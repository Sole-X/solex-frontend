const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { DateTime } = require('luxon');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin();

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const publicPath = global.isLocal ? '/static/' : process.env.VUE_APP_PUBLIC_PATH || '/';

module.exports = {
  output: {},
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('./src'),
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        use: [
          {
            loader: 'ignore-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      _: resolve('./src/utils/LodashImporter'),
    }),
    new HtmlWebpackPlugin({
      title: 'SOLE-X',
      options: {
        publicPath,
      },
      filename: 'index.html',
      template: global.isLocal ? 'template/index.html' : 'template/index.html',
      minify: global.isLocal
        ? undefined
        : {
            minifyJS: true,
            minifyCSS: true,
            removeComments: true,
            collapseWhitespace: true,
            collapseInlineTagWhitespace: true,
          },
    }),
    new webpack.DefinePlugin({
      'process.env.version': JSON.stringify(gitRevisionPlugin.commithash().slice(0, 7)),
      'process.env.createdBundleAt': JSON.stringify(DateTime.local().toFormat('yyyy-MM-dd HH:mm:ss')),
    }),
  ],
};
