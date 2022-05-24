/*
 * @Date: 2022-05-12 17:59:30
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-24 19:57:20
 * @FilePath: /webpack-cli/@webpack-cli/client/definePlugin/browser-reload-error-overlay-wepback-plugin/lib/cjs/index.js
 * @Description:
 */
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");
const portfinder = require("portfinder");
const ora = require("ora");
const chalk = require("chalk");

const clientSrc = fs
  .readFileSync(path.join(__dirname, "../client.js"))
  .toString();
const ansiToHtml = fs
  .readFileSync(path.join(__dirname, "../ansiToHtml.js"))
  .toString();

const createClient = (data) => {
  let src = clientSrc;
  // eslint-disable-next-line guard-for-in
  for (const key in data) {
    src = src.replace("/*" + key + "*/", data[key]);
  }
  return src;
};

const name = "BrowserReloadErrorOverlayWepbackPlugin";

class BrowserReloadErrorOverlayWepbackPlugin {
  constructor(options) {
    this.options = {
      port: 8080,
      retryWait: 5000,
      delay: 0,
      ...options,
    };
  }

  async start() {
    const { options } = this;
    let port = options.port;
    // 设置静态服务器
    portfinder.basePort = port;
    port = await new Promise((resolve, reject) => {
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

    this.wss = new WebSocket.Server({ port });

    this.wss.on("connection", function (ws) {
      // 远程socket
      // this.broadcast(
      //   JSON.stringify({
      //     cmd: "cmd:reload",
      //     message: "",
      //   })
      // );
    });

    this.clientSrc = createClient({
      port,
      retryWait: options.retryWait,
      delay: options.delay,
    });
  }

  broadcast(message) {
    this.wss.clients.forEach((client) => client.send(message));
  }
  // // 做兼容
  hook(compiler, hookName, pluginName, fn) {
    if (arguments.length === 3) {
      fn = pluginName;
      pluginName = hookName;
    }
    if (compiler.hooks) {
      compiler.hooks[hookName].tap(pluginName, fn);
    } else {
      compiler.plugin(pluginName, fn);
    }
  }
  apply(compiler) {
    const { options, clientSrc } = this;
    const { compilerWatch = () => {} } = options;
    // // // 开始编译 只会调用一次
    this.hook(compiler, "afterPlugins", async (compilation) => {
      if (!this.wss) {
        await this.start();
      }
    });

    // const matchObject = ModuleFilenameHelpers.matchObject.bind(undefined, {
    //   include: options.include || /\.js$/,
    //   exclude: options.exclude,
    // });

 

    compiler.watch(
      {
        // [watchOptions](/configuration/watch/#watchoptions) 示例
        aggregateTimeout: 300,
        poll: undefined,
      },
      async (err, stats) => {
        compilerWatch(err, stats)
      
        this.broadcast(
          JSON.stringify({
            cmd: "cmd:rebuilding",
            message: "",
          })
        );
        // stabilization(500).then(() => {
        if (err) {
          this.broadcast(
            JSON.stringify({
              cmd: "cmd:buildError",
              message: err.stack || err || err.details,
            })
          );
          // console.log('Errors:' + chalk.red(err.stack || err));
          // if (err.details) {
          //     console.log('Errors:' + chalk.red(err.details));
          // }
          return;
        }

        if (stats.hasErrors()) {
          this.broadcast(
            JSON.stringify({
              cmd: "cmd:buildError",
              message:
                stats.toString({
                  colors: true,
                }) + "\n\n",
            })
          );
          // console.log(
          //     'Errors:' +
          //         chalk.red(
          //             stats.toString({
          //                 colors: true,
          //             }) + '\n\n'
          //         )
          // );
          return;
        } else if (stats.hasWarnings()) {
          // console.log(
          //   "Warnings:" +
          //     chalk.yellow(
          //       stats.toString({
          //         colors: true,
          //       }) + "\n\n"
          //     )
          // );
          // return;
        }

        this.broadcast(
          JSON.stringify({
            cmd: "cmd:reload",
            message: "",
          })
        );
        // else {
        //     process.stdout.write(
        //         stats.toString({
        //             colors: true,
        //         }) + '\n\n'
        //     );
        // }
      }
    );

    compiler.hooks.emit.tap("ErrorOverlayWebpack", (compilation) => {
      const { clientSrc } = this;
      for (const name in compilation.assets) {
        if (compilation.assets.hasOwnProperty(name) && name.endsWith(".js")) {
          const contents = compilation.assets[name].source();
          const withoutComments =
            ansiToHtml + "\n" + clientSrc + "\n" + contents;
          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length,
          };
        }
      }
    });
  }
}

module.exports = BrowserReloadErrorOverlayWepbackPlugin;
