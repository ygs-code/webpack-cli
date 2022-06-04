/*
 * @Date: 2022-04-27 20:24:09
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-12 19:36:35
 * @FilePath: /webpack-cli/user-webpack-config/webpack.dev.config.js
 * @Description:
 */
const os = require('os');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 });
const path = require('path');
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

// 用户自定义webpack
module.exports = {
    module: {
        rules: [],
    },
    devServer: {
        output: {
            publicPath: '/', // 静态资源文件公开目录
        },
        liveReload: false, // 编译之后是否自动刷新浏览器
        writeToDisk: false, // 写入硬盘
        // devMiddleware: { // 一个开发环境的中间件
        //   writeToDisk: true, // 写入硬盘
        // },

        // 代理 支持对象或者数组配置化
        proxy: [
            {
                context: ['/api/v1/common/upload/'],
                target: 'https://webpack.docschina.org/',
                changeOrigin: true,
                secure: false,
                // pathRewrite: {
                //   "^/api/v1/common/upload/": "/",
                // },
            },
        ],

        // proxy: [
        //   {
        //     context: ["/api/v1/common/upload/"],
        //     target: "http://192.168.148.191:9091/",
        //     changeOrigin: true,
        //     secure: false,
        //     pathRewrite: {
        //       "^/api/v1/common/upload/": "/",
        //     },
        //   },

        //   // {
        //   //   context: ['/api/v1/scrm-marketing/full/draw/shop'],
        //   //   target: 'http://192.168.198.58:8120',
        //   //   changeOrigin: true,
        //   //   secure: false,
        //   //   // pathRewrite: {
        //   //   //   '^/api/v1/scrm-member/': '/'
        //   //   // },
        //   // },

        //   {
        //     context: ["/api/"],
        //     target: "https://sit-hlj.rainbowcn.com/",
        //     changeOrigin: true,
        //     secure: false,
        //   },
        //   // {
        //   //   context: ['/api/productActivities/getShoppe/'],
        //   //   target: 'http://192.168.213.183:9731/',
        //   //   changeOrigin: true,
        //   //   secure: false,
        //   //   pathRewrite: { '/api/productActivities/getShoppe': '/productActivities/getShoppe' },
        //   // },
        // ],
    },
    plugins: [],
};
