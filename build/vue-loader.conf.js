//调用路径解析函数 与css方案
var utils = require('./utils')
// 调用开发环境dev 或者 生产环境 build 参数
var config = require('../config')

//判断是开发环境还是生产环境
var isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  //css方案配置
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  })
}
