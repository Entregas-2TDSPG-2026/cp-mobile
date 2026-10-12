const expoConfig = require('eslint-config-expo/flat');
const { globalIgnores } = require('eslint/config');

module.exports = [
  globalIgnores(['dist/**', '.expo/**']),
  ...expoConfig,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
    },
  },
];
