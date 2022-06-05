/*
 * @Date: 2022-04-29 18:16:58
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-29 18:34:03
 * @FilePath: /webpack-cli/@webpack-cli/utils.js
 * @Description: 
 */
const getArgv = (key) => {
  const argv = process.argv;
  const reg = new RegExp(`^${key}\\=\\w+`, "g");
  let value = null;
  for (const item of argv) {
    if (reg.test(item)) {
      value = item;
    }
  }
  if (value === null) {
    return value;
  }
  value = value.split("=")[1];
  return value;
};

// 节流函数
const throttle = (() => {
  let startTime = null;
  return (time, callback) =>
    new Promise((resolve, reject) => {
      let nowTime = new Date().getTime();
      if (!startTime || nowTime - startTime > time) {
        startTime = nowTime;
        callback && callback instanceof Function && callback();
        resolve();
        // callback&&callback()
      }
    });
})();

// 防抖函数
const stabilization = (() => {
  let timer = null;
  return (time, callback) => {
    return new Promise((resolve, reject) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback && callback instanceof Function && callback();
        resolve();
      }, time);
    });
  };
})();

module.exports = {
  getArgv,
  throttle,
  stabilization,
};
