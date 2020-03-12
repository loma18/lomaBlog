const path = require("path");
// const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    devtool:'source-map',
    entry: { bundle: path.join(__dirname, "App", "grid","canvas.grid.core.ts")},
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                // 对所有引入的tsx文件进行解析
                test: /\.ts?$/,
                loader: 'ts-loader',
                // exclude: /node_modules/,
                // options: {
                //     // 自动将所有.vue文件转化为.vue.tsx文件
                //     appendTsSuffixTo: [/\.vue$/]
                // }
            }
        ]
    },
    // plugins: [
        // new htmlWebpackPlugin({
        //     title: 'canvas component',
        // })
    // ],
    resolve: { extensions: ['.ts', '.js'] },
    // devServer: {
    //     contentBase: path.resolve(__dirname, 'dist'),
    //     host: '127.0.0.1',
    //     compress: true,
    //     port: 8080
    // }
}