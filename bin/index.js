#!/usr/bin/env node

const minimist = require('minimist'), // 解析控制台参数
  fs = require('fs'),
  chalk = require('chalk'), // 控制台颜色
  requireFrom = require('import-from'), // 类似 require，但支持指定目录，让你可以跨工程目录进行 require，比如全局包想引用工程路径下的内容
  homeDir = require('osenv').home(), // 跨平台读取用户顶级路径 /Users/xmz ？？？
  path = require('path'),
  inquirer = require('inquirer'), // 与用户互动
  execSync = require('child_process').execSync,
  args = minimist(process.argv)

const Server = require('../@webpack-cli')
module.exports = Server
