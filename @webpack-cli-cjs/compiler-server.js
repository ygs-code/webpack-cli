// const      "@babel/polyfill";
// const      koa = require( 'koa';
const fs = require('fs')
const express = require('express')
const path = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
// const      config = require( "./config/index";
const portfinder = require('portfinder')
const isObject = require('is-object')
const webpackHotMiddleware = require('webpack-hot-middleware')
// const BrowserReloadErrorOverlayWepbackPlugin = require('./client/definePlugin/browser-reload-error-overlay-wepback-plugin/lib/cjs')
const connectHistoryApiFallback = require('connect-history-api-fallback')

const rm = require('rimraf')
// chalk插件，用来在命令行中输入不同颜色的文字
const chalk = require('chalk')
// opn插件是用来打开特定终端的，此文件用来在默认浏览器中打开链接 opn(url)
const opn = require('opn')
// 引入http-proxy-middleware插件，此插件是用来代理请求的只能用于开发环境，目的主要是解决跨域请求后台api
const { createProxyMiddleware } = require('http-proxy-middleware')
const checkVersions = require('./check-versions')
const { getArgv, stabilization } = require('./utils')
const clientWebpackConfig = require('./client')
const serverWebpackConfig = require('./server')
// const webpackEnv = getArgv('webpackEnv') // 环境参数
// const target = getArgv('target') // 环境参数
const {
  NODE_ENV, // 环境参数
  webpackEnv, // 环境参数
  target, // 环境参数
} = process.env // 环境参数
// 检查node和npm版本
checkVersions()
class App {
  constructor() {
    this.app = new express()
    this.init()
  }

  async init() {
    // 获取配置
    this.config =
      target == 'web'
        ? await clientWebpackConfig()
        : await serverWebpackConfig()
    // console.log(" this.config =", this.config);
    let { devServer: { port } = {} } = this.config
    // 设置静态服务器
    // 默认端口设置
    port = port || process.env.PORT
    portfinder.basePort = port
    this.port = await new Promise((resolve, reject) => {
      //查找端口号
      portfinder.getPort((err, port) => {
        if (err) {
          reject(err)
          return
        }
        // 新端口
        resolve(port)
      })
    })
    this.config.devServer = this.config.devServer || {}
    this.config.devServer.port = this.port || {}

    await this.environment()
    await this.middleware()
    // 启动服务器
    await this.listen()
  }

  async environment() {
 

    //    是否是测试开发环境
    this.isEnvDevelopment = NODE_ENV === 'development'
    //   是否是生产环境
    this.isEnvProduction = NODE_ENV === 'production'
  }
  // 编译
  async setCompiler() {
    // 开启转圈圈动画
    // let $BrowserReloadErrorOverlayWepbackPlugin = {}
    await new Promise((resolve, reject) => {
      rm(path.join(process.cwd(), '/dist'), (err) => {
        if (err) {
          reject()
          throw err
        }
        resolve()
      })
    })

    // if (this.isEnvDevelopment) {
    //   $BrowserReloadErrorOverlayWepbackPlugin = new BrowserReloadErrorOverlayWepbackPlugin()
    // }

    const compiler = webpack(this.config, (err, stats) => {
      // this.isEnvDevelopment &&
      //   $BrowserReloadErrorOverlayWepbackPlugin.watch(err, stats)
      if (err) {
        console.log('Errors:' + chalk.red(err.stack || err))
        if (err.details) {
          console.log('Errors:' + chalk.red(err.details))
        }
        return
      }
      if (stats.hasErrors()) {
        console.log(
          'Errors:' +
            chalk.red(
              stats.toString({
                colors: true,
              }) + '\n\n',
            ),
        )
      }

      // else if (stats.hasWarnings()) {
      //   console.log(
      //     "Warnings:" +
      //       chalk.yellow(
      //         stats.toString({
      //           colors: true,
      //         }) + "\n\n"
      //       )
      //   );
      // }
      // else {
      //     process.stdout.write(
      //         stats.toString({
      //             colors: true,
      //         }) + '\n\n'
      //     );
      // }
    })

    // this.isEnvDevelopment &&
    //   $BrowserReloadErrorOverlayWepbackPlugin.injection(compiler)

    // console.log(chalk.rgb(13, 188, 121)("Build complete .\n"));
    // });

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
    return compiler
  }

