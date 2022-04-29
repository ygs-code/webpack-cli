const path = require("path");
const DllPlugin = require("webpack/lib/DllPlugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const WebpackBar = require("webpackbar");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const os = require("os");
//添加smp.wrap
const smp = new SpeedMeasurePlugin();
module.exports = smp.wrap({
  // node: {
  //   // __filename: true,
  //   // __dirname: true,
  //   fs: 'empty',
  //   net:'empty',
  //   tls:'empty',
  // },
  // 入口文件
  entry: {
    // 项目中用到该两个依赖库文件
    //编译vue dll文件
    vue: [path.join(__dirname, "../../node_modules/vue")],
    // myVue: [path.join(__dirname, "myVue.js")],

    //编译react dll文件
    // react: [path.join(__dirname, "../../node_modules/react")],
    // 编译不了koa和mysql 会报错。 难道是不能编译后端包？
    // koa: [path.join(__dirname, "../../node_modules/koa/dist/koa.mjs")],
    // mysql: [path.join(__dirname, "../../node_modules/_mysql@2.18.1@mysql")],
  },
  optimization: {
    // 压缩
    minimize: true,
    minimizer: [
      new TerserPlugin({
        // sourceMap: "eval",
        // include: /\/includes/,// 包括
        exclude: /(node_modules|bower_components)/, // 排除
        extractComments: "all", //将注释剥离到单独的文件中
        terserOptions: {
          parse: {
            // We want terser to parse ecma 8 code. However, we don't want it
            // to apply any minification steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending further investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 0,
          },
          mangle: {
            safari10: true,
          },
          // Added for profiling in devtools
          // keep_classnames: isEnvProductionProfile,
          // keep_fnames: isEnvProductionProfile,
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
        parallel: os.cpus().length - 1,
        // minify: (file, sourceMap) => {
        //   // https://github.com/mishoo/UglifyJS2#minify-options
        //   const uglifyJsOptions = {
        //     /* your `uglify-js` package options */
        //   };

        //   if (sourceMap) {
        //     uglifyJsOptions.sourceMap = {
        //       content: sourceMap,
        //     };
        //   }

        //   return require('uglify-js').minify(file, uglifyJsOptions);
        // },
      }),
    ],
  },
  resolve: {
    // 1.不需要node polyfilss webpack 去掉了node polyfilss 需要自己手动添加
    alias: {
      crypto: false,
      stream: "stream-browserify",
    },
    // 2.手动添加polyfills
    fallback: {
      path: require.resolve("path-browserify"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util/"),
      assert: require.resolve("assert/"),
      http: require.resolve("stream-http"),
      timers: require.resolve("timers-browserify"),
    },
  },

  // 输出文件
  output: {
    // 文件名称
    filename: "[name].dll.js",
    // filename: "[name]-dll.[hash:8].js", // 分离出来的第三方插件文件名称
    // 将输出的文件放到dist目录下
    path: path.resolve("/dist/dllFile"),
    /*
     存放相关的dll文件的全局变量名称，比如对于jquery来说的话就是 _dll_jquery, 在前面加 _dll
     是为了防止全局变量冲突。
    */
    library: "_dll_[name]",
  },
  plugins: [
    //编译进度条
    new WebpackBar(),
    // 清除之前的dll文件
    new CleanWebpackPlugin(),
    // 使用插件 DllPlugin
    new DllPlugin({
      /*
       该插件的name属性值需要和 output.library保存一致，该字段值，也就是输出的 manifest.json文件中name字段的值。
       比如在jquery.manifest文件中有 name: '_dll_jquery'
      */
      name: "_dll_[name]",
      /* 生成manifest文件输出的位置和文件名称 */
      path: path.join(__dirname, "../../dist/dllFile", "[name].manifest.json"),
    }),
  ],
});
