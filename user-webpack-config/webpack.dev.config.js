/*
 * @Date: 2022-04-27 20:24:09
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-28 18:13:53
 * @FilePath: /webpack-config/user-webpack-config/webpack.dev.config.js
 * @Description:
 */
import MyExampleWebpackPlugin from "./definePlugin/MyExampleWebpackPlugin";
import os from "os";
import webpack from "webpack";
import path from "path";
import HappyPack from "happypack";
import ExtendedDefinePlugin from "extended-define-webpack-plugin";
import { getArgv } from "../@webpack/utils";
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 });
const webpackEnv = getArgv("webpackEnv"); // 环境参数
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
export default {
  module: {
    rules: [
      {
        test: /(\.tsx?$)|(\.ts?$)/,
        use: {
          loader: path.join(
            __dirname,
            "./defineLoader/MyExampleWebpackLoader.js"
          ),
          options: {},
        },
      },
      {
        test: /\.m?js$/,
        enforce: "pre",
        // 排除文件,因为这些包已经编译过，无需再次编译
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: path.join(
            __dirname,
            "./defineLoader/MyExampleWebpackLoader.js"
          ),
          options: {},
        },
      },
      {
        test: /\.js?$/,
        enforce: "pre",
        // 排除文件,因为这些包已经编译过，无需再次编译
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: path.join(
            __dirname,
            "./defineLoader/MyExampleWebpackLoader.js"
          ),
          options: {},
        },
      },
    ],
  },
  // devServer: {
  //   output: {
  //     publicPath: "/", // 静态资源文件公开目录
  //   },
  //   liveReload: false, // 编译之后是否自动刷新浏览器
  //   // 代理 支持对象或者数组配置化
  //   proxy: [
  //     {
  //       context: ["/api/v1/common/upload/"],
  //       target: "https://webpack.docschina.org/",
  //       changeOrigin: true,
  //       secure: false,
  //       // pathRewrite: {
  //       //   "^/api/v1/common/upload/": "/",
  //       // },
  //     },
  //   ],

  //   // proxy: [
  //   //   {
  //   //     context: ["/api/v1/common/upload/"],
  //   //     target: "http://192.168.148.191:9091/",
  //   //     changeOrigin: true,
  //   //     secure: false,
  //   //     pathRewrite: {
  //   //       "^/api/v1/common/upload/": "/",
  //   //     },
  //   //   },

  //   //   // {
  //   //   //   context: ['/api/v1/scrm-marketing/full/draw/shop'],
  //   //   //   target: 'http://192.168.198.58:8120',
  //   //   //   changeOrigin: true,
  //   //   //   secure: false,
  //   //   //   // pathRewrite: {
  //   //   //   //   '^/api/v1/scrm-member/': '/'
  //   //   //   // },
  //   //   // },

  //   //   {
  //   //     context: ["/api/"],
  //   //     target: "https://sit-hlj.rainbowcn.com/",
  //   //     changeOrigin: true,
  //   //     secure: false,
  //   //   },
  //   //   // {
  //   //   //   context: ['/api/productActivities/getShoppe/'],
  //   //   //   target: 'http://192.168.213.183:9731/',
  //   //   //   changeOrigin: true,
  //   //   //   secure: false,
  //   //   //   pathRewrite: { '/api/productActivities/getShoppe': '/productActivities/getShoppe' },
  //   //   // },
  //   // ],
  // },
  plugins: [
    // 注入全局常量
    new ExtendedDefinePlugin({
      APP_CONFIG: {
        api_key: "1234567890ABCDEFG",
        fb_conf: {
          use_social: true,
          api_key: "123456790",
        },
      },
    }),
    // 自定义插件
    new MyExampleWebpackPlugin({
      // 出口
      outputPath: path.join(process.cwd(), "/app"),
    }),
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
};
