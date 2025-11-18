module.exports = {
    'extends': [
        '@jitsi/eslint-config'
    ],
    'parser': '@babel/eslint-parser',
    'parserOptions': {
        'requireConfigFile': false,
        'babelOptions': {
            'presets': [ '@babel/preset-react' ]
        }
    },
    'settings': {
        'react': {
            'version': '17.0'
        }
    }
};
