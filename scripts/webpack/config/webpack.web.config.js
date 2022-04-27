/*
 * @Date: 2022-04-24 12:39:24
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-24 20:27:43
 * @FilePath: /webpackClient/scripts/webpack/config/webpack.web.config.js
 * @Description:
 */
// import "@babel/polyfill";
import webpack from "webpack";
import fs from "fs";
import path, { resolve } from "path";
import nodeExternals from "webpack-node-externals";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import WebpackBar from "webpackbar";
import HappyPack from "happypack";
import FriendlyErrorsPlugin from "friendly-errors-webpack-plugin";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
import DirectoryNamedWebpackPlugin from "directory-named-webpack-plugin";
import { CheckerPlugin } from "awesome-typescript-loader";
import os from "os";
import bannerPlugin from "./bannerPlugin";
import MyExampleWebpackPlugin from "./definePlugin/MyExampleWebpackPlugin";
import { getArgv } from "../utils";
import NpmInstallPlugin from "npm-install-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import WebpackBuildDllPlugin from "webpack-build-dll-plugin";
import DllReferencePlugin from "webpack/lib/DllReferencePlugin";
import HardSourceWebpackPlugin from "hard-source-webpack-plugin";

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
// console.log("__dirname : " + __dirname);
// console.log("resolve   : " + resolve("./"));
// console.log("cwd       : " + process.cwd());
export default {
  // entry: "index.js",
  // output: {
  //   path: __dirname + "/dist",
  //   filename: "index_bundle.js",
  // },
  // 配置web环境
  target: "web",
  plugins: [
    // dll start dll配置 在服务端 DllPlugin 用不了没办法加载js, 只有客户端才能用
    // 运行DllPlugin配置文件
    // new WebpackBuildDllPlugin({
    //   // dllConfigPath: required, your Dll Config Path, support absolute path.
    //   dllConfigPath: path.join(__dirname, "./webpack.dll.config.js"),
    //   forceBuild: false,
    // }),

    // // //    告诉webpack使用了哪些第三方库代码
    // new webpack.DllReferencePlugin({
    //   // vue 映射到json文件上去
    //   // manifest: path.join(process.cwd(), "/dist/static", "vue.manifest.json"),
    //   manifest: path.join(
    //     __dirname,
    //     "../../../dist/static",
    //     "react.manifest.json"
    //   ),
    // }),

    // //DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用
    // // 如果是配置前端就很好注入插件
    // new webpack.DefinePlugin({
    //   //也可以注入插件 能 注入vue 但是不能注入 Koa
    //   // vue,
    //   //不能注入 Koa
    //   // Koa,
    //   //注入一个环境变量
    //   "process.env": { BUILD_TARGET: "BUILD_TARGET" },
    // }),

    // dll end dll配置
  ],
};
