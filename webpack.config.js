const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = {
    output: {
        path: path.resolve('./build'),
        filename: '[name].js'
    },
    node: {
        __dirname: true
    },
    mode: 'development',
    module: {
        rules: [
            {
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                test: /\.js$/
            },
            {
                use: 'node-loader',
                test: /\.node$/
            }
        ]
    },
    externals: [ {
        'jitsi-meet-electron-utils': 'require(\'jitsi-meet-electron-utils\')'
    } ],
    resolve: {
        modules: [
            path.resolve('./node_modules')
        ]
    }
};

module.exports = [
    Object.assign({
        target: 'electron-main',
        entry: { main: './main.js' }
    },
    commonConfig),
    Object.assign({
        target: 'electron-renderer',
        entry: { renderer: './windows/jitsi-meet/src/index.js' },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Jitsi Meet',
                template: path.resolve('./templates/index.html')
            })
        ]
    },
    commonConfig)
];
