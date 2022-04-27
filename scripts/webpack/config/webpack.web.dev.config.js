/*
 * @Date: 2022-04-24 16:41:06
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-26 14:45:32
 * @FilePath: /webpackClient/scripts/webpack/config/webpack.web.dev.config.js
 * @Description:
 */
import HtmlWebpackPlugin from "html-webpack-plugin";
import path, { resolve } from "path";

 

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
  devServer: {
    static: {
      directory: path.join(__dirname, "../../dist"),
      watch: true,
    },
    index: path.resolve(__dirname, '../../dist/index.html'), // dist/index 主页面 
    contentBase: path.join(__dirname, "../../dist"), //访问主页的界面 目录
    port: 8080, // 开启服务器的端口
    open: true, // 是否开启在浏览器中打开
    host: getIPAdress(), //获取本机地址
    // // quiet:false,  //不要把任何东西输出到控制台。
    // // contentBase: "./public",//本地服务器所加载的页面所在的目录就是index.html 和moduel 不在同一个页面
    // // noInfo:true, //压制无聊信息。 //控制台不输出无聊信息
    // open:true, //启动的时候是否自动打开浏览器
    // port: 8089,  //端口
    // compress:true,//http 使用gzip压缩
    // hot: true,  // --inline还增加了WebPACK /热/开发服务器入口
    // inline: true,//实时刷新 可以监控js变化
    // historyApiFallback: true,//不跳转启用对历史API回退的支持。

    // proxy: {
    //   "/api": {
    //     target: "http://XX.XX.XX.XX:8084",
    //     changeOrigin: true,
    //     ws: true,
    //     pathRewrite: {
    //       "^/api": "",
    //     }
    //   }
    // }

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
  plugins: [
    // html静态页面
    new HtmlWebpackPlugin({
      title: "rd平台",
      // path.join(process.cwd(), "/src/index.js")
      template: path.join(process.cwd(), 
        "/public/index.html" // 源模板文件
      ),
      filename: "index.html", // 输出文件【注意：这里的根路径是module.exports.output.path】
      hash: true,
    }),
  ],
};

// console.log()