/* eslint-disable @typescript-eslint/no-var-requires */
const { classNameRules } = require('./eslint/rules.js')

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:i18next/recommended',

    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:tailwindcss/recommended',

    'prettier'
  ],
  plugins: ['@typescript-eslint', 'tailwindcss', 'react', 'react-hooks', 'import', 'prettier', 'i18next'],
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      typescript: true,
      node: true
    }
  },
  rules: {
    'tailwindcss/no-contradicting-classname': 'error',
    'import/no-unresolved': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',

    /**
     * Soon it will be converted to "error"
     * once all the old variants are removed
     */
    'no-restricted-syntax': ['warn', ...classNameRules],

    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-autofocus': 'off',
    'i18next/no-literal-string': [
      'warn',
      {
        mode: 'jsx-only',
        'jsx-attributes': {
          exclude: ['className', 'data-testid', 'id', 'type', 'size', 'name', 'variant', 'style', 'href', 'target']
        }
      }
    ],

    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }
    ],

    '@typescript-eslint/no-explicit-any': 'warn',

    'tailwindcss/no-custom-classname': 'off'
  },
  ignorePatterns: ['**/dist/**']
}
