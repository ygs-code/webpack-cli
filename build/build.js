//检测node npm 版本
require('./check-versions')()
// 设置环境变量为production
process.env.NODE_ENV = 'production'
// ora是一个命令行转圈圈动画插件，好看用的 https://www.npmjs.com/package/ora
var ora = require('ora')
// rimraf插件是用来执行UNIX命令rm和-rf的用来删除文件夹和文件，清空旧的文件
var rm = require('rimraf')
// node.js路径模块
var path = require('path')
// chalk插件，用来在命令行中输入不同颜色的文字
var chalk = require('chalk')
// 引入config下的index.js配置文件，此配置文件我之前介绍了请自行查阅，主要配置的是一些通用的选项
var webpack = require('webpack')
// 引入config下的index.js配置文件，此配置文件我之前介绍了请自行查阅，主要配置的是一些通用的选项
var config = require('../config')

//// 下面是生产模式的webpack配置文件，请看我的webpack.prod.conf解释文章
var webpackConfig = require('./webpack.prod.conf')
// 开启转圈圈动画
var spinner = ora('building for production...')
spinner.start()

// 调用rm方法，第一个参数的结果就是 dist/static，表示删除这个路径下面的所有文件
//先删除完文件
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  //调用webpack 生产文件
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
