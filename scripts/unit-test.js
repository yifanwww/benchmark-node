#!/usr/bin/env node

'use strict';

const child = require('child_process');
const { paths } = require('./paths');

const genCommand = (...params) => params.filter(Boolean).join(' ');

/** @param {boolean} watch */
function unitTest(watch) {
    const argv = process.argv.slice(2);

    const command = genCommand('jest', '--config', paths.jestConfig, watch ? '--watch' : '--coverage', ...argv);
    // console.log(command);

    const env = {
        ...process.env,
        BABEL_ENV: 'test',
        NODE_ENV: 'test',
    };

    child.execSync(command, { env, stdio: 'inherit' });
}

unitTest(process.env.npm_lifecycle_event === 'test');
