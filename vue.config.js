/**
 * @vue.config.js - vue-cli3 기준 최초 실행되는 파일
 * 커스텀 설정 파일 / 환경 변수 로드, 컴파일할 라이브러리 설정 등
 **/

const yarnScript = process.env.npm_lifecycle_script
const ssrRegex = /vue-cli-service (ssr:build|ssr:serve)/gi
const commandRegex = /vue-cli-service (serve|ssr:serve)/gi
const regexResult = {
  ssr: ssrRegex.exec(yarnScript),
  serve: commandRegex.exec(yarnScript)
}

let mode = process.VUE_CLI_SERVICE.mode
global.isServe = regexResult.serve && Array.isArray(regexResult.serve)

if(!mode || mode === 'development' || mode === 'production') {
  mode = 'local.dev';
}

const withReport = mode.split('.report')[1] != null
const transpileDependencies = (
    global.isServe ? [] : Object.keys(require('./package.json').dependencies).concat(['base-x'])
)

if(withReport) {
  mode = mode.split('.report')[0]
  process.env.NODE_ENV = 'production'
}

const buildType = mode.split('.')[1] || 'dev'
const confPrefix = mode.split('.')[0] || 'local'
const publicPath = process.env.VUE_APP_PUBLIC_PATH || '/'
const productionSourceMap = process.env.NODE_ENV !== 'production'
const staticPath = publicPath === '/' ? '/static' : publicPath.slice(0, publicPath.length - 1)

global.isLocal = confPrefix === 'local'
const configureWebpack = require(`./config/${confPrefix}/${confPrefix}.${buildType}.conf`)

module.exports = {
  publicPath,
  productionSourceMap,
  configureWebpack,
  transpileDependencies,
  css: {
    extract: false,
    sourceMap: process.env.NODE_ENV !== 'production',
    loaderOptions: {
      sass: {
        prependData: `$public_path: "` + staticPath + `";`
      }
    }
  },
  /*
  devServer: {
    https: true
  },
   */
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  }
}
