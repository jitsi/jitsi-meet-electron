module.exports = {
    'extends': [
        '@jitsi/eslint-config'
    ],
    'overrides': [
        {
            'files': [ '*.js', '*.jsx' ],
            'parser': 'espree',
            'parserOptions': {
                'ecmaFeatures': {
                    'jsx': true
                },
                'ecmaVersion': 2022,
                'sourceType': 'module'
            }
        }
    ],
    'settings': {
        'react': {
            'version': '17.0'
        }
    }
};
