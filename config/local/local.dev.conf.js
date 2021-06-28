const path = require('path');
const merge = require('webpack-merge');
const localBaseConfig = require('./local.base.conf');
const baseWebpackConfig = require('../webpack.base.conf');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = merge(baseWebpackConfig, localBaseConfig, {});
