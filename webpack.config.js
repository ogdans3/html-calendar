var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './calendar.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        libraryTarget: "commonjs2",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-env']
                }
            },
            {
                test: /\.css$/,
                loader: 'raw-loader',
            },
        ]
    },
    plugins: [
        new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /js$/),
    ],
    stats: {
        colors: true
    },
};
