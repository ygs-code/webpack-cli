/*
 * @Date: 2022-04-29 18:16:47
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-12 14:02:53
 * @FilePath: /webpack-cli/@webpack-cli/client/config/webpack.prod.config.js
 * @Description:
 */

import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import CssMinimizerPlugin from  "css-minimizer-webpack-plugin"
import TerserWebpackPlugin from 'terser-webpack-plugin';
// import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
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
    plugins: [],
};
