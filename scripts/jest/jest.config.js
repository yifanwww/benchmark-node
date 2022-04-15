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

        collectCoverageFrom: [
            'src/**/*.ts',
            '!src/**/__tests__/**/*.ts',
            '!src/**/*.d.ts',
            '!src/test.setup.ts',
            '!src/TestTools/*.ts',
        ],
        testMatch: ['<rootDir>/src/**/*.{spec,test}.ts'],
        testPathIgnorePatterns: ['<rootDir>/src/TestTools'],

        transform: {
            '^.+\\.(js|mjs|cjs|ts)$': paths.transforms.babel,
        },
        transformIgnorePatterns: [
            '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
            '^.+\\.module\\.(css|sass|scss)$',
        ],

        modulePaths: [],
        moduleFileExtensions: ['js', 'json', 'node', 'ts'],

        resetMocks: true,
    };
}

module.exports = getConfig();
