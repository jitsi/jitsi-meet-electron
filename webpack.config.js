const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ELECTRON_VERSION = require('./package.json').devDependencies.electron;

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
                exclude: /node_modules(?!(\/|\\)js-utils)/,
                loader: 'babel-loader',
                options: {
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
                loader: 'svg-inline-loader',
                test: /\.svg$/
            }
        ]
    },
    externals: [ {
        'jitsi-meet-electron-utils': 'require(\'jitsi-meet-electron-utils\')',
        'electron-debug': 'require(\'electron-debug\')'
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
