/*
 * @Date: 2022-04-28 10:50:57
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-28 13:44:28
 * @FilePath: /webpack-config/@webpack/server/config/webpack.test.config.js
 * @Description: 
 */
import path from "path";
import fs from "fs";
//glob 获取目录下面所有文件
import glob from "glob";
export default {
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
