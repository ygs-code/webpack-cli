/*
 * @Date: 2022-04-28 10:57:42
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-29 18:31:50
 * @FilePath: /webpack-cli/@webpack-cli/index.js
 * @Description:
 */
require("@babel/polyfill");
const Server = require("./compiler-server");

module.exports = new Server();
