module.exports = function (source) {
    const callback = this.async();
    const options = this.query;
    const { name } = options;
    // // 获取参数
    // console.log('name============', name);
    // // 获取代码
    // console.log('source========', source);
    callback(null, source);
};
