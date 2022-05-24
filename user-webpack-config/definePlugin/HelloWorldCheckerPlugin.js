/*
 * @Date: 2022-05-12 15:50:04
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-24 19:45:52
 * @FilePath: /webpack-cli/user-webpack-config/definePlugin/HelloWorldCheckerPlugin.js
 * @Description:
 */
const fs = require("fs");
const path = require("path");
const ora = require("ora");
const rm = require("rimraf");
const chalk = require("chalk");
// chalk插件，用来在命令行中输入不同颜色的文字
 
class HelloWorldCheckerPlugin {
  constructor(options) {
    this.options = options;
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
    console.log('apply==========')






    compiler.hooks.emit.tap( "afterPlugins", (compilation) => {
    //   console.log("afterPlugins======== 开始");
    //   console.log("compilation.assets======== ",compilation.assets);
          // compilation => 可以理解为此次打包的上下文
        //   for (const name in compilation.assets) {
        //     // console.log(compilation.assets[name].source())
        //     if (name.endsWith('.js')) {
        //         // console.log('name==========',name)
        //       const contents = compilation.assets[name].source()
        //     //   const withoutComments = contents.replace(/\/\*\*+\*\//g, '')
        //       compilation.assets[name] = {
        //         source: () => contents,// withoutComments,
        //         size: () => contents.length // withoutComments.length
        //       }
        //     }
        //   }
      
    });



    // compiler.hooks.emit.tap('MyPlugin', compilation => {
    //     // compilation => 可以理解为此次打包的上下文
    //     for (const name in compilation.assets) {
    //       // console.log(compilation.assets[name].source())
    //       if (name.endsWith('.js')) {
    //         const contents = compilation.assets[name].source()
    //         const withoutComments = contents.replace(/\/\*\*+\*\//g, '')
    //         compilation.assets[name] = {
    //           source: () => withoutComments,
    //           size: () => withoutComments.length
    //         }
    //       }
    //     }
    //   })
  
  
      
    const spinner = ora("building.....");
    spinner.start();

    compiler.watch(
      {
        // [watchOptions](/configuration/watch/#watchoptions) 示例
        aggregateTimeout: 300,
        poll: undefined,
      },
      (err, stats) => {
        spinner.stop();

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

        // else {
        //     process.stdout.write(
        //         stats.toString({
        //             colors: true,
        //         }) + '\n\n'
        //     );
        // }
      }
    )
    // this.hook(compiler, "make", (compilation, cb) => {
    //   // console.log('compilation=======',compilation)
    //   console.log("cb=======", cb);
    //   this._make(compilation, cb);
    //   // cb();
    // });
  }

  _make(compilation, cb) {
    // console.log("compilation============", compilation);

    try {
      console.log("path=", path.resolve("/", this.options.path));
      const file = fs.readFileSync(
        path.resolve(__dirname, this.options.path),
        "utf8"
      );

      if (file.includes("Hello World!")) {
        console.log(
          `The file ${this.options.path} contains 'Hello World!' string`
        );
      } else {
        console.log(
          `The file ${this.options.path} doesn't contain 'Hello World!' string`
        );
      }
      //   cb();
    } catch (e) {
      console.log("e=================", e);
      compilation.errors.push(e);
      //   cb();
    }

    // console.log('compilation=',compilation)
    // console.log('compilation.errors=',compilation.errors)
    // console.log('compilation.warnings=',compilation.warning)
  }
}

module.exports = HelloWorldCheckerPlugin;
