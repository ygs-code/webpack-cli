/*
 * @Date: 2022-04-26 16:35:35
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-27 16:03:23
 * @FilePath: /webpackClient1/build/webpack.base.conf.js
 * @Description:
 */
var webpack = require("webpack");
//路径解析
var path = require("path");
//路径解析与解析css模块
var utils = require("./utils");
//dev与build 开发模式基本参数配置
var config = require("../config");
var WebpackBuildDllPlugin = require("webpack-build-dll-plugin");
var DllReferencePlugin = require("webpack/lib/DllReferencePlugin");
var vueLoaderConfig = require("./vue-loader.conf");
// var buildEntries = require('./build-entries')

module.exports = {
  // entry: buildEntries, //js文件入口
  // 入口
  entry: {
    // myVue: [path.join(process.cwd(), "/src/myVue.js")], // 公共包抽取
    vendor: ["vue", "react"],
    index: [
      // "@babel/polyfill",
      //添加编译缓存
      // "webpack/hot/poll?1000",
      //  path.join(process.cwd(), "/src/index.js")
      //入口主文件
      path.join(process.cwd(), "/src/index.js"), // 如果没有配置 context 则需要这样引入  path.join(__dirname, "../../src/index.js")
    ],
  },

  output: {
    // path: config.build.assetsRoot, //编译后文件的存放目录 出口
    // filename: "[name].js", //js文件
    publicPath:
      process.env.NODE_ENV === "production"
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath, //js访问路径

    path: config.build.assetsRoot, //服务器访问的路劲
    filename: utils.assetsPath("js/[name].[chunkhash].js"), //文件出口
    chunkFilename: utils.assetsPath("js/[id].[chunkhash].js"), //加has 动态码
  },
  resolve: {
    // extensions: ['.js', '.vue', '.json'],
    alias: {
      // '@': utils.resolve('src'),  //缩写
      // 'common': utils.resolve('src/common'),
      // 'components': utils.resolve('src/components'),
      // 'api': utils.resolve('src/api')
    },
  },

  plugins: [
    // dll start dll配置 在服务端 DllPlugin 用不了没办法加载js, 只有客户端才能用
    // 运行DllPlugin配置文件
    // new WebpackBuildDllPlugin({
    //   // dllConfigPath: required, your Dll Config Path, support absolute path.
    //   dllConfigPath: path.join(__dirname, "./webpack.dll.config.js"),
    //   forceBuild: false,
    // }),

    // // //    告诉webpack使用了哪些第三方库代码
    // new webpack.DllReferencePlugin({
    //   // react 映射到json文件上去
    //   manifest: path.join(
    //     process.cwd(),
    //     "/dist/static",
    //     "vendor.manifest.json"
    //   ),
    // }),

    //DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用
    // 如果是配置前端就很好注入插件
    new webpack.DefinePlugin({
      //也可以注入插件 能 注入vue 但是不能注入 Koa
      // vue,
      //不能注入 Koa
      // Koa,
      //注入一个环境变量
      "process.env": { BUILD_TARGET: "BUILD_TARGET" },
    }),

    // dll end dll配置
  ],

  // module: {
  //   // rules: [
  //   //   {
  //   //     test: /\.(js|vue)$/, //编译vue文件
  //   //     loader: 'eslint-loader',
  //   //     enforce: 'pre',
  //   //     include: [utils.resolve('src')],
  //   //     options: {
  //   //       formatter: require('eslint-friendly-formatter')
  //   //     }
  //   //   },
  //   //   {
  //   //     test: /\.vue$/,
  //   //     loader: 'vue-loader',
  //   //     options: vueLoaderConfig
  //   //   },
  //   //   {
  //   //     test: /\.js$/,
  //   //     loader: 'babel-loader',
  //   //     include: [utils.resolve('src')]
  //   //   },
  //   //   {
  //   //     test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  //   //     loader: 'url-loader',
  //   //     options: {
  //   //       limit: 10000,
  //   //       name: utils.assetsPath('img/[name].[hash:7].[ext]')
  //   //     }
  //   //   },
  //   //   {
  //   //     test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
  //   //     loader: 'url-loader',
  //   //     options: {
  //   //       limit: 10000,
  //   //       name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
  //   //     }
  //   //   },
  //   //   {
  //   //     test:/\.css$/,
  //   //       loader:['style-loader','css-loader']
  //   //       },
  //   //   {
  //   //     test: /\.less$/,
  //   //     use: [
  //   //       'style-loader',
  //   //       { loader: 'css-loader', options: { importLoaders: 1 } },
  //   //       'less-loader'
  //   //     ]
  //   //   }
  //   // ]
  // }
};
