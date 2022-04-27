// 导入check-versions.js文件，并且执行导入的函数，用来确定当前环境node和npm版本是否符合要求
require("./check-versions")();
// 导入config目录下的index.js配置文件，此配置文件中定义了生产和开发环境中所要用到的一些参数
// 关于index.js的文件解释请看我博客的index.js的相关文章
var config = require("../config");
if (!process.env.NODE_ENV) {
  // 下面表示如果如果没有定义全局变量NODE_ENV，则将NODE_ENV设置为"development"
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}
// opn插件是用来打开特定终端的，此文件用来在默认浏览器中打开链接 opn(url)
var opn = require("opn");
// nodejs路径模块 解析路径
var path = require("path");
// nodejs开发框架express，用来简化操作， 输出json 或者页面
var express = require("express");
// 引入webpack模块，用来使用webpack内置插件
var webpack = require("webpack");
// 引入http-proxy-middleware插件，此插件是用来代理请求的只能用于开发环境，目的主要是解决跨域请求后台api
var proxyMiddleware = require("http-proxy-middleware");
// 下面的意思是指，如果不是testing环境就引入webpack.dev.conf.js配置文件
// 关于webpack.dev.conf.js配置文件请关注我的相关文章，建议现在就去看，否则后面看着吃力
var webpackConfig = require("./webpack.dev.conf");

// default port where dev server listens for incoming traffic
// 默认端口设置
var port = process.env.PORT || config.dev.port;
// automatically open browser, if not set will be false
// 是否自动开启浏览器
var autoOpenBrowser = !!config.dev.autoOpenBrowser;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
// 下面是解决开发环境跨域问题的插件，我在config目录index.js文章中有介绍，自行查看
var proxyTable = config.dev.proxyTable;
// 下面是创建node.js的express开发框架的实例，
var app = express();
// 把配置参数传递到webpack方法中，返回一个编译对象，这个编译对象上面有很多属性，自己去看吧，主要是用到里面的状态函数 如compilation，compile，after-emit这类的
// console.log('=================webpackConfig=====================')
// console.log(webpackConfig)

function printContent(obj) {
  for (var key in obj) {
    if (typeof obj[key] === "object") {
      printContent(obj[key]);
    } else {
      console.log(obj[key]);
    }
  }
}
// printContent(webpackConfig);

// 把配置参数传递到webpack方法中，返回一个编译对象，这个编译对象上面有很多属性，自己去看吧，主要是用到里面的状态函数 如compilation，compile，after-emit这类的
// 把所有参数放到webpack中 实例化 webpack
console.log("webpackConfig=========", webpackConfig);

var compiler = webpack(webpackConfig);

// 观看模式（默认）：对文件更改编译器重新编译。
// 懒人模式：编译器编译的每个请求的入口点。
console.log('webpackConfig.output.publicPath=',webpackConfig.output.publicPath)
var devMiddleware = require("webpack-dev-middleware")(compiler, {
  publicPath: webpackConfig.output.publicPath, // js访问路径
  // quiet: true, // 显示没有控制台 使用friendly-errors-webpack-plugin插件这个必须设置为true，具体看我的wepback-dev-config.js
});

// WebPACK热中间件 https://www.npmjs.com/package/webpack-hot-middleware
var hotMiddleware = require("webpack-hot-middleware")(compiler, {
  log: () => {},
});

// return 
// force page reload when html-webpack-plugin template changes
// 力重新载入页面时HTML WebPACK插件模板的变化
// https://www.npmjs.com/package/html-webpack-plugin
// 热启动
// compiler.plugin('compilation', function (compilation) {
//   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//     hotMiddleware.publish({ action: 'reload' });
//     cb();
//   });
// });

// proxy api requests
// 下面是代理表的处理方法， 可以使用后台,代理后台地址
Object.keys(proxyTable).forEach(function (context) {
  // 下面是代理表的处理方法， 可以使用后台管理
  var options = proxyTable[context];
  if (typeof options === "string") {
    options = { target: options };
  }
  console.log("=============options===================");
  console.log(options);
  app.use(proxyMiddleware(options.filter || context, options));
});

// handle fallback for HTML5 history API
// 通过指定的索引页面中间件代理请求，用于单页应用程序，利用HTML5 History API。
// 这个插件是用来解决单页面应用，点击刷新按钮和通过其他search值定位页面的404错误
app.use(require("connect-history-api-fallback")());

// serve webpack bundle output
// serve webpack bundle output
// app.use是在响应请求之前执行的，用来指定静态路径，挂载静态资源
// 挂载静态资源 编译
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
var staticPath = path.posix.join(
  config.dev.assetsPublicPath,
  config.dev.assetsSubDirectory
);
// 挂载静态资源，下面的方法是用虚拟目录来访问资源，staticPath就是虚拟目录路径，其实不管设不设置都是static
console.log('staticPath=',staticPath)
app.use(staticPath, express.static("./static"));
// app.use(staticPath, express.static("./dllFile"));
// 下面结果就是 'http://localhost:'+ 端口
var uri = "http://localhost:" + port;

// 下面是es6的promise规范，用来处理嵌套请求的 异步
var _resolve;
var readyPromise = new Promise((resolve) => {
  _resolve = resolve;
});

// 下面是加载动画
console.log("> Starting dev server...");
devMiddleware.waitUntilValid(() => {
  console.log("> Listening at " + uri + "\n");
  // when env is testing, don't need open it
  // 测试环境不打开浏览器
  if (autoOpenBrowser && process.env.NODE_ENV !== "testing") {
    opn(uri);
  }
  _resolve(); // 这里没有传递数据，这只是在模拟
});

var server = app.listen(port);
// 这个导出对象是用来对外提供操作服务器和接受数据的接口，vue作者可谓考虑颇深啊
module.exports = {
  ready: readyPromise, // promise实例，可以通过readyPromise.then收到数据
  close: () => {
    server.close(); // 关闭服务器
  },
};
