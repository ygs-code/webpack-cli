/*
 * @Date: 2022-04-24 11:14:32
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-09 12:10:18
 * @FilePath: /webpack-cli/src/App.js
 * @Description:
 */
import React, { Component } from "react";
import { Provider } from "react-redux";
// import Router from "./router/index";
import store from "./redux/store";
import "./App.css";
// import "./index.css";

console.log("process=", process); // 'test'

var server_api_key = APP_CONFIG.api_key;
// 56789ghjk
console.log("APP_CONFIG=", APP_CONFIG);
// console.log("process=", process);

const App = () => {
  return <Provider store={store}>23 adasf sdf4 sdf sd3asdf44</Provider>;
};

export default App;
