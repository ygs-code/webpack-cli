/*
 * @Date: 2022-04-29 18:16:47
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-12 14:02:53
 * @FilePath: /webpack-cli/@webpack-cli/client/config/webpack.prod.config.js
 * @Description:
 */

import path from "path";
import webpack from "webpack";
import nodeExternals from "webpack-node-externals";
import OptimizeCssAssetsWebpackPlugin from "optimize-css-assets-webpack-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";
// import MiniCssExtractPlugin from 'mini-css-extract-plugin';

function getIPAdress() {
  let interfaces = require("os").networkInterfaces();
  for (let devName in interfaces) {
    let iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}

export default {
  mode: "production",
  output: {
    publicPath: "./", // dev 服务器需要是绝对，而编译出来需要是相对
  },
  watch: false,
  optimization: {
    // 压缩
    minimize: true,
    minimizer: [
      // 配置生产环境的压缩方案：js和css
      new TerserWebpackPlugin(),
      new OptimizeCssAssetsWebpackPlugin(),
    ],
    //  任何字符串：用于设置 process.env.NODE_ENV 的值。
    nodeEnv: "production",
    moduleIds: "named",
    chunkIds: "named",
    // 开启这个编译包更小
    // runtimeChunk: {
    //   name: (entrypoint) => `runtime~${entrypoint.name}`,
    // },
  },
  devtool: "source-map", // 生产环境和开发环境判断
  plugins: [],
};
