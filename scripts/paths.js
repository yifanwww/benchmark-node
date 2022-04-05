const path = require('path');

const repository = path.join(__dirname, '..');
const nodeModules = path.resolve(repository, 'node_modules');

const jestDir = path.resolve(repository, 'scripts/jest');

const paths = {
    repository,

    // test

    jestCache: path.resolve(nodeModules, '.cache/jest'),

    jestConfig: path.resolve(jestDir, 'jest.config.js'),
    testSetup: path.resolve(repository, 'src/test.setup.ts'),
    transforms: {
        babel: path.resolve(jestDir, 'transform.babel.js'),
    },
};

module.exports = {
    paths,
};
