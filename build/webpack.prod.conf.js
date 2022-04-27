//node 路径解析
var path = require('path')

 //utils.js工具配置文件详解    路径解析,还有个是css方案，是否需要压缩
var utils = require('./utils')
//webpack 工具
var webpack = require('webpack')
//webpack 配置 是dev开发和build开发参数
var config = require('../config')

var {merge} = require('webpack-merge')  //合并
//基本参数配置
var baseWebpackConfig = require('./webpack.base.conf')
//复制WebPACK插件
//复制单个文件或整个目录生成目录。
var CopyWebpackPlugin = require('copy-webpack-plugin')
//HTML webpack -插件 可用于制作多页面
var HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
//提取文本的插件
//提取文本从一束，或捆绑到一个单独的文件。
var ExtractTextPlugin = require('extract-text-webpack-plugin')
//解决了提取文本WebPACK插件CSS复制的问题：
//自提取文本WebPACK插件只有束（合并）的文本块，如果用来捆束的CSS，可能有重复的条目（块可以复制自由但当合并，重复的CSS可以创建）。
//http://npm.taobao.org/package/optimize-css-assets-webpack-plugin
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
//glob 对象获取文件夹 所有目录下的 文件
var glob = require('glob');
//
var env = config.build.env //NODE_ENV: '"production"'
//合并参数
var webpackConfig = merge(baseWebpackConfig, {
  // module: {
  //   rules: utils.styleLoaders({
  //     sourceMap: config.build.productionSourceMap,
  //     extract: true
  //   })
  // },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot, //服务器访问的路劲
    filename: utils.assetsPath('js/[name].[chunkhash].js'), //文件出口
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js') //加has 动态码
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    //设置全局变量
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // UglifyJsPlugin插件是专门用来压缩js文件的
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   // 压缩后生成map文件
    //   sourceMap: true
    // }),
    // extract css into its own file
    // new ExtractTextPlugin({
    //   // 生成独立的css文件，下面是生成独立css文件的名称
    //   filename: utils.assetsPath('css/[name].[contenthash].css')
    // }),
    // // Compress extracted CSS. We are using this plugin so that possible
    // // duplicated CSS from different components can be deduped.
    // new OptimizeCSSPlugin({
    //   // 压缩css文件
    //   cssProcessorOptions: {
    //     safe: true
    //   }
    // }),
    // split vendor js into its own file
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: function (module, count) {
    //     // any required modules inside node_modules are extracted to vendor
    //     // 下面的插件是将打包后的文件中的第三方库文件抽取出来，便于浏览器缓存，提高程序的运行速度
    //     return (
    //       module.resource &&
    //       /\.js$/.test(module.resource) &&
    //       module.resource.indexOf(
    //         path.join(__dirname, '../node_modules')
    //       ) === 0
    //     )
    //   }
    // }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    // 把webpack的runtime代码和module manifest代码提取到manifest文件中，防止修改了代码但是没有修改第三方库文件导致第三方库文件也打包的问题
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   chunks: ['vendor']
    // }),
    // copy custom static assets
    // 下面是复制文件的插件，我认为在这里并不是起到复制文件的作用，而是过滤掉打包过程中产生的以.开头的文件
    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, '../static'),
    //     to: config.build.assetsSubDirectory,
    //     ignore: ['.*']
    //   }
    // ])
  ]
})

  console.log('==============webpackConfig=======================')
  console.log(webpackConfig)

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')
// 开启Gzi压缩打包后的文件，老铁们知道这个为什么还能压缩吗？？，就跟你打包压缩包一样，把这个压缩包给浏览器，浏览器自动解压的
  // 你要知道，vue-cli默认将这个神奇的功能禁用掉的，理由是Surge 和 Netlify 静态主机默认帮你把上传的文件gzip了
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp( // 这里是把js和css文件压缩
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  // 打包编译后的文件打印出详细的文件信息，vue-cli默认把这个禁用了，个人觉得还是有点用的，可以自行配置
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}


//多页面生成
let pages = ((globalPath)=>{
  let htmlFiles = {},
    pageName;

  glob.sync(globalPath).forEach((pagePath)=>{
    var basename = path.basename(pagePath, path.extname(pagePath));
    pageName = basename;
    //page name
    htmlFiles[pageName] = {};
    htmlFiles[pageName]['chunk'] = basename;
    htmlFiles[pageName]['path'] = pagePath;

  });
  return htmlFiles;
  //获取src下面路径的所有html
})(utils.resolve('src')+'/modules/**/*.html');

// for (let entryName in pages) {
//   console.log('entryName=',entryName)
//   let conf = {
//     // 生成出来的html文件名
//     filename: entryName + '.html',
//     // 每个html的模版，这里多个页面使用同一个模版
//     template: pages[entryName]['path'],
//     // 自动将引用插入html
//     inject: true,
//     minify: { //是否要压缩
//       removeComments: true,
//       collapseWhitespace: true,
//       removeAttributeQuotes: true
//       // more options:
//       // https://github.com/kangax/html-minifier#options-quick-reference
//     },
//     // necessary to consistently work with multiple chunks via CommonsChunkPlugin
//     chunksSortMode: 'dependency'
//   };
//   /*入口文件对应html文件（配置多个，一个页面对应一个入口，通过chunks对应）*/
//   webpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
// }


webpackConfig.plugins.push(
  new HtmlWebpackPlugin({
    // 生成出来的html文件名
    filename: "index.html",
    // 每个html的模版，这里多个页面使用同一个模版
    template: path.join(process.cwd(), "/public/index.html"),
    // 自动将引用插入html
    inject: true,
    // 每个html引用的js模块，也可以在这里加上vendor等公用模块
    chunks: ["vendor", "manifest", "index",'vendor.dll','vendor.manifest'],
  })
);


// webpackConfig.plugins.push(new AddAssetHtmlPlugin([
//   // { filepath: require.resolve('./some-file') },
//   // { filepath: require.resolve('./some-other-file') },
//   // Glob to match all of the dll file, make sure to use forward slashes on Windows
//   { glob:  path.join(process.cwd(), "/dist/static/*.dll.js") },
// ]))

module.exports = webpackConfig;
