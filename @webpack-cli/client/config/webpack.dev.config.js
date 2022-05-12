import path from "path";
import webpack from "webpack";
import ErrorOverlayPlugin from "error-overlay-webpack-plugin";
import nodeExternals from "webpack-node-externals";
import LiveReloadPlugin from "webpack-livereload-plugin";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
// import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import { ESBuildPlugin, ESBuildMinifyPlugin } from "esbuild-loader";
// import BrowserReloadPlugin from "browser-reload-plugin";
import BrowserReloadErrorOverlayWepbackPlugin from "../definePlugin/browser-reload-error-overlay-wepback-plugin";

// const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');

const getIPAdress = () => {
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
};

export default {
  mode: "development",
  output: {
    // 输出目录
    path: path.join(process.cwd(), "/dist"),
    // filename: '[name].[hash].js',
    // chunkFilename: '[name].[hash].js',
    // Chunk 配置
    filename: "static/js/[name].js",
    chunkFilename: "static/js/[name].js",
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
    chunkLoadTimeout: 120000,
    // // 「devtool 中模块」的文件名模板 调试webpack的配置问题
    // // 你的文件在chrome开发者工具中显示为webpack:///foo.js?a93h, 。如果我们希望文件名显示得更清晰呢，比如说 webpack:///path/to/foo.js
    devtoolModuleFilenameTemplate: (info) => {
      // "webpack://[namespace]/[resource-path]?[loaders]"
      return `webpack:///${info.resourcePath}?${info.loaders}`;
    },
    // // 如果多个模块产生相同的名称，使用
    devtoolFallbackModuleFilenameTemplate: (info) => {
      return `webpack:///${info.resourcePath}?${info.loaders}`;
    },
    // // 如果一个模块是在 require 时抛出异常，告诉 webpack 从模块实例缓存(require.cache)中删除这个模块。
    // // 并且重启webpack的时候也会删除cache缓存
    strictModuleExceptionHandling: true,
  },
  watch: true,
  watchOptions: {
    //延迟监听时间
    aggregateTimeout: 300,
    //忽略监听文件夹
    ignored: "/node_modules/",
  },
  //启用编译缓存日志输出
  // infrastructureLogging: {
  //   level: "log",
  // },
  // 使用缓存
  cache: {
    type: "filesystem", //  'memory' | 'filesystem'
    store: "pack",
    cacheDirectory: path.join(process.cwd(), "/node_modules/.cache/webpack"), // 默认将缓存存储在 node_modules/.cache/webpack
    // 缓存依赖，当缓存依赖修改时，缓存失效
    buildDependencies: {
      // 将你的配置添加依赖，更改配置时，使得缓存失效
      config: [__filename],
    },
  },
  resolve: {
    //决定请求是否应该被缓存的函数。函数传入一个带有 path 和 request 属性的对象。默认：
    cachePredicate: () => {
      return true;
    },
    fallback: {
      process: false,
    },
    //启用，会主动缓存模块，但并不安全。传递 true 将缓存一切
    // unsafeCache: true,
  },
  optimization: {
    // 压缩
    minimize: false,
    minimizer: [],
    //  任何字符串：用于设置 process.env.NODE_ENV 的值。
    // nodeEnv: "development",
    // moduleIds: "named",
    // chunkIds: "named",

    // 开启这个编译包更小
    // runtimeChunk: {
    //   name: (entrypoint) => `runtime~${entrypoint.name}`,
    // },
  },
  devtool: "cheap-module-source-map", // 生产环境和开发环境判断

  module: {
    rules: [
      {
        test: /(\.tsx?$)|(\.ts?$)|(\.js?$)|(\.m?js$)/,
        loader: "esbuild-loader",
        options: {
          loader: "jsx",
          target: "es2015",
          jsxFactory: "React.createElement",
          jsxFragment: "React.Fragment",
        },
      },
    ],
  },
  plugins: [
    new ESBuildPlugin(),
    //这个Webpack插件将强制所有必需模块的整个路径与磁盘上实际路径的确切情况相匹配。
    // 使用此插件有助于缓解OSX上的开发人员不遵循严格的路径区分大小写的情况，
    // 这些情况将导致与其他开发人员或运行其他操作系统（需要正确使用大小写正确的路径）的构建箱发生冲突。
    new CaseSensitivePathsPlugin(),
    //缓存包 热启动
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(), //NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误
    //   热刷新
    // new BrowserReloadPlugin(),
    // 热刷新和错误日志
    new BrowserReloadErrorOverlayWepbackPlugin(),
    new webpack.ProvidePlugin({
      process: "process",
    }),
    // 有跨域问题
    // new ErrorOverlayPlugin(),
    // 刷新
    new LiveReloadPlugin({
      delay: 200,
    }),
  ],
  devServer: {
    // disableHostCheck: true,
    overlay: {
      warnings: true,
      errors: true,
      inline: true,
    },
    watchFiles: [
      path.resolve(process.cwd(), "/src/**/*"),
      path.resolve(process.cwd(), "/src/*"),
      path.resolve(process.cwd(), "/public/**/*"),
      path.resolve(process.cwd(), "/public/*"),
    ],
    liveReload: true, // 编译之后是否自动刷新浏览器
    static: {
      directory: path.join(process.cwd(), "/dist"),
      watch: true,
    },
    index: path.resolve(process.cwd(), "/dist/index.html"), // dist/index 主页面
    contentBase: path.join(process.cwd(), "/dist"), //访问主页的界面 目录
    port: 8089, // 开启服务器的端口
    open: true, // 是否开启在浏览器中打开
    // public: 'http://localhost:8089',//添加配置
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
};
