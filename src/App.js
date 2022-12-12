/*
 * @Date: 2022-04-24 11:14:32
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-07-05 15:35:37
 * @FilePath: /webpack-cli/src/App.js
 * @Description:
 */
import React, {Component} from "react";
import {Provider} from "react-redux";
// import Router from "./router/index";
import store from "./redux/store";
import Home from "@/pages/home";
// import admin from "./admin.sql";
// import json from  './data.json'
import "./App.css";
import "./App1.less";
import "./App3.scss";
console.log("process ==", process); // 'test'
/*global APP_CONFIG*/
var server_api_key = APP_CONFIG.api_key;
console.log("APP_CONFIG=", APP_CONFIG);

console.log(
  "process asd 阿斯顿发斯蒂芬   asdf asdf sasd fsdf    f asdfsadf sadf asdfasdf  dyuiopguysttyfugiho asdf asdfsdf 安师大发生地方  gd dsf   sadf asdf=  ",
  process
);

// console.log("admin===========", admin);

// 撒地方;
// 阿斯顿发
const App = () => {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
};

export default App;
