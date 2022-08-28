const path = require('path');

module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'react-app',
    'airbnb-base'
  ],
  plugins: [
    'react',
    'import'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-param-reassign': 'off',
    'no-unused-vars': 'warn',
    'comma-dangle': ['error', { functions: 'never' }]
  },
  settings: {
    'import/resolver': {
      node: {
        paths: [path.resolve(__dirname, 'src')]
      }
    },
    'import/extensions': [
      '.js',
      '.jsx'
    ]
  }
};
