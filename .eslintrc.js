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
        'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
        'spaced-comment': 'off',
        'react/prop-types': 'off',
        'no-use-before-define': 'off',
        'import/no-relative-packages': 'off',
        'no-else-return': 'off',
        'no-underscore-dangle': 'off',
        'jsx-a11y/label-has-associated-control': [
            2,
            {
                labelComponents: [],
                labelAttributes: ['label'],
                controlComponents: ['TextareaAutosize'],
                depth: 3,
            },
        ],
        'react/jsx-props-no-spreading': 'off',
        'no-unused-vars': ['error', { varsIgnorePattern: 'electionObj', args: 'none' }],
        'no-nested-ternary': 'off',
    },
    globals: {
        logger: 'readonly',
    },
}
