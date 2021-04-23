const merge = require('webpack-merge')

const jenkinsBase = require('./jenkins.base.conf')
const baseWebpackPlugin = require('../webpack.base.conf')

module.exports = merge(baseWebpackPlugin, jenkinsBase, {

})
