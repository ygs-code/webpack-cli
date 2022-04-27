import "@babel/polyfill";
// import koa from 'koa';
import fs from "fs";
import express from "express";
import path from "path";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import config from "./config/index";
import portfinder from "portfinder";
import isObject from "is-object";
import webpackHotMiddleware from "webpack-hot-middleware";
import connectHistoryApiFallback from "connect-history-api-fallback";
import ora from "ora";
// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from "chalk";
// opn插件是用来打开特定终端的，此文件用来在默认浏览器中打开链接 opn(url)
import opn from "opn";
// 引入http-proxy-middleware插件，此插件是用来代理请求的只能用于开发环境，目的主要是解决跨域请求后台api
import { createProxyMiddleware } from "http-proxy-middleware";
import { getArgv, stabilization } from "./utils";

console.log("config.output.publicPath=", config.output.publicPath);
class App {
  constructor() {
    this.app = new express();
    this.init();
  }

  async init() {
    this.environment();

    this.middleware();
    // 启动服务器
    await this.listen();
  }

  environment() {
    let webpackEnv = getArgv("webpackEnv");
    const NODE_ENV = process.env.NODE_ENV; // 环境参数
    //    是否是测试开发环境
    this.isEnvDevelopment = NODE_ENV === "development";
    //   是否是生产环境
    this.isEnvProduction = NODE_ENV === "production";
  }
  // 编译
  setCompiler() {
    // 开启转圈圈动画
    const spinner = ora("building.....");
    spinner.start();
    const compiler = webpack(config, (err, stats) => {
      spinner.stop();

      // stabilization(500).then(() => {
      if (err) {
        console.log("Errors:" + chalk.red(err.stack || err));
        if (err.details) {
          console.log("Errors:" + chalk.red(err.details));
        }
        return;
      }

      if (stats.hasErrors()) {
        console.log(
          "Errors:" +
            chalk.red(
              stats.toString({
                colors: true,
              }) + "\n\n"
            )
        );
      } else if (stats.hasWarnings()) {
        console.log(
          "Warnings:" +
            chalk.yellow(
              stats.toString({
                colors: true,
              }) + "\n\n"
            )
        );
      }

      // else {
      //     process.stdout.write(
      //         stats.toString({
      //             colors: true,
      //         }) + '\n\n'
      //     );
      // }
    });
    // console.log(chalk.rgb(13, 188, 121)("Build complete .\n"));
    // });
    //  console.log('compiler.hooks=',compiler.hooks)
    //  console.log('compiler.hooks=',compiler.hooks)

    // compiler.hooks.SyncHook.tap('compile',()=>{
    //    console.log('watchRun======')
    // })

    // const watching = compiler.watch({}, (err, stats) => {
    //     spinner.stop();

    //     if (err) {
    //         console.log('Errors:' + chalk.red(err.stack || err));
    //         if (err.details) {
    //             console.log('Errors:' + chalk.red(err.details));
    //         }
    //         return;
    //     }

    //     if (stats.hasErrors()) {
    //         console.log(
    //             'Errors:' +
    //                 chalk.red(
    //                     stats.toString({
    //                         colors: true,
    //                     }) + '\n\n'
    //                 )
    //         );
    //     } else if (stats.hasWarnings()) {
    //         console.log(
    //             'Warnings:' +
    //                 chalk.red(
    //                     stats.toString({
    //                         colors: true,
    //                     }) + '\n\n'
    //                 )
    //         );
    //     } else {
    //         process.stdout.write(
    //             stats.toString({
    //                 colors: true,
    //             }) + '\n\n'
    //         );
    //     }

    //     !this.isEnvDevelopment &&
    //         watching.close(() => {
    //             console.log('Watching Ended.');
    //         });
    // });

    // if (this.isEnvDevelopment) {
    // compiler.watch(
    //   {
    //     // [watchOptions](/configuration/watch/#watchoptions) 示例
    //     aggregateTimeout: 300,
    //     poll: undefined,
    //   },
    //   (err, stats) => {
    //     //   console.log()
    //     // process.stdout.write(stats.toString({
    //     //     colors: true,
    //     //   }) + '\n\n')
    //     if (err) throw err;
    //     process.stdout.write(
    //       stats.toString({
    //         colors: true,
    //       }) + "\n\n"
    //     );
    //   }
    // );
    // }
    return compiler;
  }
  //浏览器服务器
  setDevMiddleware(compiler) {
    const {
      devServer: {
        open: autoOpenBrowser, // 是否自动开启浏览器
      } = {},
    } = config;

    console.log("config.output.publicPath=", config.output.publicPath);

    this.devMiddleware = webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
      serverSideRender: true, // 是否是服务器渲染
      // quiet: true,
    });
    // 下面是加载动画
    this.devMiddleware.waitUntilValid(() => {
      // 启动服务器
      console.log(">第一次代码编译完成");
      // when env is testing, don't need open it
      //  测试环境不打开浏览器
      if (autoOpenBrowser && process.env.NODE_ENV !== "testing") {
        const url = "http://localhost:" + this.port;
        console.log("url============", url);
        opn(url);
      }

      const filename = this.devMiddleware.getFilenameFromUrl("/index.js");

      console.log(`Filename is ${filename}`);
    });
    // 挂载静态资源 编译
    this.app.use(this.devMiddleware);

    // This function makes server rendering of asset references consistent with different webpack chunk/entry configurations
    function normalizeAssets(assets) {
      console.log("assets===========", assets);
      if (isObject(assets)) {
        return Object.values(assets);
      }

      return Array.isArray(assets) ? assets : [assets];
    }
    let index = 0;
    // The following middleware would not be invoked until the latest build is finished.
