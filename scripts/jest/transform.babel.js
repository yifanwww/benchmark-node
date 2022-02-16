const babelJest = require('babel-jest').default;

module.exports = babelJest.createTransformer({
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        [
            '@babel/preset-typescript',
            {
                // Can omit this setting when babel is upgrade above v8
                // https://github.com/babel/babel/issues/10746
                allowDeclareFields: true,
            },
        ],
    ],
    babelrc: false,
    configFile: false,
});
