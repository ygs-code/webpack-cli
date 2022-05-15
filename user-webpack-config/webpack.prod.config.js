/*
 * @Date: 2022-04-27 20:24:09
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-09 13:17:44
 * @FilePath: /webpack-cli/user-webpack-config/webpack.prod.config.js
 * @Description:
 */
const MyExampleWebpackPlugin = require("./definePlugin/MyExampleWebpackPlugin");
const os = require("os");
const webpack = require("webpack");
const path = require("path");
const HappyPack = require("happypack");
// const { getArgv } = require("../@webpack/utils");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 });
const ExtendedDefinePlugin = require("extended-define-webpack-plugin");
// const webpackEnv = getArgv("webpackEnv"); // 环境参数

const NODE_ENV = process.env.NODE_ENV; // 环境参数
//    是否是生产环境
const isEnvProduction = NODE_ENV === "production";
//   是否是测试开发环境
const isEnvDevelopment = NODE_ENV === "development";

const cacheLoader = (happypackId) => {
  return isEnvDevelopment
    ? [
        `happypack/loader?id=${happypackId}&cacheDirectory=true`,
        "thread-loader",
        "cache-loader",
      ]
    : [`happypack/loader?id=${happypackId}`];
};
// 用户自定义webpack
module.exports = {
  plugins: [
    // 注入全局常量
    // new ExtendedDefinePlugin({
    //   APP_CONFIG: {
    //     api_key: "1234567890ABCDEFG",
    //     fb_conf: {
    //       use_social: true,
    //       api_key: "123456790",
    //     },
    //   },
    // }),
    // // 自定义插件
    // new MyExampleWebpackPlugin({
    //   // 出口
    //   outputPath: path.join(process.cwd(), "/app"),
    // }),
    // new HappyPack({
    //   id: "graphql",
    //   use: [
    //     //添加loader
    //     {
    //       loader: path.join(
    //         __dirname,
    //         "./defineLoader/MyExampleWebpackLoader.js"
    //       ),
    //       options: {
    //         name: "graphql",
    //       },
    //     },
    //     {
    //       loader: "raw-loader",
    //       options: {},
    //     },
    //   ],
    //   // 输出执行日志
    //   verbose: true,
    //   // 使用共享线程池
    //   threadPool: happyThreadPool,
    // }),

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
  // module: {
  //   rules: [
  //     {
  //       test: /(\.tsx?$)|(\.ts?$)/,
  //       use: {
  //         loader: path.join(
  //           __dirname,
  //           "./defineLoader/MyExampleWebpackLoader.js"
  //         ),
  //         options: {},
  //       },
  //     },
  //     {
  //       test: /\.m?js$/,
  //       enforce: "pre",
  //       // 排除文件,因为这些包已经编译过，无需再次编译
  //       exclude: /(node_modules|bower_components)/,
  //       use: {
  //         loader: path.join(
  //           __dirname,
  //           "./defineLoader/MyExampleWebpackLoader.js"
  //         ),
  //         options: {},
  //       },
  //     },
  //     {
  //       test: /\.js?$/,
  //       enforce: "pre",
  //       // 排除文件,因为这些包已经编译过，无需再次编译
  //       exclude: /(node_modules|bower_components)/,
  //       use: {
  //         loader: path.join(
  //           __dirname,
  //           "./defineLoader/MyExampleWebpackLoader.js"
  //         ),
  //         options: {},
  //       },
  //     },
  //   ],
  // },
 
  // plugins: [
  //   // new HappyPack({
  //   //   id: "graphql",
  //   //   use: [
  //   //     //添加loader
  //   //     {
  //   //       loader: path.join(
  //   //         __dirname,
  //   //         "./defineLoader/MyExampleWebpackLoader.js"
  //   //       ),
  //   //       options: {
  //   //         name: "graphql",
  //   //       },
  //   //     },
  //   //     {
  //   //       loader: "raw-loader",
  //   //       options: {},
  //   //     },
  //   //   ],
  //   //   // 输出执行日志
  //   //   verbose: true,
  //   //   // 使用共享线程池
  //   //   threadPool: happyThreadPool,
  //   // }),

  //   // 如果是配置前端就很好注入插件
  //   new webpack.DefinePlugin({
  //     //也可以注入插件 能 注入vue 但是不能注入 Koa
  //     // vue,
  //     //不能注入 Koa
  //     // Koa,
  //     //注入一个环境变量
  //     "process.env": { BUILD_TARGET: "BUILD_TARGET" },
  //   }),

  //   // 自定义插件
  //   new MyExampleWebpackPlugin({
  //     // 出口
  //     outputPath: path.join(process.cwd(), "/app"),
  //   }),
  // ],
};
