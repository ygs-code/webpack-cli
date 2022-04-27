/*
 * @Date: 2022-04-24 11:07:22
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-24 12:36:00
 * @FilePath: /webpackClient/scripts/webpack/config/bannerPlugin.js
 * @Description: 
 */
// 改配置为提取公共包避免在webpack中打包，在node环境和浏览器环境他们之间还是有些区别
export default [
    // {
    //   // 注入 koa 兼容
    //   variable: "koa",
    //   packageName: "koa",
    // },
    // {
    //   // 注入 mysql 兼容
    //   variable: "mysql",
    //   packageName: "mysql",
    // },
    // {
    //     // 注入es6 兼容
    //     variable: '',
    //     packageName: '@babel/polyfill',
    // },
];
