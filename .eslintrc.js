module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['plugin:react/recommended', 'airbnb', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 13,
        sourceType: 'module',
    },

    plugins: ['react', 'prettier'],
    rules: {
        'prettier/prettier': 'warn',
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    },
}
