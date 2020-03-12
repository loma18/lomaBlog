const path = require("path");

module.exports = {
    devtool:'source-map',
    entry: { index: path.join(__dirname, "business.ts")},
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: { extensions: ['.ts', '.js'] },
}