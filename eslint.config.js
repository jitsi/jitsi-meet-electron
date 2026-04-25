'use strict';

const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

const compat = new FlatCompat({
    baseDirectory: __dirname,
    resolvePluginsRelativeTo: __dirname,
    recommendedConfig: js.configs.recommended
});

// Rules removed from ESLint core in v9. Strip them from legacy configs loaded
// via FlatCompat so they do not cause "rule not found" errors.
// Reference: https://eslint.org/docs/v9.x/use/migrate-to-9.0.0#removed-rules
const REMOVED_CORE_RULES = new Set([
    'callback-return',
    'global-require',
    'handle-callback-err',
    'id-blacklist',
    'indent-legacy',
    'lines-around-directive',
    'newline-after-var',
    'newline-before-return',
    'no-buffer-constructor',
    'no-catch-shadow',
    'no-mixed-requires',
    'no-native-reassign',
    'no-negated-in-lhs',
    'no-new-require',
    'no-process-env',
    'no-process-exit',
    'no-restricted-modules',
    'no-spaced-func',
    'no-sync',
    'require-jsdoc',
    'valid-jsdoc'
]);

/**
 * Removes rules that no longer exist in ESLint 9 core from a set of flat
 * config objects returned by FlatCompat.
 *
 * @param {Array} configs - Flat config objects.
 * @returns {Array} Filtered flat config objects.
 */
function stripRemovedRules(configs) {
    return configs.map(config => {
        if (!config.rules) {
            return config;
        }
        const rules = { ...config.rules };

        for (const rule of REMOVED_CORE_RULES) {
            delete rules[rule];
        }

        return {
            ...config,
            rules
        };
    });
}

module.exports = [
    {
        ignores: [
            'build/**',
            'dist/**',
            'Jitsi Meet*/**',
            'app/features/conference/external_api.js'
        ]
    },
    ...stripRemovedRules(compat.extends('@jitsi/eslint-config')),
    {
        languageOptions: {
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    presets: [ '@babel/preset-react' ]
                }
            }
        },
        rules: {
            // ESLint 9 changed the default of caughtErrors to 'all', meaning
            // unused catch-binding variables are now reported. Preserve the
            // previous project behaviour by ignoring catch bindings that start
            // with an underscore (consistent with argsIgnorePattern). The
            // affected source files already use the _-prefix convention, so
            // this is a permanent project preference rather than a temporary
            // migration workaround.
            'no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_'
                }
            ]
        },
        settings: {
            react: {
                version: '17.0'
            }
        }
    },
    ...stripRemovedRules(
        compat.extends(
            '@jitsi/eslint-config/jsdoc',
            '@jitsi/eslint-config/react'
        )
    ).map(config => {
        return {
            ...config,
            files: [ 'app/**/*.js', 'app/**/*.jsx' ]
        };
    }),
    // eslint.config.js is a CommonJS file; override module settings so that
    // it is linted correctly without false positives for __dirname etc.
    {
        files: [ 'eslint.config.js' ],
        languageOptions: {
            sourceType: 'commonjs',
            globals: {
                __dirname: 'readonly',
                module: 'writable',
                require: 'readonly'
            }
        },
        rules: {
            strict: 'off'
        }
    }
];
