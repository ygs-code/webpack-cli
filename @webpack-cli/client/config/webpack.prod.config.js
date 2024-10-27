/*
 * @Date: 2022-04-29 18:16:58
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-06-01 18:29:06
 * @FilePath: /webpack-cli/@webpack-cli/client/config/webpack.prod.config.js
 * @Description:
 */
require('@babel/polyfill');
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HappyPack = require('happypack');
const CopyPlugin = require('copy-webpack-plugin');
const { ESBuildPlugin, ESBuildMinifyPlugin } = require('esbuild-loader');
const os = require('os');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const {
    NODE_ENV, // 环境参数
    WEB_ENV, // 环境参数
    target, // 环境参数
} = process.env; // 环境参数

//    是否是生产环境
const isEnvProduction = NODE_ENV === 'production';

//   是否是测试开发环境
const isEnvDevelopment = NODE_ENV === 'development';
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 });
const cacheLoader = (happypackId) => {
    return isEnvDevelopment
        ? [
              // `happypack/loader?id=${happypackId}`,
              `happypack/loader?id=${happypackId}&cacheDirectory=true`,
              'thread-loader',
              'cache-loader',
          ]
        : [`happypack/loader?id=${happypackId}`];
};

module.exports = {
    mode: 'production',
    output: {
        publicPath: './', // dev 服务器需要是绝对，而编译出来需要是相对
        // 如果一个模块是在 require 时抛出异常，告诉 webpack 从模块实例缓存(require.cache)中删除这个模块。
        // 并且重启webpack的时候也会删除cache缓存
        strictModuleExceptionHandling: true,
    },
    watch: false,

    // 打包文件大小监听
    performance: {
        maxEntrypointSize: 1024 * 512, // 设置最大输入512kb的文件，如果大于他则发出警告
        maxAssetSize: 1024 * 50, // 设置最大打包输出50kb的文件，如果大于他则发出警告
        hints: 'warning',
        // 过滤文件
        assetFilter: function (assetFilename) {
            // console.log('assetFilename==========', assetFilename,assetFilename.endsWith('.js'))
            // 只要监听js文件，过滤其他文件判断
            return assetFilename.endsWith('.js');
        },
    },

    optimization: {
        // 压缩
        minimize: true,
        minimizer: [
            // 配置生产环境的压缩方案：js和css
             // 由Terser将未使用的函数, 从我们的代码中删除
            new TerserWebpackPlugin({
                extractComments: "all", // 删除注释
                terserOptions: {
                    compress: {
                        drop_console: false, // 默认false，设置为true, 则会删除所有console.* 相关的代码。
                        pure_funcs: ['console.log'], // 单纯禁用console.log
                    },
                },
            }),
            new CssMinimizerPlugin(),
            new ESBuildMinifyPlugin({
                target: 'es2015', // Syntax to compile to (see options below for possible values)
                css: true,
            }),
        ],
        //  任何字符串：用于设置 process.env.NODE_ENV 的值。
        nodeEnv: 'production',
        moduleIds: 'named',
        chunkIds: 'named',
        // 开启这个编译包更小
        // runtimeChunk: {
        //   name: (entrypoint) => `runtime~${entrypoint.name}`,
        // },
        runtimeChunk: 'single',
        // 打包大小拆包
        splitChunks: {
            // 最大超过多少就要拆分
            maxSize: 50 * 1024, //大小超过150*1024个字节 150kb 就要拆分
            // // 最小多少被匹配拆分
            minSize: 20 * 1024, //大小超过 50*1024个字节  50kb 就要拆分
            enforceSizeThreshold: 102400,
            name: false,
            chunks: 'all',
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 50,
            maxInitialRequests: 50,
            automaticNameDelimiter: '~',
            cacheGroups: {
                // vendor: {
                //     //第三方依赖
                //     priority: 1, //设置优先级，首先抽离第三方模块
                //     name: 'vendor',
                //     test: /node_modules/,
                //     chunks: 'initial',
                //     minSize: 0,
                //     minChunks: 1, //最少引入了1次
                // },
                // //缓存组
                // common: {
                //     //公共模块
                //     chunks: 'initial',
                //     name: 'common',
                //     minSize: 1000, //大小超过1000个字节
                //     minChunks: 3, //最少引入了3次
                // },
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                    // minSize: 100, //大小超过1000个字节
                    minChunks: 1, //最少引入了1次
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
        // Chunk end
    },
    devtool: 'source-map', // 生产环境和开发环境判断
    module: {
        rules: [
            // js和jsx编译
            {
                test: /(\.m?js$)|(\.jsx?$)/,
                // enforce: 'pre',
                // 排除文件,因为这些包已经编译过，无需再次编译
                exclude: /(node_modules|bower_components)/,
                use: ['source-map-loader'].concat(cacheLoader('babel')),
                // use: {
                //  loader: "babel-loader",
                //   options: {
                //     presets: ["@babel/preset-env"],
                //     plugins: ["@babel/plugin-transform-runtime"],
                //   },
                // },
            },
            // css
            {
                test: /\.css$/i,
                // 排除文件,因为这些包已经编译过，无需再次编译
                exclude: /(node_modules|bower_components)/,
                use: [
                    // 'thread-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        'autoprefixer',
                                        {
                                            // Options
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                ],
            },
            //   less
            {
                test: /\.less$/i,
                use: [
                    // 'thread-loader',
                    // compiles Less to CSS
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        'autoprefixer',
                                        {
                                            // Options
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                ],
            },

            //  scss
            // {
            //     test: /\.s[ac]ss$/i,
            //     use: [
            //         // 'thread-loader',
            //         MiniCssExtractPlugin.loader,
            //         // Translates CSS into CommonJS
            //         'css-loader',
            //         // Compiles Sass to CSS
            //         // 'sass-loader',
            //         {
            //             loader: 'sass-loader',
            //             options: {
            //                 // Prefer `dart-sass`
            //                 implementation: require('sass'),
            //                 sourceMap: true,
            //             },
            //         },
            //         {
            //             loader: 'postcss-loader',
            //             options: {
            //                 postcssOptions: {
            //                     plugins: [
            //                         [
            //                             'autoprefixer',
            //                             {
            //                                 // Options
            //                             },
            //                         ],
            //                     ],
            //                 },
            //             },
            //         },
            //     ],
            // },
        ],
    },
    plugins: [
        // gzip 压缩
        new CompressionWebpackPlugin({
            filename: '[path][base].gz',
            algorithm: 'gzip',
            test: /\.(js|css|json|html|svg)(\?.*)?$/i,
            threshold: 10240, // 大于10kb的才被压缩
            minRatio: 0.8, //压缩比例
        }),

        // 复制
        new CopyPlugin({
            patterns: [
                {
                    from: path
                        .join(process.cwd(), '/static/**/*')
                        .replace(/\\/gi, '/'),
                    to: path.join(process.cwd(), 'dist').replace(/\\/gi, '/'),
                },
            ],
        }),
        //清理编译目录
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
            //配置清理文件 如果不清理则加 ！
            cleanOnceBeforeBuildPatterns: ['*', '!dll*'],
            // cleanOnceBeforeBuildPatterns: [
            //   "index.html",
            //   "**/index*.js",
            //   "**/index*.css",
            // !./image/*
            // ],
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'static/css/[name].[contenthash:8].css',
            chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        }),
        new HappyPack({
            id: 'babel',
            //添加loader
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        // cacheDirectory: true,
                    },
                },
            ],

            // use: ["babel-loader", "unicode-loader"],
            // 输出执行日志
            // verbose: true,
            // 使用共享线程池
            threadPool: happyThreadPool,
        }),
    ],
};
