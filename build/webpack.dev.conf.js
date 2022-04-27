/*
 * @Date: 2022-04-26 16:35:35
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-27 18:36:55
 * @FilePath: /webpackClient1/build/webpack.dev.conf.js
 * @Description:
 */
//路径解析
var path = require("path");
// 路径解析,还有个是css方案，是否需要压缩
var utils = require("./utils");
//引入webpack 模块
var webpack = require("webpack");
//配置dev或者build 环境基本参数
var config = require("../config");
//合并
var { merge } = require("webpack-merge");

//css方案配置
var baseWebpackConfig = require("./webpack.base.conf");
//多页面配置插件
var HtmlWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
//友好的错误WebPACK插件 错误提示插件
var FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
//glob 获取目录下面所有文件
var glob = require("glob");

// console.log('=============baseWebpackConfig.entry==============')
// console.log(baseWebpackConfig.entry)
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  //在所有js中 添加WebPACK热中间件  https://www.npmjs.com/package/webpack-hot-middleware
  baseWebpackConfig.entry[name] = ["./build/dev-client"].concat(
    baseWebpackConfig.entry[name]
  );
});
console.log('=============baseWebpackConfig.entry==============')
console.log(baseWebpackConfig.entry)

//就像拷贝一样
// console.log('==============baseWebpackConfig=================')
// console.log(baseWebpackConfig)
//合并 baseWebpackConfig 文件配置

let devConfig = merge(baseWebpackConfig, {
  // module: {
  //   // css  load styleLoaders  //loader css
  //   rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap }),
  // },
  // cheap-module-eval-source-map is faster for development
  // debtool是开发工具选项，用来指定如何生成sourcemap文件，cheap-module-eval-source-map此款soucemap文件性价比最高
  // devtool: "#cheap-module-eval-source-map",
  devtool: "source-map", // 生产环境和开发环境判断
  plugins: [
    // DefinePlugin内置webpack插件，专门用来定义全局变量的，下面定义一个全局变量 process.env 并且值是如下
    /*  'process.env': {
            NODE_ENV: '"development"'
        } 这样的形式会被自动转为
        'process.env': '"development"'
        各位骚年看好了，development如果不加双引号就当做变量处理，程序会报错
    */
    new webpack.DefinePlugin({
      "process.env": config.dev.env,
    }),
    //   // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(), //模块热替换
    new webpack.NoEmitOnErrorsPlugin(), //NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误
    //   // 使用FriendlyErrorsPlugin插件，介绍过了，这个插件的其他细节还设置在dev-server-js文件中
    new FriendlyErrorsPlugin(), //友好的错误认识webpackerrors WebPACK插件类  这是很容易添加类型的错误，所以如果你想看moreerrors得到处理
    //  // inject: true  //-> 设置为true表示把所有的js文件都放在body标签的屁股
  ],
});

// console.log('==============devConfig=================')
// console.log(devConfig)

//获取html文件
let pages = ((globalPath) => {
  let htmlFiles = {},
    pageName;

  glob.sync(globalPath).forEach((pagePath) => {
    var basename = path.basename(pagePath, path.extname(pagePath));
    pageName = basename;
    htmlFiles[pageName] = {};
    htmlFiles[pageName]["chunk"] = basename;
    htmlFiles[pageName]["path"] = pagePath;
  });
  return htmlFiles;
})(utils.resolve("src") + "/modules/**/*.html");

//多页面生成
for (let entryName in pages) {
  // console.log("entryName==", entryName);
  // console.log("pages[entryName]==", pages[entryName]);
  let conf = {
    // 生成出来的html文件名
    filename: entryName + ".html",
    // 每个html的模版，这里多个页面使用同一个模版
    template: pages[entryName]["path"],
    // 自动将引用插入html
    inject: true,
    // 每个html引用的js模块，也可以在这里加上vendor等公用模块
    chunks: ["vendor", "manifest", pages[entryName]["chunk"]],
  };
  /*入口文件对应html文件（配置多个，一个页面对应一个入口，通过chunks对应）*/
  // devConfig.plugins.push(new HtmlWebpackPlugin(conf));
}

// path.join(process.cwd(), "/src/index.js");

devConfig.plugins.push(
  new HtmlWebpackPlugin({
    title: "Custom template using Handlebars",
    // 生成出来的html文件名
    filename: "index.html",
    // 每个html的模版，这里多个页面使用同一个模版
    template: path.join(process.cwd(), "/public/index.html"),
    // 自动将引用插入html
    inject: true,
    // 每个html引用的js模块，也可以在这里加上vendor等公用模块
    // chunks: [
    //   "vendor",
    //   "manifest",
    //   "index",
    //   // "static/vendor.dll",
    //   // "static/vendor.manifest",
    // ],
  })
);

// devConfig.plugins.push(
//   new AddAssetHtmlPlugin(
//     // { filepath: require.resolve('./some-file') },
//     // { filepath: require.resolve('./some-other-file') },
//     // Glob to match all of the dll file, make sure to use forward slashes on Windows
//     {
//       outputPath: path.join(process.cwd(), "/dist/static/vendor.dll.js"),
//       filepath: path.join(process.cwd(), "/dist/static/vendor.dll.js"),
//     }
//   )
// );

//导出模块
module.exports = devConfig;
