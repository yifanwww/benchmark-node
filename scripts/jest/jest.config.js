const fs = require('fs');

const { paths } = require('../paths');

/** @returns {import('@jest/types').Config.InitialOptions} */
function getConfig() {
    const hasTestSetup = fs.existsSync(paths.testSetup);

    return {
        rootDir: paths.repository,
        roots: ['<rootDir>/src'],

        collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/test.setup.ts'],

        setupFilesAfterEnv: hasTestSetup ? [paths.testSetup] : [],

        testMatch: ['<rootDir>/src/**/__tests__/**/*.ts', '<rootDir>/src/**/*.{spec,test}.ts'],
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
