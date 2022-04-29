/*
 * @Author: your name
 * @Date: 2020-12-28 10:56:55
 * @LastEditTime: 2022-04-28 16:41:09
 * @LastEditors: Yao guan shou
 * @Description: In User Settings Edit
 * @FilePath: /webpack-config/@webpack/server/config/index.js
 */
import path from "path";
import { merge } from "webpack-merge";
import SpeedMeasurePlugin from "speed-measure-webpack-plugin";
import { createVariants } from "parallel-webpack";
import { default as serverBaseConfig } from "./webpack.base.config";
import devConfig from "./webpack.dev.config";
import prodConfig from "./webpack.prd.config";
import testConfig from "./webpack.test.config";
import { getArgv } from "../../utils";

const webpackEnv = getArgv("webpackEnv"); // 环境参数
const NODE_ENV = process.env.NODE_ENV; // 环境参数
//   是否是测试开发环境
const isEnvDevelopment = NODE_ENV === "development";
//    是否是生产环境
const isEnvProduction = NODE_ENV === "production";

//添加smp.wrap会有bug 编译缓存出问题
const smp = new SpeedMeasurePlugin();

export default async () => {
  let userDevConfig = await new Promise((resolve, reject) => {
    import(
      path.join(process.cwd(), "/user-webpack-config/webpack.dev.config.js")
    )
      .then((module) => {
        resolve(module.default || {});
      })
      .catch((error) => {
        console.error("userDevConfig error:", error);
        resolve({});
      });
  });

  let userProdConfig = await new Promise((resolve, reject) => {
    import(
      path.join(process.cwd(), "/user-webpack-config/webpack.prod.config.js")
    )
      .then((module) => {
        resolve(module.default || {});
      })
      .catch(() => {
        console.error('userProdConfig error:',error)
        resolve({});
      });
  });

  let config = {};
  if (webpackEnv == "test") {
    //   测试代码打包
    config = merge(
      serverBaseConfig,
      testConfig,
      isEnvDevelopment ? devConfig : prodConfig,
      isEnvDevelopment ? userDevConfig : userProdConfig
      // prdConfig,
    );
  } else {
    // 源码打包
    config = merge(
      serverBaseConfig,
      isEnvDevelopment ? devConfig : prodConfig,
      isEnvDevelopment ? userDevConfig : userProdConfig
    );
  }

  return config;
};
