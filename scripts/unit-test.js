#!/usr/bin/env node

'use strict';

const child = require('child_process');
const { paths } = require('./paths');

const genCommand = (...params) => params.filter(Boolean).join(' ');

/** @param {boolean} watch */
function unitTest(watch) {
    const coverage = process.argv.includes('--coverage');
    const verbose = process.argv.includes('--verbose');

    const command = genCommand(
        'jest',
        '--config',
        paths.jestConfig,
        watch ? '--watch' : '--coverage',
        watch && coverage ? '--coverage' : null,
        verbose && '--verbose',
    );

    const env = {
        ...process.env,
        BABEL_ENV: 'test',
        NODE_ENV: 'test',
    };

    child.execSync(command, { env, stdio: 'inherit' });
}

unitTest(process.env.npm_lifecycle_event === 'test');
