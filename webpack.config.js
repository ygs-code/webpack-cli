/*
 * @Date: 2018-01-25 00:54:00
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-23 19:41:37
 * @FilePath: /webpack-cli/webpack.config.js
 * @Description:
 */
var webpack = require('webpack')
var fs = require('fs')
var path = require('path')
var WebpackBar = require('webpackbar')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
var { CheckerPlugin } = require('awesome-typescript-loader')
const NODE_ENV = process.env.NODE_ENV // 环境参数
//    是否是生产环境
const isEnvProduction = NODE_ENV === 'production'
//   是否是测试开发环境
const isEnvDevelopment = NODE_ENV === 'development'

module.exports = {
  devtool: 'source-map', // 生产环境和开发环境判断
  mode: 'development',

  entry: {
    index: path.resolve(__dirname, '@webpack-cli/index.js'),
  },
  output: {
    path: path.resolve(__dirname, '@webpack-cli-cjs1'),
    // filename: '[name].[hash].js',
    // chunkFilename: '[name].[hash].js',
    // Chunk 配置
    filename: '[name].js',
    chunkFilename: '[name].js',
    // 访问静态资源目录 比如 css img
    publicPath: '/',
    // 导出库(exported library)的名称
    // library: 'server',
    //   导出库(exported library)的类型
    libraryTarget: 'umd',
    // 在 UMD 库中使用命名的 AMD 模块
    umdNamedDefine: true,
  },
  //配置node环境
  target: 'node',
  node: {
    __filename: true,
    __dirname: true,
    global: false,
  },
  //防止将某些 import 的包(package)打包到 bundle 中,而是在运行时(runtime)再去从外部获取这些扩展依赖
  externals: [
    //引入缓存

    //将node_modules目录下的所有模块加入到externals中    告知 webpack  ，并忽略 externals 中的模块
    (() => {
      const nodeModules = {}
      fs.readdirSync(path.join(process.cwd(), '/node_modules'))
        .filter((catalogue) => {
          return ['.bin'].indexOf(catalogue) === -1
        })
        .forEach((mod) => {
          if (mod.indexOf('.') === 0) return
          nodeModules[mod] = 'commonjs ' + mod
        })

      return nodeModules
    })(),
  ],
  watch: false,
  module: {
    rules: [
      {
        test: /(\.tsx?$)|(\.ts?$)/,
        use: ['awesome-typescript-loader'].concat(
          isEnvDevelopment ? ['thread-loader', 'cache-loader'] : [],
        ),
      },
      {
        test: /\.m?js$/,
        enforce: 'pre',
        // 排除文件,因为这些包已经编译过，无需再次编译
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
    ],
  },

  plugins: [
    new FriendlyErrorsPlugin(),
    new CaseSensitivePathsPlugin(),
    // // 编译ts插件
    // new CheckerPlugin(),
    // // 编译进度条
    // new WebpackBar(),
    // new webpack.NoEmitOnErrorsPlugin(),
    // // 如果是配置前端就很好注入插件
    // new webpack.DefinePlugin({
    //   //也可以注入插件 能 注入vue 但是不能注入 Koa
    //   // vue,
    //   //不能注入 Koa
    //   // Koa,
    //   //注入一个环境变量
    //   "process.env": { BUILD_TARGET: "BUILD_TARGET" },
    // }),
  ],
}
