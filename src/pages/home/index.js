/*
 * @Date: 2022-04-24 11:14:59
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-24 11:15:56
 * @FilePath: /webpackClient/src/pages/home/index.js
 * @Description:
 */

import React, {
  Suspense,
  lazy,
  useState,
  useCallback,
  Children,
  useEffect,
  memo,
} from "react";
import "./index.less";

// 权限跳转登录页面可以在这控制
const Index = memo((props) => {
  return <div className="home">Home</div>;
});

export default Index;
