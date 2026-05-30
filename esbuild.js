/* eslint-disable no-console */
/* eslint-env node */

/**
 * esbuild-based build for Jitsi Meet Electron.
 *
 * Replaces the previous dual webpack setup (webpack.main.js + webpack.renderer.js).
 * It produces, into ./build:
 *   - main.js     (Electron main process, CommonJS, Node target)
 *   - preload.js  (preload script, CommonJS, Node target)
 *   - app.js      (renderer bundle, IIFE, browser target)
 *   - app.css     (renderer styles extracted from imported .css)
 *   - index.html  (launcher window, from app/index.html)
 *   - meeting.html (meeting window, from app/meeting.html)
 *
 * Usage:
 *   node esbuild.js                     # production build of everything
 *   node esbuild.js --dev               # development build of everything
 *   node esbuild.js renderer --dev --watch   # watch+rebuild the renderer
 *   node esbuild.js main --dev          # build only main + preload
 */

const { transform: svgrTransform } = require('@svgr/core');
const { versions: electronChromiumVersions } = require('electron-to-chromium');
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const flags = process.argv.slice(2).filter(a => a.startsWith('--'));
const targets = process.argv.slice(2).filter(a => !a.startsWith('--'));

const isDev = flags.includes('--dev') || process.env.NODE_ENV === 'development';
const watch = flags.includes('--watch');
const mode = isDev ? 'development' : 'production';
const buildTargets = targets.length ? targets : [ 'main', 'renderer' ];

const OUTDIR = 'build';

const electronVersion = require('./package.json').devDependencies.electron.replace(/^\D*/, '');

/**
 * Resolves the Chromium major version that the given electron version ships,
 * using electron-to-chromium. The Chromium major is constant across an electron
 * major line, so we fall back to any known minor of the same major if the exact
 * minor is missing from the dataset.
 *
 * @param {string} version - The electron version (e.g. "41.1.0").
 * @returns {string} The Chromium major version (e.g. "146").
 */
function chromiumMajorFor(version) {
    const [ major, minor ] = version.split('.');
    const chromium = electronChromiumVersions[`${major}.${minor}`]
        || Object.keys(electronChromiumVersions)
            .filter(key => key.split('.')[0] === major)
            .map(key => electronChromiumVersions[key])
            .pop();

    if (!chromium) {
        throw new Error(
            `electron-to-chromium has no Chromium mapping for electron ${version}; `
            + 'update the electron-to-chromium devDependency.'
        );
    }

    return String(chromium).split('.')[0];
}

// Build for the exact runtime the pinned `electron` devDependency ships, so
// esbuild neither over-transpiles nor emits unsupported syntax (this replaces
// babel-preset-env's `targets: { electron }`). The renderer's Chromium target
// is derived from electron-to-chromium so it tracks electron bumps with no
// manual upkeep. electron's bundled Node.js is not exposed by that dataset, so
// MAIN_TARGET is set explicitly — re-check `process.versions.node` (inside
// electron) when bumping electron.
const RENDERER_TARGET = `chrome${chromiumMajorFor(electronVersion)}`;
const MAIN_TARGET = 'node24';

/**
 * esbuild plugin replacing @svgr/webpack: turns an imported .svg file into a
 * React component, preserving the previous options (dimensions: false,
 * expandProps: 'start').
 */
const svgrPlugin = {
    name: 'svgr',
    setup(build) {
        build.onLoad({ filter: /\.svg$/ }, async args => {
            const svg = await fs.promises.readFile(args.path, 'utf8');
            const contents = await svgrTransform(
                svg,
                {
                    dimensions: false,
                    expandProps: 'start',
                    plugins: [ '@svgr/plugin-jsx' ]
                },
                {
                    componentName: 'SvgComponent',
                    filePath: args.path
                }
            );

            return {
                contents,
                loader: 'jsx'
            };
        });
    }
};

