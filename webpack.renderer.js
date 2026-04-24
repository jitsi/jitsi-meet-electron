const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    // The renderer code rus in BrowserWindow without node support so we must
    // target a web platform.
    target: 'web',
    entry: { app: './app/index.js' },
    performance: {
        maxAssetSize: 1.5 * 1024 * 1024,
        maxEntrypointSize: 1.5 * 1024 * 1024
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './app/index.html',
            filename: 'index.html',
            chunks: [ 'app' ]
        }),
        new HtmlWebpackPlugin({
            template: './app/meeting.html',
            filename: 'meeting.html',
            chunks: [ 'app' ]
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
        noParse: /external_api\\.js/,
        rules: [
            {
                loader: 'swc-loader',
                options: {
                    jsc: {
                        parser: {
                            syntax: 'ecmascript',
                            jsx: true
                        },
                        transform: {
                            react: {
                                runtime: 'classic'
                            }
                        },
                        target: 'es2022'
                    }
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
                test: /\.svg$/,
                use: [ {
                    loader: '@svgr/webpack',
                    options: {
                        dimensions: false,
                        expandProps: 'start'
                    }
                } ]
            }
        ]
    },
    externals: [ {
        '@jitsi/electron-sdk': 'require(\'@jitsi/electron-sdk\')'
    } ],
    resolve: {
        modules: [
            path.resolve('./node_modules')
        ]
    }
};

