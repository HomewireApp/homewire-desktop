module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:svelte/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2021,
    extraFileExtensions: ['.svelte'],
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prettier/prettier': ['error'],
    'import/prefer-default-export': 'off',
  },
};
