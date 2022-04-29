// //node 路径解析
// var path = require('path')

//  //utils.js工具配置文件详解    路径解析,还有个是css方案，是否需要压缩
// var utils = require('../../utils')
// //webpack 工具
// var webpack = require('webpack')
// //webpack 配置 是dev开发和build开发参数
// var config = require('../config')

// var {merge} = require('webpack-merge')  //合并
// //基本参数配置
// var baseWebpackConfig = require('./webpack.base.conf')
// //复制WebPACK插件
// //复制单个文件或整个目录生成目录。
// var CopyWebpackPlugin = require('copy-webpack-plugin')
// //HTML webpack -插件 可用于制作多页面
// var HtmlWebpackPlugin = require('html-webpack-plugin')
// const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
// //提取文本的插件
// //提取文本从一束，或捆绑到一个单独的文件。
// var ExtractTextPlugin = require('extract-text-webpack-plugin')
// //解决了提取文本WebPACK插件CSS复制的问题：
// //自提取文本WebPACK插件只有束（合并）的文本块，如果用来捆束的CSS，可能有重复的条目（块可以复制自由但当合并，重复的CSS可以创建）。
// //http://npm.taobao.org/package/optimize-css-assets-webpack-plugin
// var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
// //glob 对象获取文件夹 所有目录下的 文件
// var glob = require('glob');
// //
// var env = config.build.env //NODE_ENV: '"production"'
// //合并参数
// var webpackConfig = merge(baseWebpackConfig, {
//   // module: {
//   //   rules: utils.styleLoaders({
//   //     sourceMap: config.build.productionSourceMap,
//   //     extract: true
//   //   })
//   // },
//   devtool: config.build.productionSourceMap ? '#source-map' : false,
//   output: {
//     path: config.build.assetsRoot, //服务器访问的路劲
//     filename: utils.assetsPath('js/[name].[chunkhash].js'), //文件出口
//     chunkFilename: utils.assetsPath('js/[id].[chunkhash].js') //加has 动态码
//   },
//   plugins: [
//     // http://vuejs.github.io/vue-loader/en/workflow/production.html
//     //设置全局变量
//     new webpack.DefinePlugin({
//       'process.env': env
//     }),
//     // UglifyJsPlugin插件是专门用来压缩js文件的
//     // new webpack.optimize.UglifyJsPlugin({
//     //   compress: {
//     //     warnings: false
//     //   },
//     //   // 压缩后生成map文件
//     //   sourceMap: true
//     // }),
//     // extract css into its own file
//     // new ExtractTextPlugin({
//     //   // 生成独立的css文件，下面是生成独立css文件的名称
//     //   filename: utils.assetsPath('css/[name].[contenthash].css')
//     // }),
//     // // Compress extracted CSS. We are using this plugin so that possible
//     // // duplicated CSS from different components can be deduped.
//     // new OptimizeCSSPlugin({
//     //   // 压缩css文件
//     //   cssProcessorOptions: {
//     //     safe: true
//     //   }
//     // }),
//     // split vendor js into its own file
//     // new webpack.optimize.CommonsChunkPlugin({
//     //   name: 'vendor',
//     //   minChunks: function (module, count) {
//     //     // any required modules inside node_modules are extracted to vendor
//     //     // 下面的插件是将打包后的文件中的第三方库文件抽取出来，便于浏览器缓存，提高程序的运行速度
//     //     return (
//     //       module.resource &&
//     //       /\.js$/.test(module.resource) &&
//     //       module.resource.indexOf(
//     //         path.join(__dirname, '../node_modules')
//     //       ) === 0
//     //     )
//     //   }
//     // }),
//     // extract webpack runtime and module manifest to its own file in order to
//     // prevent vendor hash from being updated whenever app bundle is updated
//     // 把webpack的runtime代码和module manifest代码提取到manifest文件中，防止修改了代码但是没有修改第三方库文件导致第三方库文件也打包的问题
//     // new webpack.optimize.CommonsChunkPlugin({
//     //   name: 'manifest',
//     //   chunks: ['vendor']
//     // }),
//     // copy custom static assets
//     // 下面是复制文件的插件，我认为在这里并不是起到复制文件的作用，而是过滤掉打包过程中产生的以.开头的文件
//     // new CopyWebpackPlugin([
//     //   {
//     //     from: path.resolve(__dirname, '../static'),
//     //     to: config.build.assetsSubDirectory,
//     //     ignore: ['.*']
//     //   }
//     // ])
//   ]
// })

// // console.log('==============webpackConfig=======================')
// // console.log(webpackConfig)

