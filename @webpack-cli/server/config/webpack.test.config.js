/*
 * @Date: 2022-04-28 10:50:57
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-29 18:30:31
 * @FilePath: /webpack-cli/@webpack-cli/server/config/webpack.test.config.js
 * @Description:
 */
require("@babel/polyfill");
const path = require("path");
const fs = require("fs");
//glob 获取目录下面所有文件
const glob = require("glob");
module.exports = {
  entry: {
    ...((globalPath) => {
      let testJsFiles = {},
        pageName;

      glob.sync(globalPath).forEach((testJsPath) => {
        var basename = path.basename(testJsPath, path.extname(testJsPath));

        pageName = testJsPath.replace(/\.js$/g, "");

        pageName = pageName.split("/app/")[1];

        testJsFiles[pageName] = testJsPath;
      });

      return testJsFiles;
    })(path.resolve(process.cwd(), "./app/**/*.test.js")),
  },
};
