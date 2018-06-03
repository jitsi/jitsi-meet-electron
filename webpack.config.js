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
    module: {
        rules: [
            {
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            require.resolve('babel-preset-env'),
                            { modules: false }
                        ],
                        require.resolve('babel-preset-react'),
                        require.resolve('babel-preset-stage-1')
                    ]
                },
                test: /\.js$/
            },
            {
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ],
                test: /\.css$/
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
        entry: { app: './app/index.js' },
        plugins: [
            new HtmlWebpackPlugin({
                template: './app/index.html'
            })
        ]
    },
    commonConfig)
];
