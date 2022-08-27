module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'react-app',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-param-reassign': 'off',
    'no-unused-vars': 'warn',
    'comma-dangle': ['error', { functions: 'never' }]
  },
};
