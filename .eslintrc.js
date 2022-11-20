const naming = [
    'error',
    { selector: 'accessor', format: ['camelCase'], leadingUnderscore: 'forbid' },

    {
        selector: ['class', 'enum', 'interface', 'typeAlias', 'typeParameter'],
        format: ['PascalCase'],
        leadingUnderscore: 'forbid',
    },

    { selector: 'enumMember', format: ['UPPER_CASE'], leadingUnderscore: 'forbid' },

    { selector: 'function', format: ['camelCase', 'PascalCase'], leadingUnderscore: 'allow' },

    // ignore specific methods
    { selector: 'method', format: null, filter: { regex: '^CIError$', match: true } },
    { selector: 'method', modifiers: ['private'], format: ['camelCase'], leadingUnderscore: 'require' },
    { selector: 'method', modifiers: ['protected'], format: ['camelCase'], leadingUnderscore: 'require' },
    { selector: 'method', format: ['camelCase'], leadingUnderscore: 'forbid' },

    { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },

    {
        selector: 'property',
        modifiers: ['private', 'static'],
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'require',
    },
    {
        selector: 'property',
        modifiers: ['protected', 'static'],
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'require',
    },
    { selector: 'property', modifiers: ['private'], format: ['camelCase'], leadingUnderscore: 'require' },
    { selector: 'property', modifiers: ['protected'], format: ['camelCase'], leadingUnderscore: 'require' },
    {
        selector: 'property',
        modifiers: ['static'],
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'forbid',
    },
    { selector: 'property', format: ['camelCase'], leadingUnderscore: 'forbid' },

    { selector: 'objectLiteralProperty', format: null },

    {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
    },
];

