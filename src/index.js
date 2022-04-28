/*
 * @Date: 2022-04-24 11:14:20
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-28 17:01:36
 * @FilePath: /webpack-config/src/index.js
 * @Description:
 */
import React from "react";
// import ReactDOM from 'react-dom';
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App";  


const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>
);
