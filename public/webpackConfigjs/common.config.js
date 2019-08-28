const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const alias = require('./alias');

module.exports = {
    entry: { app: path.join(__dirname,'../src/app.js') },
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
    resolve: {
        //  配置别名，在项目中可缩减引用路径
        alias: alias.alias()
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'lomaBlog',
            template: './src/index.html',
            favicon: path.join(__dirname, '../src/assets/favicon.ico')
        })
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