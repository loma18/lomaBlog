let webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const alias = require('./alias');

module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: 'bundle.[hash].js',
        publicPath: '/'
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
        port: 8080
    },
    resolve: {
        //  配置别名，在项目中可缩减引用路径
        alias: alias.alias()
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'lomaBlog',
            template: './src/index.html'
        }),
        new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['build/bundle.*.js'] })
    ]
};