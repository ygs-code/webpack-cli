import fs from "fs";
import path from "path";
import WebSocket from "ws";
// import { ConcatSource } from "webpack-sources";
// import ModuleFilenameHelpers from "webpack/lib/ModuleFilenameHelpers";
// import getPort from "get-port";
import ora from "ora";
import chalk from "chalk";

console.log("browser-reload-plugin==");
const clientSrc = fs.readFileSync(path.join(__dirname, "client.js")).toString();

// console.log('clientSrc=',clientSrc)

const createClient = (data) => {
  let src = clientSrc;

  // eslint-disable-next-line guard-for-in
  for (const key in data) {
    src = src.replace("/*" + key + "*/", data[key]);
  }

  return src;
};

const name = "ErrorOverlayWebpack";

class ErrorOverlayWebpack {
  constructor(options) {
    this.options = {
      port: 8080,
      retryWait: 5000,
      ...options,
    };
  }

  async start() {
    const { options } = this;
    // const port = await getPort(options);
    const port = 9090;

    this.wss = new WebSocket.Server({ port });
    this.clientSrc = createClient({
      port,
      retryWait: options.retryWait,
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

    // // // 开始编译 只会调用一次
    this.hook(compiler, "afterPlugins", async (compilation) => {
      if (!this.wss) {
        await this.start();
      }
      console.log("afterPlugins======== 开始");
    });

    // const matchObject = ModuleFilenameHelpers.matchObject.bind(undefined, {
    //   include: options.include || /\.js$/,
    //   exclude: options.exclude,
    // });

    const spinner = ora("building.....");
    spinner.start();

    compiler.watch(
      {
        // [watchOptions](/configuration/watch/#watchoptions) 示例
        aggregateTimeout: 300,
        poll: undefined,
      },
      async (err, stats) => {
        spinner.stop();
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
          console.log("Errors:" + chalk.red(err.stack || err));
          if (err.details) {
            console.log("Errors:" + chalk.red(err.details));
          }
          return;
        }

        if (stats.hasErrors()) {
          console.log("hasErrors============================");
          this.broadcast(
            JSON.stringify({
              cmd: "cmd:buildError",
              message:
                stats.toString({
                  colors: true,
                }) + "\n\n",
            })
          );
          console.log(
            "Errors:" +
              chalk.red(
                stats.toString({
                  colors: true,
                }) + "\n\n"
              )
          );
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
        console.log("cmd:reload=============");
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

    // compiler.hooks.watchRun.tapPromise(name, async () => {
    // 	if (!this.wss) {
    // 		await this.start();
    // 	}

    // 	this.broadcast('cmd:rebuilding');
    // });

    // compiler.hooks.done.tap(name, () => this.broadcast("cmd:reload"));
    // const { clientSrc } = this;
    compiler.hooks.emit.tap("ErrorOverlayWebpack", (compilation) => {
      const { clientSrc } = this;
      // compilation => 可以理解为此次打包的上下文
      for (const name in compilation.assets) {
        // console.log(compilation.assets[name].source())
        if (name.endsWith(".js")) {
          const contents = compilation.assets[name].source();
          const withoutComments = clientSrc + "\n" + contents;
          // console.log("clientSrc=", clientSrc);
          // console.log("name=", name);
          // console.log('withoutComments=',withoutComments)
          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length,
          };
        }
      }
    });

    // compiler.hooks.compilation.tap(name, (compilation) => {
    //   compilation.hooks.optimizeChunkAssets.tapPromise(name, async (chunks) => {
    //     const { clientSrc } = this;

    //     for (const chunk of chunks) {
    //       console.log('chunks=',chunks)
    //       if (!chunk.canBeInitial()) {
    //         continue;
    //       }
    //       console.log('chunk.files=',chunk.files)
    //       for (const file of chunk.files) {
    //         if (!matchObject(file)) {
    //           continue;
    //         }

    //         if (file.endsWith(".js")) {
    //           console.log('contents===========================')
    //           console.log('contents===========================')
    //           const contents = compilation.assets[file].source();
    //           const withoutComments = "\n" + contents;
    //           compilation.assets[file] = {
    //             source: () => withoutComments,
    //             size: () => withoutComments.length,
    //           };

    //           // const contents = clientSrc + "\n" + compilation.assets[file];
    //           // // source: () => contents,// withoutComments,
    //           // //   size: () => contents.length // withoutComments.length
    //           // compilation.assets[file] = {
    //           //   source: () => contents, // withoutComments,
    //           //   size: () => contents.length, // withoutComments.length
    //           // };

    //           // new ConcatSource(
    //           //   clientSrc,
    //           //   "\n",
    //           //   compilation.assets[file]
    //           // );
    //         }
    //       }
    //     }
    //   });
    // });
  }
}

export default ErrorOverlayWebpack;
