/*
 * @Date: 2022-04-27 18:44:12
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-29 18:25:29
 * @FilePath: /webpack-cli/@webpack-cli/client/dev-client-reload.js
 * @Description:
 */
/* eslint-disable */
//热启动重新刷新浏览器
require("eventsource-polyfill");
require("@babel/polyfill");
const hotClient = require("webpack-hot-middleware/client?noInfo=true&reload=true");

hotClient.subscribe((event) => {
  if (event.action === "reload") {
    window.location.reload();
  }
});
