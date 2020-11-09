module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'standard',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',

    /*
     * These prettier configs turn off any conflicting eslint configs
     * This way prettier controls all formatting, eslint controls
     * non-formatting linting
     *
     * Note: All prettier extends configs need to come at the end of the
     * list, so they can override previous rules.
     */
    'prettier',
    'prettier/babel',
    'prettier/react',
    'prettier/standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2020,
    sourceType: 'module',
    babelOptions: {
      // look for babel.config.js in current dir, move up a level if not found
      rootMode: 'upward'
    }
  },
  plugins: [
    '@babel',
    'jest',
    'react',

    // This adds prettier formatting rules to eslint
    'prettier'
  ],
  rules: {
    'prettier/prettier': ['error'],
    'jest/no-disabled-tests': 'error',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',

    // only allow the first letter to be uppercase in 'describe' block descriptions,
    // 'test' and 'it' block descriptions must start with lowercase
    'jest/lowercase-name': [
      'error',
      {
        ignore: ['describe']
      }
    ],

    // Ensure you're actually asserting something when calling expect
    'jest/valid-expect': 'error',

    // Ensure we don't cause infinite state update loops with useEffect hooks.
    'react-hooks/exhaustive-deps': 'error',

    // Don't always require expects, some of our frontend integration tests
    // should pass as long as they don't timeout
    'jest/expect-expect': 'off',

    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react/state-in-constructor': 0,
    'react/self-closing-comp': 'error',

    // eventually I'd like to turn the camelcase rule on for properties,
    // but for now there is enough snake case in our app that this will be a pain.
    camelcase: 'off'
  },
  settings: {
    react: {
      // Must be updated when package.json react version is bumped
      version: '16.9.0'
    }
  }
}
