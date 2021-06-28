// 로컬 설정 파일의 Base
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: '8080',
    disableHostCheck: true,
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../../static'),
        to: 'static',
        ignore: ['.*'],
      },
    ]),
  ],
};
