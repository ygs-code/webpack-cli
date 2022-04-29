/*
 * @Date: 2022-04-27 18:44:12
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-27 18:46:25
 * @FilePath: /webpackClient1/@webpack/client/config/dev-client.js
 * @Description: 
 */
/* eslint-disable */
//热启动重新刷新浏览器
import "eventsource-polyfill";
import hotClient from "webpack-hot-middleware/client?noInfo=true&reload=true";

hotClient.subscribe((event) => {
  if (event.action === "reload") {
    window.location.reload();
  }
});
