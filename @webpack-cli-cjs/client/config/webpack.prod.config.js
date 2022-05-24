/*
 * @Date: 2022-04-29 18:16:58
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-24 19:18:48
 * @FilePath: /webpack-cli/@webpack-cli-cjs/client/config/webpack.prod.config.js
 * @Description:
 */

const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const HappyPack = require('happypack')
const CopyPlugin = require('copy-webpack-plugin')
const { ESBuildPlugin, ESBuildMinifyPlugin } = require('esbuild-loader')
const os = require('os')
const NODE_ENV = process.env.NODE_ENV // 环境参数
//    是否是生产环境
const isEnvProduction = NODE_ENV === 'production'
//   是否是测试开发环境
const isEnvDevelopment = NODE_ENV === 'development'
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 })
const cacheLoader = (happypackId) => {
  return isEnvDevelopment
    ? [
        // `happypack/loader?id=${happypackId}`,
        `happypack/loader?id=${happypackId}&cacheDirectory=true`,
        'thread-loader',
        'cache-loader',
      ]
    : [`happypack/loader?id=${happypackId}`]
}

module.exports = {
  mode: 'production',
  output: {
    publicPath: './', // dev 服务器需要是绝对，而编译出来需要是相对
    // 如果一个模块是在 require 时抛出异常，告诉 webpack 从模块实例缓存(require.cache)中删除这个模块。
    // 并且重启webpack的时候也会删除cache缓存
    strictModuleExceptionHandling: true,
  },
  watch: false,
  optimization: {
    // 压缩
    minimize: true,
    minimizer: [
      // 配置生产环境的压缩方案：js和css
      new TerserWebpackPlugin(),
      new CssMinimizerPlugin(),
      new ESBuildMinifyPlugin({
        target: 'es2015', // Syntax to compile to (see options below for possible values)
        css: true,
      }),
    ],
    //  任何字符串：用于设置 process.env.NODE_ENV 的值。
    nodeEnv: 'production',
    moduleIds: 'named',
    chunkIds: 'named',
    // 开启这个编译包更小
    // runtimeChunk: {
    //   name: (entrypoint) => `runtime~${entrypoint.name}`,
    // },
  },
  devtool: 'source-map', // 生产环境和开发环境判断
  module: {
    rules: [
      // js和jsx编译
      {
        test: /(\.m?js$)|(\.jsx?$)/,
        // enforce: 'pre',
        // 排除文件,因为这些包已经编译过，无需再次编译
        exclude: /(node_modules|bower_components)/,
        use: ['source-map-loader'].concat(cacheLoader('babel')),
        // use: {
        //  loader: "babel-loader",
        //   options: {
        //     presets: ["@babel/preset-env"],
        //     plugins: ["@babel/plugin-transform-runtime"],
        //   },
        // },
      },
      // css
      {
        test: /\.css$/i,
        // 排除文件,因为这些包已经编译过，无需再次编译
        exclude: /(node_modules|bower_components)/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      //   less
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },

      //  scss
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          // 'sass-loader',
          {
            loader: 'sass-loader',
            options: {
              // Prefer `dart-sass`
              implementation: require('sass'),
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // 复制
    new CopyPlugin({
      patterns: [
        {
          from: path.join(process.cwd(), '/static/**/*'),
          to: path.join(process.cwd(), 'dist'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
    new HappyPack({
      id: 'babel',
      //添加loader
      use: [
        {
          loader: 'babel-loader',
          options: {
            // cacheDirectory: true,
          },
        },
      ],

      // use: ["babel-loader", "unicode-loader"],
      // 输出执行日志
      // verbose: true,
      // 使用共享线程池
      threadPool: happyThreadPool,
    }),
  ],
}