// if (config.build.productionGzip) {
//   var CompressionWebpackPlugin = require('compression-webpack-plugin')
// // 开启Gzi压缩打包后的文件，老铁们知道这个为什么还能压缩吗？？，就跟你打包压缩包一样，把这个压缩包给浏览器，浏览器自动解压的
//   // 你要知道，vue-cli默认将这个神奇的功能禁用掉的，理由是Surge 和 Netlify 静态主机默认帮你把上传的文件gzip了
//   webpackConfig.plugins.push(
//     new CompressionWebpackPlugin({
//       asset: '[path].gz[query]',
//       algorithm: 'gzip',
//       test: new RegExp( // 这里是把js和css文件压缩
//         '\\.(' +
//         config.build.productionGzipExtensions.join('|') +
//         ')$'
//       ),
//       threshold: 10240,
//       minRatio: 0.8
//     })
//   )
// }

// if (config.build.bundleAnalyzerReport) {
//   // 打包编译后的文件打印出详细的文件信息，vue-cli默认把这个禁用了，个人觉得还是有点用的，可以自行配置
//   var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
//   webpackConfig.plugins.push(new BundleAnalyzerPlugin())
// }

// //多页面生成
// let pages = ((globalPath)=>{
//   let htmlFiles = {},
//     pageName;

//   glob.sync(globalPath).forEach((pagePath)=>{
//     var basename = path.basename(pagePath, path.extname(pagePath));
//     pageName = basename;
//     //page name
//     htmlFiles[pageName] = {};
//     htmlFiles[pageName]['chunk'] = basename;
//     htmlFiles[pageName]['path'] = pagePath;

//   });
//   return htmlFiles;
//   //获取src下面路径的所有html
// })(utils.resolve('src')+'/modules/**/*.html');

// // for (let entryName in pages) {
// //   console.log('entryName=',entryName)
// //   let conf = {
// //     // 生成出来的html文件名
// //     filename: entryName + '.html',
// //     // 每个html的模版，这里多个页面使用同一个模版
// //     template: pages[entryName]['path'],
// //     // 自动将引用插入html
// //     inject: true,
// //     minify: { //是否要压缩
// //       removeComments: true,
// //       collapseWhitespace: true,
// //       removeAttributeQuotes: true
// //       // more options:
// //       // https://github.com/kangax/html-minifier#options-quick-reference
// //     },
// //     // necessary to consistently work with multiple chunks via CommonsChunkPlugin
// //     chunksSortMode: 'dependency'
// //   };
// //   /*入口文件对应html文件（配置多个，一个页面对应一个入口，通过chunks对应）*/
// //   webpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
// // }

// webpackConfig.plugins.push(
//   new HtmlWebpackPlugin({
//     // 生成出来的html文件名
//     filename: "index.html",
//     // 每个html的模版，这里多个页面使用同一个模版
//     template: path.join(process.cwd(), "/public/index.html"),
//     // 自动将引用插入html
//     inject: true,
//     // 每个html引用的js模块，也可以在这里加上vendor等公用模块
//     chunks: ["vendor", "manifest", "index",'vendor.dll','vendor.manifest'],
//   })
// );

// webpackConfig.plugins.push(new AddAssetHtmlPlugin([
//   // { filepath: require.resolve('./some-file') },
//   // { filepath: require.resolve('./some-other-file') },
//   // Glob to match all of the dll file, make sure to use forward slashes on Windows
//   { glob:  path.join(process.cwd(), "/dist/static/*.dll.js") },
// ]))

// module.exports = webpackConfig;

// /*
//  * @Date: 2022-04-26 16:35:35
//  * @Author: Yao guan shou
//  * @LastEditors: Yao guan shou
//  * @LastEditTime: 2022-04-27 10:13:16
//  * @FilePath: /webpackClient1/build/webpack.dev.conf.js
//  * @Description:
//  */
// //路径解析
// var path = require("path");
// // 路径解析,还有个是css方案，是否需要压缩
// var utils = require("./utils");
// //引入webpack 模块
// var webpack = require("webpack");
// //配置dev或者build 环境基本参数
// var config = require("../config");
// //合并
// var { merge } = require("webpack-merge");

// //css方案配置
// var baseWebpackConfig = require("./webpack.base.conf");
// //多页面配置插件
// var HtmlWebpackPlugin = require("html-webpack-plugin");
// const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
// //友好的错误WebPACK插件 错误提示插件
// var FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
// //glob 获取目录下面所有文件
// var glob = require("glob");

// // console.log('=============baseWebpackConfig.entry==============')
// // console.log(baseWebpackConfig.entry)
// // add hot-reload related code to entry chunks
// Object.keys(baseWebpackConfig.entry).forEach(function (name) {
//   //在所有js中 添加WebPACK热中间件  https://www.npmjs.com/package/webpack-hot-middleware
//   baseWebpackConfig.entry[name] = ["./build/dev-client"].concat(
//     baseWebpackConfig.entry[name]
//   );
// });
// // console.log('=============baseWebpackConfig.entry==============')
// // console.log(baseWebpackConfig.entry)

