/*
 * @Date: 2022-04-24 12:39:35
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-24 19:49:23
 * @FilePath: /webpackClient/scripts/webpack/config/webpack.node.config.js
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
console.log("__dirname : " + __dirname);
console.log("resolve   : " + resolve("./"));
console.log("cwd       : " + process.cwd());
export default {
  // 是否监听文件
  // watch: false,

  // 配置web环境
  // target: "web",
  //配置node环境
  target: "node",
  node: {
    __filename: true,
    __dirname: true,
    global: false,
  },

  //防止将某些 import 的包(package)打包到 bundle 中,而是在运行时(runtime)再去从外部获取这些扩展依赖
  externals: [
    //引入缓存
    nodeExternals({
      allowlist: ["webpack/hot/poll?1000"],
    }),
    //将node_modules目录下的所有模块加入到externals中    告知 webpack  ，并忽略 externals 中的模块
    (() => {
      const nodeModules = {};
      fs.readdirSync(path.join(process.cwd(), "/node_modules"))
        .filter((catalogue) => {
          return [".bin"].indexOf(catalogue) === -1;
        })
        .forEach((mod) => {
          if (mod.indexOf(".") === 0) return;
          nodeModules[mod] = "commonjs " + mod;
        });

      return nodeModules;
    })(),
  ],
};
