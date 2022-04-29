/*
 * @Date: 2022-04-28 10:55:26
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-28 13:40:50
 * @FilePath: /webpack-config/user-webpack-config/defineLoader/MyExampleWebpackLoader.js
 * @Description: 
 */
const { getOptions } = require("loader-utils");

module.exports = function (source) {
    const callback = this.async();
    const options = getOptions(this);
    const { name } = options;
  // // // 获取参数
  // console.log('name============', name);
  // // // 获取代码
  // console.log('source========', source);
  callback(null, source);
};
