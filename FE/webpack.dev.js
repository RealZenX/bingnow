const {merge} = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        static: './dist',
        historyApiFallback: true,
        open: true,
    }
});