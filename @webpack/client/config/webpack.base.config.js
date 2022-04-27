import HtmlWebpackPlugin from "html-webpack-plugin";
import DirectoryNamedWebpackPlugin from "directory-named-webpack-plugin";
import webpack from "webpack";
import path, { resolve } from "path";

// console.log("__dirname : " + __dirname);
// console.log("resolve   : " + resolve("./"));
// console.log("cwd       : " + process.cwd());

export default {
  target: "web",

  resolve: {
    plugins: [
      //如果在引用目录中没有index.js文件的时候。
      // 当require("component/foo")路径“component/foo”解析到目录时，
      // Webpack将尝试查找component/foo/foo.js作为条目.
      new DirectoryNamedWebpackPlugin({
        honorIndex: true, // defaults to false
        // 排除
        exclude: /node_modules/,
        //入口文件
        include: [path.join(process.cwd(), "/src")],
      }),
    ],
    // //启用，会主动缓存模块，但并不安全。传递 true 将缓存一切
    // unsafeCache: true,
    // 模块查找优先顺序配置
    // 1.配置模块的查找规则,
    // 2.导入 require('sql')，会先在node_modules下查找，然后再到app下查找
    // 相对路径是相对于webpack.config.js文件所在的路劲
    // 详细教程: https://blog.csdn.net/u012987546/article/details/97389078
    modules: [
      path.join(process.cwd(), "/node_modules"),
      path.join(process.cwd(), "/src"),
    ],
    alias: {
      // buffer: "buffer",
      // crypto: "crypto-browserify",
      // vm: "vm-browserify",
      // crypto: false,
      // stream: "stream-browserify",
      "@": path.join(process.cwd(), "/src"),
    },
  },

  entry: {
    // myVue: [path.join(process.cwd(), "/src/myVue.js")], // 公共包抽取
    vendor: ["vue",'react'],
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
    // 输出目录
    path: path.join(process.cwd(), "/dist"),
    // filename: '[name].[hash].js',
    // chunkFilename: '[name].[hash].js',
    // Chunk 配置
    filename: "static/js/[name].js",
    chunkFilename: "static/js/[name][contenthash].js",
    //静态子目录
    // assetsSubDirectory: 'static',
    // 访问静态资源目录 比如 css img
    publicPath: "/", // dev 服务器需要是绝对，而编译出来需要是相对
    // 导出库(exported library)的名称
    // library: "server",
    //   导出库(exported library)的类型
    // libraryTarget: "umd",
    // 在 UMD 库中使用命名的 AMD 模块
    // umdNamedDefine: true,
    // globalObject: "this",
    // chunk 请求到期之前的毫秒数，默认为 120000
    // chunkLoadTimeout: 120000,
    // // 「devtool 中模块」的文件名模板 调试webpack的配置问题
    // // 你的文件在chrome开发者工具中显示为webpack:///foo.js?a93h, 。如果我们希望文件名显示得更清晰呢，比如说 webpack:///path/to/foo.js
    // devtoolModuleFilenameTemplate: (info) => {
    //   // "webpack://[namespace]/[resource-path]?[loaders]"
    //   return `webpack:///${info.resourcePath}?${info.loaders}`;
    // },
    // // 如果多个模块产生相同的名称，使用
    // devtoolFallbackModuleFilenameTemplate: (info) => {
    //   return `webpack:///${info.resourcePath}?${info.loaders}`;
    // },
    // // 如果一个模块是在 require 时抛出异常，告诉 webpack 从模块实例缓存(require.cache)中删除这个模块。
    // // 并且重启webpack的时候也会删除cache缓存
    // strictModuleExceptionHandling: true,
  },
  plugins: [
    // // html静态页面
    // new HtmlWebpackPlugin({
    //   title: "rd平台",
    //   // path.join(process.cwd(), "/src/index.js")
    //   template: path.join(process.cwd(),
    //     "/public/index.html" // 源模板文件
    //   ),
    //   filename: "index.html", // 输出文件【注意：这里的根路径是module.exports.output.path】
    //   hash: true,
    // }),

    //     // DefinePlugin内置webpack插件，专门用来定义全局变量的，下面定义一个全局变量 process.env 并且值是如下
    //     /*  'process.env': {
    //             NODE_ENV: '"development"'
    //         } 这样的形式会被自动转为
    //         'process.env': '"development"'
    //         各位骚年看好了，development如果不加双引号就当做变量处理，程序会报错
    //     */
    // new webpack.DefinePlugin({
    //   "process.env": config.dev.env,
    // }),

    // html静态页面
    new HtmlWebpackPlugin({
      title: "Custom template using Handlebars",
      // 生成出来的html文件名
      filename: "index.html",
      // 每个html的模版，这里多个页面使用同一个模版
      template: path.join(process.cwd(), "/public/index.html"),
      // 自动将引用插入html
      inject: true,
      hash: true,
      // 每个html引用的js模块，也可以在这里加上vendor等公用模块
      chunks: [
        "vendor",
        "manifest",
        "index",
        // "static/vendor.dll",
        // "static/vendor.manifest",
      ],
    }),
  ],
  module: {
    rules: [
      {
        include: path.join(process.cwd(), "/src"),
        sideEffects: true,
      },
    ],
  },
};
