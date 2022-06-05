require('@babel/polyfill');
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackBar = require('webpackbar');
const HappyPack = require('happypack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
const os = require('os');
const { getArgv } = require('../../utils');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBuildDllPlugin = require('webpack-build-dll-plugin');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const { resolve } = path;
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 });
const WEB_ENV = getArgv('WEB_ENV'); // 环境参数

const NODE_ENV = process.env.NODE_ENV; // 环境参数
//    是否是生产环境
const isEnvProduction = NODE_ENV === 'production';
//   是否是测试开发环境
const isEnvDevelopment = NODE_ENV === 'development';

const cacheLoader = (happypackId) => {
    return isEnvDevelopment
        ? [
              `happypack/loader?id=${happypackId}&cacheDirectory=true`,
              'thread-loader',
              'cache-loader',
          ]
        : ['thread-loader', `happypack/loader?id=${happypackId}`];
};
// console.log("__dirname : " + __dirname);
// console.log("resolve   : " + resolve("./"));
// console.log("cwd       : " + process.cwd());
module.exports = {
    // 基目录，绝对路径，用于解析配置中的入口点和加载器。
    // context: path.join(process.cwd(), "/app"),
    // 入口
    entry: {
        // myVue: [path.join(process.cwd(), "/app/myVue.js")], // 公共包抽取
        index: [
            '@babel/polyfill',
            //添加编译缓存
            'webpack/hot/poll?1000',
            //  path.join(process.cwd(), "/app/index")
            //入口主文件
            path.join(process.cwd(), '/app/index'), // 如果没有配置 context 则需要这样引入  path.join(__dirname, "../../app/index")
        ],
    },
    // 出口
    output: {
        // 输出目录
        path: path.join(process.cwd(), '/dist'),
        // filename: '[name].[hash].js',
        // chunkFilename: '[name].[hash].js',
        // Chunk 配置
        filename: '[name].js',
        chunkFilename: '[name][contenthash].js',
        // 访问静态资源目录 比如 css img
        publicPath: '/',
        // 导出库(exported library)的名称
        library: 'server',
        //   导出库(exported library)的类型
        libraryTarget: 'umd',
        // 在 UMD 库中使用命名的 AMD 模块
        umdNamedDefine: true,
        globalObject: 'this',
        // chunk 请求到期之前的毫秒数，默认为 120000
        chunkLoadTimeout: 120000,
        // 「devtool 中模块」的文件名模板 调试webpack的配置问题
        // 你的文件在chrome开发者工具中显示为webpack:///foo.js?a93h, 。如果我们希望文件名显示得更清晰呢，比如说 webpack:///path/to/foo.js
        devtoolModuleFilenameTemplate: (info) => {
            // "webpack://[namespace]/[resource-path]?[loaders]"
            return `webpack:///${info.resourcePath}?${info.loaders}`;
        },
        // 如果多个模块产生相同的名称，使用
        devtoolFallbackModuleFilenameTemplate: (info) => {
            return `webpack:///${info.resourcePath}?${info.loaders}`;
        },
        // 如果一个模块是在 require 时抛出异常，告诉 webpack 从模块实例缓存(require.cache)中删除这个模块。
        // 并且重启webpack的时候也会删除cache缓存
        strictModuleExceptionHandling: true,
    },

    // 是否监听文件
    // watch: false,

    resolve: {
        // //决定请求是否应该被缓存的函数。函数传入一个带有 path 和 request 属性的对象。默认：
        // cachePredicate: () => {
        //   return true;
        // },
        plugins: [
            //如果在引用目录中没有index.js文件的时候。
            // 当require("component/foo")路径“component/foo”解析到目录时，
            // Webpack将尝试查找component/foo/foo.js作为条目.
            new DirectoryNamedWebpackPlugin({
                honorIndex: true, // defaults to false
                // 排除
                exclude: /node_modules/,
                //入口文件
                include: [path.join(process.cwd(), '/app')],
            }),
        ],
        // //启用，会主动缓存模块，但并不安全。传递 true 将缓存一切
        // unsafeCache: true,
        // 模块查找优先顺序配置
        // 1.配置模块的查找规则,
        // 2.导入 require('sql')，会先在node_modules下查找，然后再到app下查找
        // 相对路径是相对于webpack.config.js文件所在的路劲
        // 详细教程: https://blog.csdn.net/u012987546/article/details/97389078
        modules: [
            path.join(process.cwd(), '/node_modules'),
            path.join(process.cwd(), '/app'),
        ],
        // 可以省略引用后缀
        extensions: ['.tsx', '.ts', '.js', '.graphql', '.json', '.node'],
        // 1.不需要node polyfilss webpack 去掉了node polyfilss 需要自己手动添加
        //dllPlugin 插件需要的包
        alias: {
            buffer: 'buffer',
            crypto: 'crypto-browserify',
            vm: 'vm-browserify',
            crypto: false,
            stream: 'stream-browserify',
            '@': path.join(process.cwd(), '/app'),
        },
        // 2.手动添加polyfills
        fallback: {
            path: require.resolve('path-browserify'),
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            util: require.resolve('util/'),
            assert: require.resolve('assert/'),
            http: require.resolve('stream-http'),
        },
    },
    // 打包文件大小监听
    performance: {
        maxEntrypointSize: 1024 * 512, // 设置最大输入512kb的文件，如果大于他则发出警告
        maxAssetSize: 1024 * 256, // 设置最大输出256kb的文件，如果大于他则发出警告
        hints: 'warning',
        // 过滤文件
        assetFilter: function (assetFilename) {
            // console.log('assetFilename==========', assetFilename,assetFilename.endsWith('.js'))
            // 只要监听js文件，过滤其他文件判断
            return assetFilename.endsWith('.js');
        },
    },

    //选项决定文件系统快照的创建和失效方式。
    snapshot: {
        managedPaths: [path.join(process.cwd(), '/node_modules')],
        immutablePaths: [],
        buildDependencies: {
            hash: true,
            timestamp: true,
        },
        module: {
            timestamp: true,
        },
        resolve: {
            timestamp: true,
        },
        resolveBuildDependencies: {
            hash: true,
            timestamp: true,
        },
    },
    //在第一个错误出现时抛出失败结果，而不是容忍它
    bail: true,
    // 打包优化配置
    optimization: {
        //告知 webpack 去决定每个模块使用的导出内容。这取决于 optimization.providedExports 选项。
        //由 optimization.usedExports 收集的信息会被其它优化手段或者代码生成使用，比如未使用的导出内容不会被生成， 当所有的使用都适配，导出名称会被处理做单个标记字符
        usedExports: 'global',
        //告知 webpack 去辨识 package.json 中的 副作用 标记或规则，以跳过那些当导出不被使用且被标记不包含副作用的模块。
        sideEffects: true,
        //使用 optimization.emitOnErrors 在编译时每当有错误时，就会 emit asset。这样可以确保出错的 asset 被 emit 出来。关键错误会被 emit 到生成的代码中，并会在运行时报错
        emitOnErrors: true,
        //如果模块已经包含在所有父级模块中，告知 webpack 从 chunk 中检测出这些模块，或移除这些模块
        removeAvailableModules: true,
        //如果 chunk 为空，告知 webpack 检测或移除这些 chunk
        removeEmptyChunks: true,
        //告知 webpack 合并含有相同模块的 chunk
        mergeDuplicateChunks: true,
        //告知 webpack 确定和标记出作为其他 chunk 子集的那些 chunk，其方式是在已经加载过较大的 chunk 之后，就不再去加载这些 chunk 子集。
        flagIncludedChunks: true,
        //告知 webpack 去确定那些由模块提供的导出内容，为 export * = require( ... 生成更多高效的代码。
        providedExports: true,
        //告知 webpack 是否对未使用的导出内容，实施内部图形分析(graph analysis)。
        innerGraph: true,
        //在处理资产之后添加额外的散列编译通道，以获得正确的资产内容散列。如果realContentHash被设置为false，则使用内部数据来计算散列，当资产相同时，它可以更改。
        realContentHash: true,
        // Chunk start splitChunks [name].chunk  公共包抽取  vendor
        // 开启这个编译包更小
        // runtimeChunk: {
        //   name: (entrypoint) => `runtime~${entrypoint.name}`,
        // },
        //
        splitChunks: {
            name: false,
            chunks: 'all',
            // minSize: 20000,
            minRemainingSize: 0,
            // maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            automaticNameDelimiter: '~',
            enforceSizeThreshold: 50000,
            cacheGroups: {
                // vendor: {
                //     //第三方依赖
                //     priority: 1, //设置优先级，首先抽离第三方模块
                //     name: 'vendor',
                //     test: /node_modules/,
                //     chunks: 'initial',
                //     minSize: 0,
                //     minChunks: 1, //最少引入了1次
                // },
                // //缓存组
                // common: {
                //     //公共模块
                //     chunks: 'initial',
                //     name: 'common',
                //     minSize: 1000, //大小超过1000个字节
                //     minChunks: 3, //最少引入了3次
                // },
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
        // Chunk end
    },
    //配置node环境
    name: 'server',
    target: 'node',
    node: {
        __filename: true,
        __dirname: true,
        global: false,
    },
    // 捕获时机信息
    profile: true,
    // 限制并行处理模块的数量
    parallelism: 1, // number
    //统计信息(stats)
    stats: {
        // 未定义选项时，stats 选项的备用值(fallback value)（优先级高于 webpack 本地默认值）
        all: undefined,
        // 添加资源信息
        assets: true,
        // 对资源按指定的字段进行排序
        // 你可以使用 `!field` 来反转排序。
        assetsSort: 'field',
        // 添加构建日期和构建时间信息
        builtAt: true,
        // 添加缓存（但未构建）模块的信息
        cached: true,
        // 显示缓存的资源（将其设置为 `false` 则仅显示输出的文件）
        cachedAssets: true,
        // 添加 children 信息
        children: true,
        // 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出）
        chunks: true,
        // 将构建模块信息添加到 chunk 信息
        chunkModules: true,
        // 添加 chunk 和 chunk merge 来源的信息
        chunkOrigins: true,
        // 按指定的字段，对 chunk 进行排序
        // 你可以使用 `!field` 来反转排序。默认是按照 `id` 排序。
        chunksSort: 'field',
        // 用于缩短 request 的上下文目录
        // context: "../src/",
        // `webpack --colors` 等同于 显示日志不同的颜色
        colors: true,
        // 显示每个模块到入口起点的距离(distance)
        depth: true,
        // 通过对应的 bundle 显示入口起点
        entrypoints: true,
        // 添加 --env information
        env: true,
        // 添加错误信息
        errors: true,
        // 添加错误的详细信息（就像解析日志一样）
        errorDetails: true,
        // 将资源显示在 stats 中的情况排除
        // 这可以通过 String, RegExp, 获取 assetName 的函数来实现
        // 并返回一个布尔值或如下所述的数组。
        // excludeAssets: "filter" | /filter/ | (assetName) => ... return true|false |
        //   ["filter"] | [/filter/] | [(assetName) => ... return true|false],
        // 将模块显示在 stats 中的情况排除
        // 这可以通过 String, RegExp, 获取 moduleSource 的函数来实现
        // 并返回一个布尔值或如下所述的数组。
        // excludeModules: "filter" | /filter/ | (moduleSource) => ... return true|false |
        //   ["filter"] | [/filter/] | [(moduleSource) => ... return true|false],
        // // 和 excludeModules 相同
        // exclude: "filter" | /filter/ | (moduleSource) => ... return true|false |
        //   ["filter"] | [/filter/] | [(moduleSource) => ... return true|false],
        // 添加 compilation 的哈希值
        hash: true,
        // 设置要显示的模块的最大数量
        // maxModules: 15,
        // 添加构建模块信息
        modules: true,
        // 按指定的字段，对模块进行排序
        // 你可以使用 `!field` 来反转排序。默认是按照 `id` 排序。
        modulesSort: 'field',
        // 显示警告/错误的依赖和来源（从 webpack 2.5.0 开始）
        moduleTrace: true,
        // 当文件大小超过 `performance.maxAssetSize` 时显示性能提示
        performance: true,
        // 显示模块的导出
        providedExports: true,
        // 添加 public path 的信息
        publicPath: true,
        // 添加模块被引入的原因
        reasons: true,
        // 添加模块的源码
        source: true,
        // 添加时间信息
        timings: true,
        // 显示哪个模块导出被用到
        usedExports: true,
        // 添加 webpack 版本信息
        version: true,
        // 添加警告
        warnings: true,
        // 过滤警告显示（从 webpack 2.4.0 开始），
        // 可以是 String, Regexp, 一个获取 warning 的函数
        // 并返回一个布尔值或上述组合的数组。第一个匹配到的为胜(First match wins.)。
        // warningsFilter: "filter" | /filter/ | ["filter", /filter/] | (warning) => ... return true|false
    },

    //防止将某些 const      的包(package)打包到 bundle 中,而是在运行时(runtime)再去从外部获取这些扩展依赖
    externals: [
        //引入缓存
        nodeExternals({
            allowlist: ['webpack/hot/poll?1000'],
        }),
        //将node_modules目录下的所有模块加入到externals中    告知 webpack  ，并忽略 externals 中的模块
        (() => {
            const nodeModules = {};
            fs.readdirSync(path.join(process.cwd(), '/node_modules'))
                .filter((catalogue) => {
                    return ['.bin'].indexOf(catalogue) === -1;
                })
                .forEach((mod) => {
                    if (mod.indexOf('.') === 0) return;
                    nodeModules[mod] = 'commonjs ' + mod;
                });

            return nodeModules;
        })(),
    ],
    module: {
        rules: [
            {
                test: /(\.tsx?$)|(\.ts?$)/,
                use: ['awesome-typescript-loader'].concat(
                    isEnvDevelopment ? ['thread-loader', 'cache-loader'] : []
                ),
            },
            {
                include: path.join(process.cwd(), '/app'),
                sideEffects: true,
            },
            {
                test: /\.node$/,
                use: [
                    //   "happypack/loader?id=node&cacheDirectory=true",
                    //   // 'thread-loader',
                    //   //  WEB_ENV == 'test' ? '' : 'thread-loader',
                    //   ...(isEnvDevelopment ? ["thread-loader"] : []),
                    //   "cache-loader",
                    // {
                    //   loader: "thread-loader",
                    //   // 有同样配置的 loader 会共享一个 worker 池(worker pool)
                    //   options: {
                    //     // 产生的 worker 的数量，默认是 cpu 的核心数
                    //     workers: 2,
                    //     // 一个 worker 进程中并行执行工作的数量
                    //     // 默认为 20
                    //     workerParallelJobs: 50,
                    //     // 额外的 node.js 参数
                    //     workerNodeArgs: ['--max-old-space-size', '1024'],
                    //     // 闲置时定时删除 worker 进程
                    //     // 默认为 500ms
                    //     // 可以设置为无穷大， 这样在监视模式(--watch)下可以保持 worker 持续存在
                    //     poolTimeout: 2000,
                    //     // 池(pool)分配给 worker 的工作数量
                    //     // 默认为 200
                    //     // 降低这个数值会降低总体的效率，但是会提升工作分布更均一
                    //     poolParallelJobs: 50,
                    //     // 池(pool)的名称
                    //     // 可以修改名称来创建其余选项都一样的池(pool)
                    //     name: "my-pool"
                    //   }
                    // },
                ].concat(cacheLoader('node')),
                // 排除文件,因为这些包已经编译过，无需再次编译
                exclude: /(node_modules|bower_components)/,
                // use: {
                //   loader:"node-loader",
                //   options: {
                //     name: "[path][name].[ext]",
                //   },
                // },
            },
            {
                test: /\.m?js$/,
                enforce: 'pre',
                // 排除文件,因为这些包已经编译过，无需再次编译
                exclude: /(node_modules|bower_components)/,
                use: ['source-map-loader'].concat(cacheLoader('babel')),
                // use: {
                //  loader: "babel-loader",
                //   options: {
                //     presets: ["@babel/preset-env"],
                //     plugins: ["@babel/plugin-transform-runtime"],
                //   },
                // },
            },
            {
                test: /\.(graphql|gql)$/,
                // 排除文件,因为这些包已经编译过，无需再次编译
                exclude: /(node_modules|bower_components)/,
                use: [
                 
                ].concat(cacheLoader('graphql')),
                // use: {
                //   loader: "raw-loader",
                // },
            },
        ],
    },

    plugins: [
        // 加载该插件报错 找不到原因
        // new HardSourceWebpackPlugin({
        // // cacheDirectory是在高速缓存写入。默认情况下，将缓存存储在node_modules下的目录中，因此如
        // // 果清除了node_modules，则缓存也是如此
        // cacheDirectory: "node_modules/.cache/hard-source/[confighash]",
        // // Either an absolute path or relative to webpack's options.context.
        // // Sets webpack's recordsPath if not already set.
        // recordsPath: "node_modules/.cache/hard-source/[confighash]/records.json",
        // // configHash在启动webpack实例时转换webpack配置，并用于cacheDirectory为不同的webpack配
        // // 置构建不同的缓存
        // configHash: function (webpackConfig) {
        //   // node-object-hash on npm can be used to build this.
        //   return require("node-object-hash")({ sort: false }).hash(webpackConfig);
        // },
        // // 当加载器，插件，其他构建时脚本或其他动态依赖项发生更改时，hard-source需要替换缓存以确保输
        // // 出正确。environmentHash被用来确定这一点。如果散列与先前的构建不同，则将使用新的缓存
        // environmentHash: {
        //   root: process.cwd(),
        //   directories: [],
        //   files: ["package-lock.json", "yarn.lock"],
        // },
        // }),

        // dll start dll配置 在服务端 DllPlugin 用不了没办法加载js, 只有客户端才能用
        // 运行DllPlugin配置文件
        // new WebpackBuildDllPlugin({
        //   // dllConfigPath: required, your Dll Config Path, support absolute path.
        //   dllConfigPath: path.join(__dirname, "./webpack.dll.config.js"),
        //   forceBuild: false,
        // }),

        //    告诉webpack使用了哪些第三方库代码
        // new webpack.DllReferencePlugin({
        //   // vue 映射到json文件上去
        //   manifest: path.join(process.cwd(), "/dist/dllFile", "vue.manifest.json"),
        // }),
        // dll end dll配置
        // //体积包分析插件
        // new BundleAnalyzerPlugin(),

        //AggressiveSplittingPlugin 可以将 bundle 拆分成更小的 chunk，
        //直到各个 chunk 的大小达到 option 设置的 maxSize。它通过目录结构将模块组织在一起。
        // new webpack.optimize.AggressiveSplittingPlugin({
        //   // minSize: 30720/2, // 字节，分割点。默认：30720
        //   // maxSize: 51200/2, // 字节，每个文件最大字节。默认：51200
        //   // chunkOverhead: 0, // 默认：0
        //   // entryChunkMultiplicator: 1, // 默认：1
        // }),

     

        //  new HtmlWebpackPlugin(),

        //友好的错误WebPACK插件 错误提示插件
        //友好的错误认识webpackerrors WebPACK插件类  这是很容易添加类型的错误，所以如果你想看moreerrors得到处理
        new FriendlyErrorsPlugin(),
        //这个Webpack插件将强制所有必需模块的整个路径与磁盘上实际路径的确切情况相匹配。
        // 使用此插件有助于缓解OSX上的开发人员不遵循严格的路径区分大小写的情况，
        // 这些情况将导致与其他开发人员或运行其他操作系统（需要正确使用大小写正确的路径）的构建箱发生冲突。
        new CaseSensitivePathsPlugin(),
        // 开启多进程
        // awesome-typescript-loader 不支持
        // new HappyPack({
        //     id: 'typescript',
        //     use: [
        //         //添加loader
        //         {
        //             loader: 'awesome-typescript-loader',
        //             options: {
        //                 name: 'graphql',
        //             },
        //         },
        //         // "awesome-typescript-loader"
        //     ],
        //     // 输出执行日志
        //     verbose: true,
        //     // 使用共享线程池
        //     threadPool: happyThreadPool,
        // }),
        new HappyPack({
            id: 'node',
            use: ['node-loader'],
            // 输出执行日志
            verbose: true,
            // 使用共享线程池
            threadPool: happyThreadPool,
        }),
        new HappyPack({
            id: 'babel',
            //添加loader
            use: ['babel-loader'],
            // use: ["babel-loader", "unicode-loader"],
            // 输出执行日志
            verbose: true,
            // 使用共享线程池
            threadPool: happyThreadPool,
        }),
        new HappyPack({
            id: 'graphql',
            use: [
                //添加loader
                // {
                //     loader: path.join(
                //         __dirname,
                //         './defineLoader/MyExampleWebpackLoader.js'
                //     ),
                //     options: {
                //         name: 'graphql',
                //     },
                // },
                {
                    loader: 'raw-loader',
                    options: {},
                },
            ],
            // 输出执行日志
            verbose: true,
            // 使用共享线程池
            threadPool: happyThreadPool,
        }),

        // new HappyPack({
        //   id: "MyExampleWebpackLoader",
        //   use: [  //添加loader
        //     {
        //       loader: path.join(
        //         __dirname,
        //         "./defineLoader/MyExampleWebpackLoader.js"
        //       ),
        //       options: {
        //         name: "graphql",
        //       },
        //     },
        //     // "raw-loader",
        //   ],
        //   // 输出执行日志
        //   verbose: true,
        //   // 使用共享线程池
        //   threadPool: happyThreadPool,
        // }),
        // 编译ts插件
        new CheckerPlugin(),
        // 编译进度条
        new WebpackBar(),
        //清理编译目录
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
            //配置清理文件 如果不清理则加 ！
            cleanOnceBeforeBuildPatterns: ['*', '!dllFile*'],
            // cleanOnceBeforeBuildPatterns: [
            //   "index.html",
            //   "**/index*.js",
            //   "**/index*.css",
            // !./image/*
            // ],
        }),
        // //缓存包 热启动
        // new webpack.HotModuleReplacementPlugin(),

        //使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误
        new webpack.NoEmitOnErrorsPlugin(),
        //DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用
        // 如果是配置前端就很好注入插件
        new webpack.DefinePlugin({
            // vue,
            //注入一个环境变量
            'process.env': { BUILD_TARGET: 'BUILD_TARGET' },
        }),

        // webpack.BannerPlugin 为每一个头文件添加一个文件，这里可以加入公共文件
        // source-map-support 源映射(Source Map)是一种数据格式，它存储了源代码和生成代码之间的位置映射关系。
        new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false,
        }),
    ],
};
