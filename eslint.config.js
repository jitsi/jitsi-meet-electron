const globals = require('globals');
const js = require('@eslint/js');

module.exports = [
    {
        ignores: [
            'Jitsi Meet*',
            'build/**',
            'dist/**',
            'app/features/conference/external_api.js'
        ]
    },
    {
        ...js.configs.recommended,
        files: [ '**/*.{js,jsx}' ],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.commonjs,
                ...globals.es2021,
                ...globals.jasmine
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        linterOptions: {
            reportUnusedDisableDirectives: 'off'
        },
        rules: {
            'no-redeclare': 'off',
            'no-unused-vars': [ 'error', {
                argsIgnorePattern: '^_',
                caughtErrors: 'none',
                varsIgnorePattern: '^React$'
            } ]
        }
    }
];
