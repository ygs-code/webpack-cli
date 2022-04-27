/*
 * @Date: 2022-04-22 15:09:17
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-22 15:21:11
 * @FilePath: /error-sytem/server/scripts/webpack/config/webpack.prd.config.js
 * @Description: 
 */
import path from 'path';

import TerserPlugin from 'terser-webpack-plugin';
import os from 'os';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
export default {
    mode:'production',
    watch: false,
    optimization: {
        // 压缩
        minimize: true,
        //在设置为 true 时，告知 webpack 通过将导入修改为更短的字符串，来减少 WASM 大小。这会破坏模块和导出名称。
        mangleWasmImports: true,
        //  任何字符串：用于设置 process.env.NODE_ENV 的值。
        nodeEnv: 'production',
        // 最快的chunk id 加载
        moduleIds: 'size',
        /*
    允许控制导出处理(export mangling)。
     默认 optimization.mangleExports: 'deterministic' 会在 production 模式下 启用而其它情况会被禁用
    */
        mangleExports: true,
        minimizer: [
            new TerserPlugin({
                // sourceMap: "eval",
                // include: /\/includes/,// 包括
                exclude: /(node_modules|bower_components)/, // 排除
                extractComments: 'all', //将注释剥离到单独的文件中
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
                        // sourceMap: true, // Must be set to true if using source-maps in production
                        drop_debugger: true, // 去掉所有的debugger
                        drop_console: true, // 去掉所有的console
                        pure_funcs: ['console.log'], //移除console
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
                // 打开这个插件可以让 webpack 不编译把中文编译 unicode 编码
                // minify(file, sourceMap) {
                //   // https://github.com/mishoo/UglifyJS2#minify-options
                //   const uglifyJsOptions = {
                //     /* your `uglify-js` package options */
                //   };

                //   if (sourceMap) {
                //     uglifyJsOptions.sourceMap = {
                //       content: sourceMap,
                //     };
                //   }

                //   return require("terser").minify(file, uglifyJsOptions);
                // },
            }),
        ],
    },
    devtool: 'eval', // 生产环境和开发环境判断
    mode: 'production',
    plugins: [
        //体积包分析插件
        // new BundleAnalyzerPlugin(),
    ],
};
