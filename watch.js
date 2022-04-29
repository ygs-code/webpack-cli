/*
 * @Date: 2022-04-29 18:46:31
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-29 18:47:58
 * @FilePath: /webpack-cli/watch.js
 * @Description:
 */
const chokidar = require("chokidar");

let watcher = null;
let ready = false;
const key = "modifyFiles";
let watch = function (filepath, options) {
  const { add, change, remove } = options;
  // 文件新增时
  function addFileListener(path_) {
    if (ready) {
      console.log("文件", path_, "has been added");
      add();
    }
  }
  function addDirecotryListener(path_) {
    if (ready) {
      console.log("目录", path_, "has been added");
      add();
    }
  }

  // 文件内容改变时
  function fileChangeListener(path_) {
    console.log("文件", path_, "已经修改");
    change();
  }

  // 删除文件
  function fileRemovedListener(path_) {
    console.log("文件", path_, "被删除了");
    remove();
  }

  // 删除目录时
  function directoryRemovedListener(path_) {
    console.info("目录", path_, "被删除了");
    remove();
  }

  if (!watcher) {
    watcher = chokidar.watch(filepath);
  }
  watcher
    .on("add", addFileListener)
    .on("addDir", addDirecotryListener)
    .on("change", fileChangeListener)
    .on("unlink", fileRemovedListener)
    .on("unlinkDir", directoryRemovedListener)
    .on("error", function (error) {
      console.info("发生了错误：", error);
    })
    .on("ready", function () {
      console.info("准备监听");
      ready = true;
    });
};
module.exports = watch;
// watch("E:\\work\\www.cccc.com\\");
