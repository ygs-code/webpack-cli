import fs from "fs";
import path from "path";
import WebSocket from "ws";
import { ConcatSource } from "webpack-sources";
import ModuleFilenameHelpers from "webpack/lib/ModuleFilenameHelpers";
// import getPort from "get-port";
import ora from "ora";
import chalk from "chalk";

console.log("browser-reload-plugin==");
const clientSrc = fs.readFileSync(path.join(__dirname, "client.js")).toString();
const createClient = (data) => {
  let src = clientSrc;

  // eslint-disable-next-line guard-for-in
  for (const key in data) {
    src = src.replace("/*" + key + "*/", data[key]);
  }

  return src;
};

const name = "BrowserReloadPlugin";

class BrowserReloadPlugin {
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
  const port =  9090;

    this.wss = new WebSocket.Server({ port });
    this.clientSrc = createClient({
      port,
      retryWait: options.retryWait,
    });
  }

  broadcast(message) {
    this.wss.clients.forEach((client) => client.send(message));
  }

  apply(compiler) {
    const { options } = this;
    const matchObject = ModuleFilenameHelpers.matchObject.bind(undefined, {
      include: options.include || /\.js$/,
      exclude: options.exclude,
    });

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
        if (!this.wss) {
          await this.start();
        }

        // stabilization(500).then(() => {
        if (err) {
          console.log("err============================");
          console.log("Errors:" + chalk.red(err.stack || err));
          if (err.details) {
            console.log("Errors:" + chalk.red(err.details));
          }
          return;
        }

        if (stats.hasErrors()) {
          console.log("hasErrors============================");
          console.log(
            "Errors:" +
              chalk.red(
                stats.toString({
                  colors: true,
                }) + "\n\n"
              )
          );
        } else if (stats.hasWarnings()) {
          // console.log(
          //   "Warnings:" +
          //     chalk.yellow(
          //       stats.toString({
          //         colors: true,
          //       }) + "\n\n"
          //     )
          // );
        }

        this.broadcast("cmd:rebuilding");

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

    compiler.hooks.done.tap(name, () => this.broadcast("cmd:reload"));

    compiler.hooks.compilation.tap(name, (compilation) => {
      compilation.hooks.optimizeChunkAssets.tapPromise(name, async (chunks) => {
        const { clientSrc } = this;

        for (const chunk of chunks) {
          if (!chunk.canBeInitial()) {
            continue;
          }

          for (const file of chunk.files) {
            if (!matchObject(file)) {
              continue;
            }

            compilation.assets[file] = new ConcatSource(
              clientSrc,
              "\n",
              compilation.assets[file]
            );
          }
        }
      });
    });
  }
}

export default BrowserReloadPlugin;
