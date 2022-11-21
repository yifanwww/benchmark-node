const fs = require('fs');

const { paths } = require('../paths');

/** @returns {import('@jest/types').Config.InitialOptions} */
function getConfig() {
    const hasTestSetup = fs.existsSync(paths.testSetup);

    return {
        rootDir: paths.repository,
        roots: ['<rootDir>/src'],
        cacheDirectory: paths.jestCache,

        setupFilesAfterEnv: hasTestSetup ? [paths.testSetup] : [],

        collectCoverageFrom: ['src/**/*.ts', '!src/**/__tests__/**/*.ts', '!src/**/*.d.ts', '!src/test.setup.ts'],
        testMatch: ['<rootDir>/src/**/*.{spec,test}.ts'],

        transform: {
            '^.+\\.(js|mjs|cjs|ts)$': paths.transforms.babel,
        },
        transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$'],

        modulePaths: [],
        moduleFileExtensions: ['js', 'json', 'node', 'ts'],

        // https://jestjs.io/docs/configuration/#resetmocks-boolean
        resetMocks: true,
        // https://jestjs.io/docs/configuration/#restoremocks-boolean
        restoreMocks: true,
    };
}

module.exports = getConfig();