/**
 * esbuild plugin that keeps the vendored, pre-bundled external_api.js usable.
 * It strips the dangling sourceMappingURL comment (the .map is not shipped),
 * standing in for webpack's `noParse` handling of that file.
 */
const externalApiPlugin = {
    name: 'external-api',
    setup(build) {
        build.onLoad({ filter: /external_api\.js$/ }, async args => {
            const code = await fs.promises.readFile(args.path, 'utf8');

            return {
                contents: code.replace(/\/\/# sourceMappingURL=.*$/m, ''),
                loader: 'js'
            };
        });
    }
};

/**
 * esbuild plugin replacing HtmlWebpackPlugin: renders index.html and
 * meeting.html from the templates in app/, injecting the bundled stylesheet
 * and script before </head> (the renderer is loaded as a plain deferred
 * script, exactly as before).
 */
const htmlPlugin = {
    name: 'html',
    setup(build) {
        build.onEnd(() => {
            const hasCss = fs.existsSync(path.join(OUTDIR, 'app.css'));
            const tags = [
                hasCss ? '<link rel="stylesheet" href="app.css">' : null,
                '<script defer src="app.js"></script>'
            ].filter(Boolean).join('\n');

            const pages = [
                [ 'app/index.html', 'index.html' ],
                [ 'app/meeting.html', 'meeting.html' ]
            ];

            for (const [ template, output ] of pages) {
                const html = fs.readFileSync(template, 'utf8')
                    .replace('</head>', `${tags}\n</head>`);

                fs.writeFileSync(path.join(OUTDIR, output), html);
            }
        });
    }
};

const common = {
    bundle: true,
    logLevel: 'info',
    legalComments: 'eof',
    minify: !isDev,
    sourcemap: isDev ? 'inline' : false,

    // webpack's `mode` injected this into both bundles via DefinePlugin; do the
    // same so bundled dependencies (in either process) see the build-time value.
    define: {
        'process.env.NODE_ENV': JSON.stringify(mode)
    }
};

const configs = {
    main: {
        ...common,
        entryPoints: {
            main: 'main.ts',
            preload: 'app/preload/preload.ts'
        },
        outdir: OUTDIR,
        platform: 'node',
        format: 'cjs',
        target: MAIN_TARGET,

        // electron is provided by the runtime; the rest are runtime
        // dependencies (package.json "dependencies") that ship in node_modules
        // and are required on demand. Everything else (devDependencies used by
        // the main process) gets bundled.
        external: [
            'electron',
            '@jitsi/electron-sdk',
            'electron-debug',
            'electron-reload'
        ]
    },
    renderer: {
        ...common,
        entryPoints: {
            app: 'app/index.tsx'
        },
        outdir: OUTDIR,
        platform: 'browser',
        format: 'iife',
        target: RENDERER_TARGET,
        jsx: 'transform',

        // JSX lives in .tsx files (auto-detected by esbuild). The vendored
        // external_api.js is plain JS, handled by externalApiPlugin below.
        loader: {
            '.png': 'file'
        },

        // The renderer runs without node integration; `global` is polyfilled
        // the way webpack's web target did. (process.env.NODE_ENV is defined in
        // the shared `common` config above.)
        banner: {
            js: 'var global = globalThis;'
        },
        plugins: [ svgrPlugin, externalApiPlugin, htmlPlugin ]
    }
};

/**
 * Builds (or watches) the requested targets.
 *
 * @returns {Promise<void>}
 */
async function run() {
    for (const name of buildTargets) {
        const config = configs[name];

        if (!config) {
            throw new Error(`Unknown build target: ${name}`);
        }

        if (watch) {
            const ctx = await esbuild.context(config);

            await ctx.watch();
            console.log(`[esbuild] watching ${name} (${mode})...`);
        } else {
            await esbuild.build(config);
            console.log(`[esbuild] built ${name} (${mode})`);
        }
    }
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
