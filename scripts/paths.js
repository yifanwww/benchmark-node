const path = require('path');

const repository = path.join(__dirname, '..');

const jestDir = path.resolve(repository, 'scripts/jest');

const paths = {
    repository,

    // test

    jestConfig: path.resolve(jestDir, 'jest.config.js'),
    testSetup: path.resolve(repository, 'src/test.setup.ts'),
    transforms: {
        babel: path.resolve(jestDir, 'transform.babel.js'),
    },
};

module.exports = {
    paths,
};
