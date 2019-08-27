let webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 引入 DllReferencePlugin
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
const HtmlIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; //将打包后的内容用canvas以图形的方式展示出来
const alias = require('./alias');

const dllArr = ['react', 'vendor'];
const dllRef = dllArr.map(item => {
    return (
        new DllReferencePlugin({
            // context: path.join(__dirname, '..', 'build'), //可不设置，如设置，必须和dll文件context保持一致
            name: `_dll_${item}`,
            // sourceType: "var", //对应dll文件中的libraryTarget,不可为commonjs2
            manifest: require(`../build/${item}.manifest.json`)
        })
    )
});
const tmpArr = dllArr.map(item => {
    return `./${item}.dll.js`;
})
const addDllHtmlPath = new HtmlIncludeAssetsPlugin({
    assets: tmpArr, // 添加的资源相对html的路径
    append: false // false 在其他资源的之前添加 true 在其他资源之后添加
});

module.exports = {
    mode: 'development',
    // mode: 'production',
    devtool: 'source-map',
    entry: { app: './src/app.js' },
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: 'bundle.[hash].js',
        publicPath: '/'
    },
    performance: { //控制性能提示
        maxEntrypointSize: 100000000, //默认250000 bytes
        maxAssetSize: 100000000, //默认250000 bytes
        hints: 'error' //错误级别：warning/error
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader',
                    {
                        loader: 'less-loader',
                        options: { javascriptEnabled: true }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(jpg|png|gif|mp3)$/,
                use: ['file-loader']
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, '../src'),
        compress: true,
        historyApiFallback: true,
        port: 8080,
        stats: { //打包时构建信息的显示内容及其颜色状态等配置
            builtAt: true,
            colors: true
        }
    },
    resolve: {
        //  配置别名，在项目中可缩减引用路径
        alias: alias.alias()
    },
    plugins: [
        ...dllRef,
        new HtmlWebpackPlugin({
            title: 'lomaBlog',
            template: './src/index.html',
            favicon: path.join(__dirname, '../src/assets/favicon.ico')
        }),
        addDllHtmlPath,
        new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*', '!react.*', '!vendor.*'] }),
        new BundleAnalyzerPlugin()
    ],
    optimization: {
        splitChunks: {
          chunks: 'initial',
          automaticNameDelimiter: '.',
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: 1
            }
          }
        },
        runtimeChunk: {
          name: entrypoint => `manifest.${entrypoint.name}`
        }
      }
};