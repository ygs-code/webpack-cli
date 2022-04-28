/*
 * @Date: 2022-04-24 11:14:32
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-28 18:12:28
 * @FilePath: /webpack-config/src/App.js
 * @Description:
 */
import React, { Component } from "react";
import { Provider } from "react-redux";
// import Router from "./router/index";
import store from "./redux/store";
import "./App.css";
// import "./index.css";




   console.log('process=',process); // 'test'

 

var server_api_key = APP_CONFIG.api_key;

console.log("APP_CONFIG=", APP_CONFIG);
// console.log("process=", process);

debugger;

const App = () => {
  return (
    <Provider store={store}>
      ooooooo12323 asdfsdf 2134234 9900909 asdfdsf asdf
    </Provider>
  );
};

export default App;
