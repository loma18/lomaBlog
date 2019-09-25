const merge = require('webpack-merge');
const commonConfig = require('./common.config');

const prodConfig = {
    mode: 'production',
    devtool: 'cheap-module-source-map',
};

const prodWebpackConfig = merge(commonConfig, prodConfig);

module.exports = prodWebpackConfig;