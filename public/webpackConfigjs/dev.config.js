const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const commonConfig = require('./common.config');
// 引入 DllReferencePlugin
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
const HtmlIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; //将打包后的内容用canvas以图形的方式展示出来

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

const devConfig = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, '../build'),
        compress: true,
        historyApiFallback: true,
        port: 80,
        hot: true,
        stats: { //打包时构建信息的显示内容及其颜色状态等配置
            builtAt: true,
            colors: true
        }
    },
    plugins: [
        ...dllRef,
        addDllHtmlPath,
        new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*', '!react.*', '!vendor.*'] }),
        // new webpack.HotModuleReplacementPlugin() //react用react-hot-loader替代
        // new BundleAnalyzerPlugin()
    ],
};

// const devWebpackConfig = merge({
// 	customizeArray(a, b, key) {
// 		/*entry.app不合并，全替换*/
// 		if (key === 'entry.app') {
// 			return b;
// 		}
// 		return undefined;
// 	}
// })(commonConfig, devConfig);
const devWebpackConfig = merge(commonConfig, devConfig);

module.exports = devWebpackConfig;