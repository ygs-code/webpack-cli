/*
 * @Date: 2022-04-24 11:14:20
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-07-04 18:03:27
 * @FilePath: /webpack-cli/src/index.js
 * @Description:
 */
import React from "react";
// import ReactDOM from 'react-dom';
import {createRoot} from "react-dom/client";
import "./App.css";
import App from "./App";
let a = 123;
let b = 456;
let c = 789;
let e = 100;
// pppp;

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
