/** @type {import('@typescript-eslint/utils').TSESLint.Linter.Config} */
const config = {
  extends: ['@upleveled/upleveled'],
  rules: {
    'react/no-unknown-property': 'off',
  },
};

module.exports = config;
