module.exports = {
    'root': true,
    'extends': [
        '@jitsi/eslint-config'
    ],
    'settings': {
        'react': {
            'version': '17.0'
        }
    },
    'overrides': [
        {
            // The base config routes *.ts/*.tsx to '@jitsi/eslint-config/typescript'
            // (with @typescript-eslint/parser). That preset references a few
            // react/* rules, so the react plugin has to be registered for those
            // files. PropTypes are replaced by TypeScript types.
            'files': [ '*.ts', '*.tsx' ],
            'plugins': [ 'react' ],
            'rules': {
                'react/prop-types': 0,
                'react/react-in-jsx-scope': 2
            }
        }
    ]
};
