const path = require('path');

module.exports = {
    target: 'electron-main',
    entry: { main: './main.js',
        preload: './app/preload/preload.js' },
    output: {
        path: path.resolve('./build'),
        filename: '[name].js'
    },
    node: {
        __dirname: true
    },
    externals: [ {
        '@jitsi/electron-sdk': 'require(\'@jitsi/electron-sdk\')',
        'electron-debug': 'require(\'electron-debug\')',
        'electron-reload': 'require(\'electron-reload\')'
    } ],
    resolve: {
        modules: [
            path.resolve('./node_modules')
        ]
    }
};