// //就像拷贝一样
// // console.log('==============baseWebpackConfig=================')
// // console.log(baseWebpackConfig)
// //合并 baseWebpackConfig 文件配置

// let devConfig = merge(baseWebpackConfig, {
//   // module: {
//   //   // css  load styleLoaders  //loader css
//   //   rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap }),
//   // },
//   // cheap-module-eval-source-map is faster for development
//   // debtool是开发工具选项，用来指定如何生成sourcemap文件，cheap-module-eval-source-map此款soucemap文件性价比最高
//   // devtool: "#cheap-module-eval-source-map",
//   devtool: "source-map", // 生产环境和开发环境判断
//   plugins: [
//     // DefinePlugin内置webpack插件，专门用来定义全局变量的，下面定义一个全局变量 process.env 并且值是如下
//     /*  'process.env': {
//             NODE_ENV: '"development"'
//         } 这样的形式会被自动转为
//         'process.env': '"development"'
//         各位骚年看好了，development如果不加双引号就当做变量处理，程序会报错
//     */
//     new webpack.DefinePlugin({
//       "process.env": config.dev.env,
//     }),
//     //   // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
//     new webpack.HotModuleReplacementPlugin(), //模块热替换
//     new webpack.NoEmitOnErrorsPlugin(), //NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误
//     //   // 使用FriendlyErrorsPlugin插件，介绍过了，这个插件的其他细节还设置在dev-server-js文件中
//     new FriendlyErrorsPlugin(), //友好的错误认识webpackerrors WebPACK插件类  这是很容易添加类型的错误，所以如果你想看moreerrors得到处理
//     //  // inject: true  //-> 设置为true表示把所有的js文件都放在body标签的屁股
//   ],
// });

// // console.log('==============devConfig=================')
// // console.log(devConfig)

// //获取html文件
// let pages = ((globalPath) => {
//   let htmlFiles = {},
//     pageName;

//   glob.sync(globalPath).forEach((pagePath) => {
//     var basename = path.basename(pagePath, path.extname(pagePath));
//     pageName = basename;
//     htmlFiles[pageName] = {};
//     htmlFiles[pageName]["chunk"] = basename;
//     htmlFiles[pageName]["path"] = pagePath;
//   });
//   return htmlFiles;
// })(utils.resolve("src") + "/modules/**/*.html");

// //多页面生成
// for (let entryName in pages) {
//   // console.log("entryName==", entryName);
//   // console.log("pages[entryName]==", pages[entryName]);
//   let conf = {
//     // 生成出来的html文件名
//     filename: entryName + ".html",
//     // 每个html的模版，这里多个页面使用同一个模版
//     template: pages[entryName]["path"],
//     // 自动将引用插入html
//     inject: true,
//     // 每个html引用的js模块，也可以在这里加上vendor等公用模块
//     chunks: ["vendor", "manifest", pages[entryName]["chunk"]],
//   };
//   /*入口文件对应html文件（配置多个，一个页面对应一个入口，通过chunks对应）*/
//   // devConfig.plugins.push(new HtmlWebpackPlugin(conf));
// }

// // path.join(process.cwd(), "/src/index.js");

// devConfig.plugins.push(
//   new HtmlWebpackPlugin({
//     title: "Custom template using Handlebars",
//     // 生成出来的html文件名
//     filename: "index.html",
//     // 每个html的模版，这里多个页面使用同一个模版
//     template: path.join(process.cwd(), "/public/index.html"),
//     // 自动将引用插入html
//     inject: true,
//     // 每个html引用的js模块，也可以在这里加上vendor等公用模块
//     // chunks: [
//     //   "vendor",
//     //   "manifest",
//     //   "index",
//     //   // "static/vendor.dll",
//     //   // "static/vendor.manifest",
//     // ],
//   })
// );

// // devConfig.plugins.push(
// //   new AddAssetHtmlPlugin(
// //     // { filepath: require.resolve('./some-file') },
// //     // { filepath: require.resolve('./some-other-file') },
// //     // Glob to match all of the dll file, make sure to use forward slashes on Windows
// //     {
// //       outputPath: path.join(process.cwd(), "/dist/static/vendor.dll.js"),
// //       filepath: path.join(process.cwd(), "/dist/static/vendor.dll.js"),
// //     }
// //   )
// // );

// //导出模块
// module.exports = devConfig;

/*
 * @Date: 2022-04-24 11:07:22
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-26 13:58:07
 * @FilePath: /webpackClient/scripts/webpack/config/webpack.dev.config.js
 * @Description:
 */
import path from "path";
import webpack from "webpack";
import nodeExternals from "webpack-node-externals";
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
  watch: true,
  optimization: {
    // 压缩
    minimize: false,
    minimizer: [],
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
