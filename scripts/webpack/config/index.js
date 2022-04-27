/*
 * @Author: your name
 * @Date: 2020-12-28 10:56:55
 * @LastEditTime: 2022-04-24 17:57:25
 * @LastEditors: Yao guan shou
 * @Description: In User Settings Edit
 * @FilePath: /webpackClient/scripts/webpack/config/index.js
 */
import { merge } from "webpack-merge";
import SpeedMeasurePlugin from "speed-measure-webpack-plugin";
import { createVariants } from "parallel-webpack";
import baseConfig from "./webpack.base.config";
import devConfig from "./webpack.dev.config";
import prdConfig from "./webpack.prd.config";
import testConfig from "./webpack.test.config";
import nodeConfig from "./webpack.node.config";
import webConfig from "./webpack.web.config";
import webDevConfig from "./webpack.web.dev.config";
import webPrdConfig from "./webpack.web.prdconfig";
import { getArgv } from "../utils";

const webpackEnv = getArgv("webpackEnv"); // 环境参数
const target = getArgv("target"); // 环境参数
const NODE_ENV = process.env.NODE_ENV; // 环境参数
//   是否是测试开发环境
const isEnvDevelopment = NODE_ENV === "development";
//    是否是生产环境
const isEnvProduction = NODE_ENV === "production";

let isWeb = target == "web";

// 判断是web环境还是node环境
let targetConfig = isWeb ? webConfig : nodeConfig;

console.log("target===================", target);

//添加smp.wrap会有bug 编译缓存出问题
const smp = new SpeedMeasurePlugin();

let config = {};
if (webpackEnv == "test") {
  //   测试代码打包
  config = merge(
    baseConfig,
    testConfig,
    isEnvDevelopment ? devConfig : prdConfig,
    // prdConfig,
    targetConfig
  );
} else {
  // 源码打包
  config = merge(
    baseConfig,
    isEnvDevelopment ? devConfig : prdConfig,
    targetConfig, // 是node环境还是web环境
    isWeb ? (isEnvDevelopment ? webDevConfig : webPrdConfig) : {}
  );
}

// console.log("config===========", config);
export default config;
// smp.wrap(config))
