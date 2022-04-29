
# 基于webpack配置脚手架

不依赖任何框架，可以用vue，react，node服务端。配置接口遵循webpack配置，可以在webpack默认配置下预留接口给用户自行配置等功能。



## webpack-config 配置说明

### @webpack 目录中

有两个文件夹 一个是client文件夹，另外一个是server文件夹，

#### client文件夹

  client文件夹是客户端的webpack配置，分别有

  ````
dev-client-reload.js  热启动刷新js文件
webpack.base.config   基础base配置
webpack.dev.config    dev环境配置
webpack.dll.config    dll 打包
webpack.prod.config   生产环境配置
  ````

入口是  src目录 出口是dit





#### server文件夹

server文件夹是客户端的webpack配置，分别有

```
dev-client-reload.js  热启动刷新js文件
webpack.base.config   基础base配置
webpack.dev.config    dev环境配置
webpack.dll.config    dll 打包
webpack.prod.config   生产环境配置
```

 入口是 app目录 出口是dit 

## 自行定义webpack配置

如果用户想自行定义webpack配置的话，可以在user-webpack-config目录下有两个配置文件

```
webpack.dev.config    dev环境配置
webpack.prod.config   生产环境配置
```

有两个目录是放Loader或者Plugin的