//     this.app.use((req, res) => {
//       const { devMiddleware } = res.locals.webpack;
//       // console.log('res.locals=',res.locals)
//       // console.log('devMiddleware.context=',devMiddleware)
//       const outputFileSystem = devMiddleware.outputFileSystem;
//       const jsonWebpackStats = devMiddleware.stats.toJson();
//       const { assetsByChunkName, outputPath } = jsonWebpackStats;
//       // console.log("jsonWebpackStats=======", jsonWebpackStats);
//       // console.log("outputPath=======", outputPath);
//       // //3，同步往文件写入内容
//       // fs.writeSync("./" + index + ".js",'234');

//       fs.writeFile("./" + index + ".js",JSON.stringify(jsonWebpackStats),function(error){
//         if(!error){
//             console.log("写入成功");
//         }
//     });

//       index++;
//       // Then use `assetsByChunkName` for server-side rendering
//       // For example, if you have only one main chunk:
//       res.send(`
// <html>
//   <head>
//     <title>My App</title>
//     <style>
//     ${normalizeAssets(assetsByChunkName)
//       .filter((path) => {
//         console.log("path======", path);
//         return path[0].endsWith(".css");
//       })
//       .map((path) => outputFileSystem.readFileSync(path.join(outputPath, `${path[0]}`)))
//       .join("\n")}
//     </style>
//   </head>
//   <body>
//     <div id="root"></div>
//     ${normalizeAssets(assetsByChunkName)
//       .filter((path) => path[0].endsWith(".js"))
//       .map((path) => `<script src="${path.join(outputPath, `${path[0]}`)}"></script>`)
//       .join("\n")}
//   </body>
// </html>
//   `);
//    });

    return this.devMiddleware;
  }

  // // 做兼容
  // hook(compiler, hookName, fn) {
  //   if (compiler.hooks) {
  //     compiler.hooks[hookName].tap(hookName, fn);
  //   } else {
  //     compiler.plugin(hookName, fn);
  //   }
  // }
  //设置编译缓存
  setHotMiddleware(compiler) {
    this.hotMiddleware = webpackHotMiddleware(compiler, {
      log: () => {},
    });

    // // 开启编译缓存
    // this.hook("compilation", (compilation) => {
    //   this.hook("html-webpack-plugin-after-emit", (data, cb) => {
    //     this.hotMiddleware.publish({ action: "reload" });
    //     cb();
    //   });
    // });

    this.app.use(this.hotMiddleware);
    return this.hotMiddleware;
  }
  setConnectHistoryApiFallback() {
    this.connectHistoryApiFallback = connectHistoryApiFallback();
    this.app.use(this.connectHistoryApiFallback);
  }
  // 代理服务器
  setProxyMiddleware() {
    const { devServer: { proxy } = {} } = config;
    const type = Object.prototype.toString.call(proxy).toLowerCase();

    if (proxy && type == "[object object]") {
      // 下面是代理表的处理方法， 可以使用后台,代理后台地址
      Object.keys(proxy).forEach(function (context) {
        // 下面是代理表的处理方法， 可以使用后台管理
        var options = proxyTable[context];
        if (typeof options === "string") {
          options = { target: options };
        }
        this.app.use(createProxyMiddleware(options.filter || context, options));
      });
    }

    if (proxy && type == "[object array]") {
      for (let item of proxy) {
        let { context } = item;
        delete item.context;
        if (
          Object.prototype.toString.call(context).toLowerCase() ==
          "[object array]"
        ) {
          for (let contextItem of context) {
            console.log("contextItem========", contextItem);
            console.log("item========", item);
            this.app.use(createProxyMiddleware(contextItem, item));
          }
        } else {
          this.app.use(createProxyMiddleware(context, item));
        }
      }
    }
  }
  // 设置静态资源服务器
  setStatic() {
    console.log("setStatic==========");
    //静态资源子目录
    const assetsSubDirectory = "static";
    //访问静态资源公开路径
    const assetsPublicPath = "/";

    // serve pure static assets
    const staticPath = path.posix.join(assetsPublicPath, assetsSubDirectory);
    console.log("staticPath=", staticPath);
    console.log('express.static("./static")=', express.static("./static"));
    // 挂载静态资源，下面的方法是用虚拟目录来访问资源，staticPath就是虚拟目录路径，其实不管设不设置都是static
    this.app.use(staticPath, express.static("./static"));
  }

  middleware() {
    // 编译代码
    let compiler = this.setCompiler();
    //代理
    // 开启代理
    this.setProxyMiddleware();
    // handle fallback for HTML5 history API
    // 通过指定的索引页面中间件代理请求，用于单页应用程序，利用HTML5 History API。
    // 这个插件是用来解决单页面应用，点击刷新按钮和通过其他search值定位页面的404错误
    this.setConnectHistoryApiFallback();

    console.log("setDevMiddleware======");
    // // 开启dev服务器
    this.setDevMiddleware(compiler);

    console.log("setHotMiddleware======");
    // 开启编译缓存
    this.setHotMiddleware(compiler);

    console.log("setStatic======");
    this.setStatic();
  }

  async listen() {
    let { devServer: { port } = {} } = config;

    // 设置静态服务器

    // 默认端口设置
    port = port || process.env.PORT;

    portfinder.basePort = port;
    this.port = await new Promise((resolve, reject) => {
      //查找端口号
      portfinder.getPort((err, port) => {
        if (err) {
          reject(err);
          return;
        }
        // 新端口
        resolve(port);
      });
    });
    this.server = this.app.listen(this.port, () => {
      console.log(`\n编译代码服务器端口:${port}\n`);
    });
  }
}

export default App;
