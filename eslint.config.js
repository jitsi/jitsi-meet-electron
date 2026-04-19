const globals = require('globals');
const js = require('@eslint/js');
const reactPlugin = require('eslint-plugin-react');

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
        plugins: {
            ...reactPlugin.configs.flat.recommended.plugins
        },
        languageOptions: {
            ...reactPlugin.configs.flat.recommended.languageOptions,
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
            ...reactPlugin.configs.flat.recommended.rules,
            'no-redeclare': 'off',
            'no-unused-vars': [ 'error', {
                argsIgnorePattern: '^_',
                caughtErrors: 'none',
                varsIgnorePattern: '^React$'
            } ],
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off'
        },
        settings: {
            react: {
                version: '17.0'
            }
        }
    }
];
