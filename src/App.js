/*
 * @Date: 2022-04-24 11:14:32
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-12 20:40:16
 * @FilePath: /webpack-cli/src/App.js
 * @Description:
 */
import React, { Component } from "react";
import { Provider } from "react-redux";
// import Router from "./router/index";
import store from "./redux/store";
import Home from "@/pages/home";
import "./App.css";
// import "./index.css";
// asdfdsf
console.log("process=", process); // 'test'
/*global APP_CONFIG*/
var server_api_key = APP_CONFIG.api_key;
// 56789ghjk asdf
console.log( "APP_CONFIG=", APP_CONFIG);
console.log("process =", process); 

var ws = new WebSocket("ws://localhost:8089");
 
ws.onopen = function(evt) {
	console.log("Connection open ...");
	ws.send("Hello WebSockets!");
};
 
ws.onmessage = function(evt) {
	console.log("Received Message:  " + evt.data);
	ws.close();
};
 
ws.onclose = function(evt) {
	console.log(" Connection      closed.");
};

 asdf 
    // 阿斯顿发  
const App = () => {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
};

export default App;
