const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ELECTRON_VERSION = require('./package.json').devDependencies.electron;

module.exports = {
    target: 'electron-renderer',
    entry: { app: './app/index.js' },
    plugins: [
        new HtmlWebpackPlugin({
            template: './app/index.html'
        })
    ],
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
                exclude: /node_modules(?!(\/|\\)js-utils)/,
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    presets: [
                        [
                            require.resolve('babel-preset-env'),
                            {
                                modules: false,
                                targets: {
                                    electron: ELECTRON_VERSION
                                }
                            }
                        ],
                        require.resolve('babel-preset-react'),
                        require.resolve('babel-preset-stage-1')
                    ],
                    plugins: [
                        require.resolve('babel-plugin-inline-react-svg')
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
            },
            {
                use: 'file-loader',
                test: /\.png$/
            },
            {
                loader: 'svg-inline-loader',
                test: /\.svg$/
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

