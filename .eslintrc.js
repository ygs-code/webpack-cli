/*
 * @Date: 2022-04-29 09:54:47
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-29 10:32:53
 * @FilePath: /webpack-config/.eslintrc.js
 * @Description:
 */
module.exports = {
  root: true, // 作用的目录是根目录
  parser: "babel-eslint",
  // 指定代码运行的宿主环境
  env: {
    browser: true, // 浏览器
    node: true, // node
    /*
        支持 ES6 语法并不意味着同时支持新的 ES6 全局变量或类型（比如 Set 等新类型）。
        对于 ES6 语法，使用 { "parserOptions": { "ecmaVersion": 6 } }
        * */
    es6: true,
  },
  //   extends: "eslint:recommended", //导入推荐规则  npm install -D eslint-config-airbnb  使用airbnb规则
  extends: [
    /*
    引入standard代码规范
    * */
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    // "standard",
    // "airbnb",
  ],
  //   globals: {
  //     Atomics: "readonly",
  //     SharedArrayBuffer: "readonly",
  //   },
  //   parserOptions: {
  //     ecmaVersion: 2018,
  //     sourceType: "module", //按照模块解析
  //   },

  rules: {
    semi: "error",
    // "prefer-destructuring": 1, //优先使用数组和对象解构
    // "no-empty-pattern": 1, //禁止使用空解构模式
    // "no-undef": 1, //禁用未声明的变量，除非它们在 /*global */ 注释中被提到
    // // "no-shadow": 1, //禁止变量声明与外层作用域的变量同名
    // // "vars-on-top": 1, //要求所有的 var 声明出现在它们所在的作用域顶部
    // "no-var": 1, //对var警告
    // "no-unused-vars": [1, { vars: "all", args: "none" }], //不能有声明后未被使用的变量或参数
    // "no-const-assign": 1, //禁止修改const声明的变量
    // "no-dupe-keys": 1, //在创建对象字面量时不允许键重复
    // "no-duplicate-case": 1, //switch中的case标签不能重复
    // "no-dupe-args": 1, //函数参数不能重复
    // "no-func-assign": 1, //禁止重复的函数声明
    // "no-redeclare": 1, //禁止重复声明变量
    // "no-spaced-func": 1, //函数调用时 函数名与()之间不能有空格
    // "no-this-before-super": 1, //在调用super()之前不能使用this或super
    // "no-use-before-define": 1, //未定义前不能使用
    // "no-else-return": 1, //如果if语句里面有return,后面不能跟else语句
    // "no-fallthrough": 1, //禁止switch穿透
    // "no-multiple-empty-lines": [1, { max: 2 }], //空行最多不能超过2行
    // "no-return-assign": 1, //return 语句中不能有赋值表达式
    // "no-shadow": 2, //外部作用域中的变量不能与它所包含的作用域中的变量或参数同名
    // "consistent-this": [2, "that"], //this别名
    // "default-case": 2, //switch语句最后必须有default
    //   "eqeqeq": 2,//必须使用全等
  },
};
