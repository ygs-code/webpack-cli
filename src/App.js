/*
 * @Date: 2022-04-24 11:14:32
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-06-01 10:33:23
 * @FilePath: /webpack-cli/src/App.js
 * @Description:
 */
import React, { Component } from 'react'
import { Provider } from 'react-redux'
// import Router from "./router/index";
import store from './redux/store'
import Home from '@/pages/home'
// import json from './data.json'
import './App.css'
import './App1.less'
import './App3.scss'
console.log('process ==', process) // 'test'
/*global APP_CONFIG*/
var server_api_key = APP_CONFIG.api_key
  
console.log(' APP_CONFIG=', APP_CONFIG)
console.log('process=', process)
  // console.log('json=', json) 
  
  

//  pppp
// 阿斯顿发
const App = () => {
  return ( 
    <Provider store={store}>
      <Home />
    </Provider>
  )
}

export default App
