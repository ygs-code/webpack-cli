/*
 * @Author: your name
 * @Date: 2020-12-28 10:56:55
 * @LastEditTime: 2022-04-29 18:27:12
 * @LastEditors: Yao guan shou
 * @Description: In User Settings Edit
 * @FilePath: /webpack-cli/@webpack-cli-cjs/server/config/index.js
 */
const path = require("path");
const { merge } = require("webpack-merge");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const { createVariants } = require("parallel-webpack");
const serverBaseConfig = require("./webpack.base.config");
const devConfig = require("./webpack.dev.config");
const prodConfig = require("./webpack.prd.config");
const testConfig = require("./webpack.test.config");
const { getArgv } = require("../../utils");

const webpackEnv = getArgv("webpackEnv"); // 环境参数
const NODE_ENV = process.env.NODE_ENV; // 环境参数
//   是否是测试开发环境
const isEnvDevelopment = NODE_ENV === "development";
//    是否是生产环境
const isEnvProduction = NODE_ENV === "production";

//添加smp.wrap会有bug 编译缓存出问题
const smp = new SpeedMeasurePlugin();

module.exports =async () => {
  // let userDevConfig = await new Promise((resolve, reject) => {
  //   const     (
  //     path.join(process.cwd(), "/user-webpack-config/webpack.dev.config.js")
  //   )
  //     .then((module) => {
  //       resolve(module.default || {});
  //     })
  //     .catch((error) => {
  //       console.error("userDevConfig error:", error);
  //       resolve({});
  //     });
  // });

  // let userProdConfig = await new Promise((resolve, reject) => {
  //   const     (
  //     path.join(process.cwd(), "/user-webpack-config/webpack.prod.config.js")
  //   )
  //     .then((module) => {
  //       resolve(module.default || {});
  //     })
  //     .catch(() => {
  //       console.error('userProdConfig error:',error)
  //       resolve({});
  //     });
  // });

  let config = {};
  if (webpackEnv == "test") {
    //   测试代码打包
    config = merge(
      serverBaseConfig,
      testConfig,
      isEnvDevelopment ? devConfig : prodConfig
      // isEnvDevelopment ? userDevConfig : userProdConfig
      // prdConfig,
    );
  } else {
    // 源码打包
    config = merge(
      serverBaseConfig,
      isEnvDevelopment ? devConfig : prodConfig
      // isEnvDevelopment ? userDevConfig : userProdConfig
    );
  }

  return config;
};
