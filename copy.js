/*
 * @Date: 2022-04-29 18:51:13
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-06-10 15:42:38
 * @FilePath: /webpack-cli/copy.js
 * @Description:
 */ 
var fs = require("fs");
var path = require("path");
var copy = function (src, dst) {
  let paths = fs.readdirSync(src); //同步读取当前目录
  paths.forEach(function (path) {
    var _src = src + "/" + path;
    var _dst = dst + "/" + path;
    fs.stat(_src, function (err, stats) {
      //stats 该对象 包含文件属性
      if (err) throw err;
      if (stats.isFile()) {
        //如果是个文件则拷贝
        let readable = fs.createReadStream(_src); //创建读取流
        let writable = fs.createWriteStream(_dst); //创建写入流
        readable.pipe(writable);
      } else if (stats.isDirectory()) {
        //是目录则 递归
        checkDirectory(_src, _dst, copy);
      }
    });
  });
};

// 检查目录是否存在
var checkDirectory = function (src, dst, callback) {
  fs.access(dst, fs.constants.F_OK, (err) => {
    if (err) {
      // 如果不存在则创建目录
      fs.mkdirSync(dst);
      callback(src, dst);
    } else {
      callback(src, dst);
    }
  });
};
const SOURCES_DIRECTORY = path.join(process.cwd(), "/user-webpack-config"); //源目录
const copyDirectory = path.join( // 需要拷贝的路劲
    __dirname,
    "/@webpack-cli/user-webpack-config"
  ); //目标
checkDirectory(
  SOURCES_DIRECTORY,
  copyDirectory,
  copy
);