module.exports = {
    root: true,
    env: {
        browser: true,
        es2017: true,
        jest: true,
        node: true,
    },
    extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier', 'prettier/prettier'],
    ignorePatterns: ['*.cjs', '*.js', '*.mjs', 'dist', 'lib', 'lib-commonjs', 'scripts'],
    plugins: ['@typescript-eslint', 'import', 'jest', 'node', 'prettier'],
    parserOptions: {
        project: './tsconfig.json',
    },
    rules: {
        'class-methods-use-this': 'off',
        'consistent-return': 'off',
        'default-case': 'off',
        // Disable this rule and use rule `prettier/prettier` instead.
        'function-paren-newline': 'off',
        'guard-for-in': 'off',
        'implicit-arrow-linebreak': 'off',
        // https://github.com/prettier/eslint-config-prettier/#max-len
        // This rule is disabled by `eslint-config-prettier`, enable it manually for better eslint error information.
        'max-len': ['error', { code: 120, ignoreUrls: true }],
        // Allows bitwise operators, but be CAREFUL for not using them in most case.
        'no-bitwise': 'off',
        'no-console': ['error', {}],
        'no-constant-condition': 'off',
        'no-continue': 'off',
        'no-else-return': 'off',
        'no-lonely-if': 'off',
        'no-param-reassign': 'off',
        'no-plusplus': 'off',
        'no-restricted-syntax': 'off',
        // https://github.com/prettier/eslint-config-prettier/#no-tabs
        // This rule is disabled by `eslint-config-prettier`, enable it manually for better eslint error informantion.
        'no-tabs': 'error',
        // Disabled for underscore prefix.
        'no-underscore-dangle': 'off',
        // https://github.com/prettier/eslint-config-prettier/#no-unexpected-multiline
        // This rule is disabled by `eslint-config-prettier`, enable it manually for better eslint error informantion.
        'no-unexpected-multiline': 'error',
        // Disable this rule and use rule `prettier/prettier` instead.
        'object-curly-newline': 'off',
        // Disable this rule and use rule `prettier/prettier` instead.
        'operator-linebreak': 'off',
        // Only enable object variable declarator.
        // From: https://github.com/airbnb/javascript/blob/eslint-config-airbnb-base-v15.0.0/packages/eslint-config-airbnb-base/rules/es6.js#L123
        'prefer-destructuring': [
            'error',
            {
                VariableDeclarator: { array: false, object: true },
                AssignmentExpression: { array: false, object: false },
            },
            { enforceForRenamedProperties: false },
        ],
        // https://github.com/prettier/eslint-config-prettier/#quotes
        // This rule is disabled by `eslint-config-prettier`, enable it manually for better eslint error informantion.
        quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }],

        '@typescript-eslint/await-thenable': 'error',
        // Disabled for better code comments
        '@typescript-eslint/brace-style': 'off',
        '@typescript-eslint/comma-dangle': 'off',
        // https://typescript-eslint.io/rules/consistent-type-exports
        '@typescript-eslint/consistent-type-exports': 'error',
        // https://typescript-eslint.io/rules/consistent-type-imports
        '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],
        // https://typescript-eslint.io/rules/explicit-member-accessibility
        '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
        // Disable this rule and use rule `prettier/prettier` instead.
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/lines-between-class-members': 'off',
        // https://typescript-eslint.io/rules/naming-convention
        '@typescript-eslint/naming-convention': naming,
        // From:
        // - https://github.com/iamturns/eslint-config-airbnb-typescript/blob/v17.0.0/lib/shared.js#L122
        // - https://github.com/airbnb/javascript/blob/eslint-config-airbnb-base-v15.0.0/packages/eslint-config-airbnb-base/rules/best-practices.js#L94
        '@typescript-eslint/no-empty-function': [
            'error',
            {
                allow: [
                    // base
                    'arrowFunctions',
                    'functions',
                    'methods',
                    // extends
                    'decoratedFunctions',
                    'private-constructors',
                    'protected-constructors',
                ],
            },
        ],
        // https://typescript-eslint.io/rules/no-empty-interface
        '@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-extra-non-null-assertion': 'error',
        '@typescript-eslint/no-for-in-array': 'off',
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
        '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
        '@typescript-eslint/no-unnecessary-type-constraint': 'warn',
        // https://typescript-eslint.io/rules/restrict-template-expressions
        '@typescript-eslint/restrict-template-expressions': [
            'error',
            { allowNumber: true, allowBoolean: true, allowAny: false, allowNullish: true, allowRegExp: true },
        ],
        // From:
        // - https://github.com/iamturns/eslint-config-airbnb-typescript/blob/v17.0.0/lib/shared.js#L213
        // - https://github.com/airbnb/javascript/blob/eslint-config-airbnb-base-v15.0.0/packages/eslint-config-airbnb-base/rules/best-practices.js#L299
        '@typescript-eslint/return-await': ['error', 'in-try-catch'],
        // https://typescript-eslint.io/rules/require-await/
        '@typescript-eslint/require-await': 'error',

        'import/extensions': 'off',
        // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
        // From: https://github.com/airbnb/javascript/blob/eslint-config-airbnb-base-v15.0.0/packages/eslint-config-airbnb-base/rules/imports.js#L149
        'import/order': [
            'error',
            {
                groups: [['builtin', 'external'], 'internal', 'parent', 'sibling'],
                alphabetize: {
                    caseInsensitive: true,
                    order: 'asc',
                },
                'newlines-between': 'always',
            },
        ],
        'import/no-cycle': 'error',
        // Disabled for import-statement of dev dependencies.
        'import/no-extraneous-dependencies': 'off',
        'import/prefer-default-export': 'off',

        'jest/no-alias-methods': 'error',
        'jest/prefer-strict-equal': 'error',

        // Enables prettier rules.
        'prettier/prettier': 'error',
    },
    overrides: [
        {
            files: ['*.d.ts'],
            rules: {
                '@typescript-eslint/naming-convention': 'off',
            },
        },
        {
            files: ['src/**/__tests__/*.{ts,tsx}', 'src/**/*.{spec,test}.{ts,tsx}', 'test/**/*.{ts,tsx}'],
            rules: {
                // https://typescript-eslint.io/rules/dot-notation
                '@typescript-eslint/dot-notation': [
                    'error',
                    {
                        allowPrivateClassPropertyAccess: true,
                        allowProtectedClassPropertyAccess: true,
                        allowIndexSignaturePropertyAccess: true,
                    },
                ],
            },
        },
        {
            files: [
                'perf/**/*.ts',
                'src/**/__tests__/*.{ts,tsx}',
                'src/**/*.{spec,test}.{ts,tsx}',
                'test/**/*.{ts,tsx}',
            ],
            rules: {
                'no-console': 'off',
            },
        },
    ],
};
