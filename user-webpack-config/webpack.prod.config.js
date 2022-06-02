/*
 * @Date: 2022-04-27 20:24:09
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-12 19:36:35
 * @FilePath: /webpack-cli/user-webpack-config/webpack.dev.config.js
 * @Description:
 */
const MyExampleWebpackPlugin = require('./definePlugin/MyExampleWebpackPlugin');
const HelloWorldCheckerPlugin = require('./definePlugin/HelloWorldCheckerPlugin');
const os = require('os');
const webpack = require('webpack');
const path = require('path');
const HappyPack = require('happypack');
const ExtendedDefinePlugin = require('extended-define-webpack-plugin');
// const { getArgv } = require("../@webpack/utils");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 });
// const WEB_ENV = getArgv("WEB_ENV"); // 环境参数
let {
    NODE_ENV, // 环境参数
    WEB_ENV, // 环境参数
    target, // 环境参数
    htmlWebpackPluginOptions = '',
} = process.env; // 环境参数
//    是否是生产环境
const isEnvProduction = NODE_ENV === 'production';
//   是否是测试开发环境
const isEnvDevelopment = NODE_ENV === 'development';
const ESLintPlugin = require('eslint-webpack-plugin');
const cacheLoader = (happypackId) => {
    return isEnvDevelopment
        ? [
              `happypack/loader?id=${happypackId}&cacheDirectory=true`,
              'thread-loader',
              'cache-loader',
          ]
        : [`happypack/loader?id=${happypackId}`];
};

// console.log('BrowserReloadPlugin=',BrowserReloadPlugin)

// 用户自定义webpack
module.exports = {
    module: {
        rules: [
            {
                test: /(\.tsx?$)|(\.ts?$)/,
                use: {
                    loader: path.join(
                        __dirname,
                        './defineLoader/MyExampleWebpackLoader.js'
                    ),
                    options: {},
                },
            },
            {
                test: /\.m?js$/,
                enforce: 'pre',
                // 排除文件,因为这些包已经编译过，无需再次编译
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: path.join(
                        __dirname,
                        './defineLoader/MyExampleWebpackLoader.js'
                    ),
                    options: {},
                },
            },
            {
                test: /\.js?$/,
                enforce: 'pre',
                // 排除文件,因为这些包已经编译过，无需再次编译
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: path.join(
                        __dirname,
                        './defineLoader/MyExampleWebpackLoader.js'
                    ),
                    options: {},
                },
            },
        ],
    },

    plugins: [
        // new ESLintPlugin({
        //     emitError: true, //发现的错误将始终被触发，将禁用设置为false。
        //     emitWarning: true, //如果将disable设置为false，则发现的警告将始终被发出。
        //     failOnError: true, //如果有任何错误，将导致模块构建失败，禁用设置为false。
        //     failOnWarning: false, //如果有任何警告，如果设置为true，将导致模块构建失败。
        //     quiet: false, //如果设置为true，将只处理和报告错误，而忽略警告。
        //     fix: true, //自动修复
        // }),

        // new BrowserReloadPlugin(),
        // new HelloWorldCheckerPlugin({ path: "toinspect.txt" }),
        // 自定义插件
        new MyExampleWebpackPlugin({
            // 出口
            outputPath: path.join(process.cwd(), '/app'),
        }),

        // 注入全局常量
        new ExtendedDefinePlugin({
            APP_CONFIG: {
                api_key: '1234567890ABCDEFG',
                fb_conf: {
                    use_social: true,
                    api_key: '123456790',
                },
            },
        }),
        /*
       如果我要在一个webpack打包覆盖的地方的xxx.js文件中用到react，该怎么做？
      通常来讲，我们会直接`import React from 'react'` 有很多很多js文件需要引入呢？一直引入吗？
      可以一直引入。同样会造成不必要的工作量。
       */
        new webpack.ProvidePlugin({
            React: 'react',
        }),

        // 他们两个有点类似
        // webpack.BannerPlugin 为每一个头文件添加一个文件，这里可以加入公共文件
        // source-map-support 源映射(Source Map)是一种数据格式，它存储了源代码和生成代码之间的位置映射关系。
        // new webpack.BannerPlugin({
        //   banner: 'require("source-map-support").install();',
        //   raw: true,
        //   entryOnly: false,
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
    ],
};
