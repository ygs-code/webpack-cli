const webpack = require('webpack');
const fs = require('fs');
// const htmllintLoader = require('htmllint-loader');
const StylelintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const ExtendedDefinePlugin = require('extended-define-webpack-plugin');
const HtmllinterWebpackPlugin = require('htmllinter-webpack-plugin');
const MyExampleWebpackPlugin = require('./definePlugin/MyExampleWebpackPlugin');
const os = require('os');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 });
const path = require('path');

let htmllinterConfig = {};
if (fs.existsSync(path.join(process.cwd(), './htmllinter.config.js'))) {
    htmllinterConfig = require(path.join(
        process.cwd(),
        './htmllinter.config.js'
    ));
}

const { resolve } = path;
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
const cacheLoader = (happypackId) => {
    return isEnvDevelopment
        ? [
              `happypack/loader?id=${happypackId}&cacheDirectory=true`,
              'thread-loader',
              'cache-loader',
          ]
        : ['thread-loader', `happypack/loader?id=${happypackId}`];
};

module.exports = {
    resolve: {
        // 路径配置
        alias: {
            // '@': path.join(process.cwd(), '/src'),
        },
    },
    module: {
        // loader
        rules: [
            //配置 https://github.com/robbiedigital/htmllint-loader
            // {
            //     test: /\.(htm|html|xhtml|hbs|handlebars|php|ejs)$/,
            //     // loader: path.join(
            //     //     __dirname,
            //     //     './defineLoader/MyExampleWebpackLoader.js'
            //     // ),
            //     loader: 'htmllint-loader',
            //     exclude: /(node_modules)/,
            //     options: {
            //         config: path.join(process.cwd(), '/.htmllintrc'),
            //         //   config: '.htmllintrc', // path to custom config file
            //         emitError: true, //发现的错误将始终被触发，将禁用设置为false。
            //         emitWarning: true, //如果将disable设置为false，则发现的警告将始终被发出。
            //         failOnError: true, //如果有任何错误，将导致模块构建失败，禁用设置为false。
            //         failOnWarning: false, //如果有任何警告，如果设置为true，将导致模块构建失败。
            //         quiet: false, //如果设置为true，将只处理和报告错误，而忽略警告。
            //     },
            // },
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
        // // he
        new HtmllinterWebpackPlugin({
            config: htmllinterConfig,
            // config: {
            //     extend: require('@htmllinter/basic-config'),
            //     rules: {
            //         'no-empty-tag': 'on',
            //         'no-duplicate-id': 'on',
            //         'no-duplicate-tag': 'on',
            //         'no-bool-true-explicit-define': 'on',
            //         'doctype-top': [
            //             'on',
            //             {
            //                 startingLineNumber: 1,
            //             },
            //         ],
            //         'long-line-content': 'on',
            //         'no-missing-alt': 'on',
            //         'newline-multiline-comments': 'on',
            //         'trailing-singleline-comments': 'on',
            //         'newline-eof': 'on',
            //     },
            // },
        }),
        // stylelint 插件
        new StylelintPlugin({
            emitError: true, //发现的错误将始终被触发，将禁用设置为false。
            emitWarning: true, //如果将disable设置为false，则发现的警告将始终被发出。
            failOnError: true, //如果有任何错误，将导致模块构建失败，禁用设置为false。
            failOnWarning: false, //如果有任何警告，如果设置为true，将导致模块构建失败。
            quiet: false, //如果设置为true，将只处理和报告错误，而忽略警告。
            // fix: true, //自动修复
        }),
        // eslint 插件
        new ESLintPlugin({
            emitError: true, //发现的错误将始终被触发，将禁用设置为false。
            emitWarning: true, //如果将disable设置为false，则发现的警告将始终被发出。
            failOnError: true, //如果有任何错误，将导致模块构建失败，禁用设置为false。
            failOnWarning: false, //如果有任何警告，如果设置为true，将导致模块构建失败。
            quiet: false, //如果设置为true，将只处理和报告错误，而忽略警告。
            fix: true, //自动修复
        }),

        // new HappyPack({
        //   id: "MyExampleWebpackLoader",
        //   use: [  //添加loader
        //     {
        //       loader: path.join(
        //         __dirname,
        //         "./defineLoader/MyExampleWebpackLoader.js"
        //       ),
        //       options: {
        //         name: "graphql",
        //       },
        //     },
        //     // "raw-loader",
        //   ],
        //   // 输出执行日志
        //   verbose: true,
        //   // 使用共享线程池
        //   threadPool: happyThreadPool,
        // }),

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
    ],
};
