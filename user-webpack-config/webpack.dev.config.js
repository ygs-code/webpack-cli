/*
 * @Date: 2022-04-27 20:24:09
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-27 20:47:03
 * @FilePath: /webpackClient1/user-webpack-config/webpack.dev.config.js
 * @Description:
 */

// 用户自定义webpack
export default {
  devServer: {
    output: {
      publicPath: "/", // 静态资源文件公开目录
    },
    liveReload: false, // 编译之后是否自动刷新浏览器
    // 代理 支持对象或者数组配置化
    proxy: [
      {
        context: ["/api/v1/common/upload/"],
        target: "https://webpack.docschina.org/",
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
};
