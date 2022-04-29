/*
 * @Date: 2022-04-27 11:20:14
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-28 13:43:21
 * @FilePath: /webpack-config/@webpack/webpack.test.config.js
 * @Description: 
 */
import path from 'path';
import fs from 'fs';
//glob 获取目录下面所有文件
import glob from 'glob';
export default {
    entry: {
        ...((globalPath) => {
            let testJsFiles = {},
                pageName;

            glob.sync(globalPath).forEach((testJsPath) => {
                var basename = path.basename(
                    testJsPath,
                    path.extname(testJsPath)
                );
                // console.log('match=', testJsPath.match(/\.js$/g));
                pageName = testJsPath.replace(/\.js$/g, '');
                // console.log('pageName1===', pageName);
                pageName = pageName.split('/app/')[1];
                // console.log('pageName2===', pageName);
                testJsFiles[pageName] = testJsPath;
            });
            // console.log('jsFiles==', testJsFiles);
            return testJsFiles;
        })(path.resolve(process.cwd(), './app/**/*.test.js')),
    },
};