  //浏览器服务器
  setDevMiddleware(compiler) {
    const {
      devServer: {
        open: autoOpenBrowser, // 是否自动开启浏览器
      } = {},
    } = this.config

    this.devMiddleware = webpackDevMiddleware(compiler, {
      //设置允许跨域
      headers: () => {
        return {
          // "Last-Modified": new Date(),
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'content-type',
          'Access-Control-Allow-Methods': 'DELETE,PUT,POST,GET,OPTIONS',
        }
      },
      publicPath: this.config.output.publicPath,
      serverSideRender: true, // 是否是服务器渲染
      writeToDisk: true, //是否写入硬盘
      // quiet: true,
    })
    // 下面是加载动画
    this.devMiddleware.waitUntilValid(() => {
      // 启动服务器
      console.log('第一次代码编译完成')
      //  测试环境不打开浏览器
      if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        const url = 'http://localhost:' + this.port
        console.log('客户端地址:', url)
        opn(url)
      }

      // const filename = this.devMiddleware.getFilenameFromUrl("/index.js");
      // console.log(`Filename is ${filename}`);
    })
    // 挂载静态资源 编译
    this.app.use(this.devMiddleware)

    return this.devMiddleware
  }

  // // 做兼容
  hook(compiler, hookName, pluginName, fn) {
    if (arguments.length == 3) {
      fn = pluginName
      pluginName = hookName
    }
    if (compiler.hooks) {
      compiler.hooks[hookName].tap(pluginName, fn)
    } else {
      compiler.plugin(hookName, fn)
    }
  }
  //设置编译缓存
  setHotMiddleware(compiler) {
    const {
      devServer: {
        open: autoOpenBrowser, // 是否自动开启浏览器
        liveReload, // 是否自动刷新
      } = {},
    } = this.config
    this.hotMiddleware = webpackHotMiddleware(compiler, {
      log: () => {},
    })

    this.hook(compiler, 'shouldEmit', 'compilation', () => {
      stabilization(100).then(() => {
        this.hook(
          compiler,
          'shouldEmit',
          'html-webpack-plugin-after-emit',
          () => {
            console.log('编译成功，自动重新刷新浏览器')
          },
        )
      })
    })

    this.app.use(this.hotMiddleware)
    return this.hotMiddleware
  }

  // setHotServerMiddleware(compiler) {
  //   this.app.use(webpackHotServerMiddleware(compiler));
  // }
  setConnectHistoryApiFallback() {
    this.connectHistoryApiFallback = connectHistoryApiFallback()
    this.app.use(this.connectHistoryApiFallback)
  }
  // 代理服务器
  setProxyMiddleware() {
    const { devServer: { proxy } = {} } = this.config
    const type = Object.prototype.toString.call(proxy).toLowerCase()

    if (proxy && type == '[object object]') {
      // 下面是代理表的处理方法， 可以使用后台,代理后台地址
      Object.keys(proxy).forEach(function (context) {
        // 下面是代理表的处理方法， 可以使用后台管理
        var options = proxyTable[context]
        if (typeof options === 'string') {
          options = { target: options }
        }
        this.app.use(createProxyMiddleware(options.filter || context, options))
      })
    }

    if (proxy && type == '[object array]') {
      for (let item of proxy) {
        let { context } = item
        delete item.context
        if (
          Object.prototype.toString.call(context).toLowerCase() ==
          '[object array]'
        ) {
          for (let contextItem of context) {
            this.app.use(createProxyMiddleware(contextItem, item))
          }
        } else {
          this.app.use(createProxyMiddleware(context, item))
        }
      }
    }
  }
  // 设置静态资源服务器
  setStatic() {
    //静态资源子目录
    const assetsSubDirectory = 'static'

    const staticPath = path.posix.join(
      this.config.output.publicPath, //访问静态资源公开路径
      assetsSubDirectory,
    )

    // 挂载静态资源，下面的方法是用虚拟目录来访问资源，staticPath就是虚拟目录路径，其实不管设不设置都是static
    this.app.use(staticPath, express.static('./static'))
  }

  async middleware() {
    // 编译代码
    let compiler = await this.setCompiler()

    if (this.isEnvProduction) {
      return Promise.reject()
    }

    // 如果是node不启动服务器
    if (target == 'node') {
      return Promise.reject()
    }
    //  开启dev服务器
    this.setDevMiddleware(compiler)

    // 开启编译缓存
    this.setHotMiddleware(compiler)

    // // 设置缓存服务器
    // this.setHotServerMiddleware(compiler);

    // 开启代理
    this.setProxyMiddleware()
    // handle fallback for HTML5 history API
    // 通过指定的索引页面中间件代理请求，用于单页应用程序，利用HTML5 History API。
    // 这个插件是用来解决单页面应用，点击刷新按钮和通过其他search值定位页面的404错误
    this.setConnectHistoryApiFallback()

    // 设置静态目录
    this.setStatic()
  }

  async listen() {
    let { devServer: { port } = {} } = this.config
    this.server = this.app.listen(port, () => {
      console.log(`\n编译代码服务器端口:${port}\n`)
    })
  }
}

module.exports = App
