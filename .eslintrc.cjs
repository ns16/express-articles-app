module.exports = {
  extends: [
    'airbnb-base',
    'plugin:import/recommended',
    'plugin:mocha/recommended'
  ],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module'
  },
  rules: {
    'arrow-body-style': [
      'error',
      'as-needed'
    ],
    'arrow-parens': [
      'error',
      'as-needed'
    ],
    'comma-dangle': [
      'error',
      'never'
    ],
    'consistent-return': 'off',
    'import/extensions': 'off',
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        },
        groups: [
          'builtin',
          'external',
          'parent',
          'sibling',
          'index'
        ],
        'newlines-between': 'always'
      }
    ],
    'import/prefer-default-export': 'off',
    'max-len': [
      'error',
      {
        code: 150,
        comments: 150,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        tabWidth: 2
      }
    ],
    'mocha/no-mocha-arrows': 'off',
    'mocha/no-top-level-hooks': 'off',
    'new-cap': [
      'error',
      {
        properties: false
      }
    ],
    'no-await-in-loop': 'off',
    'no-continue': 'off',
    'no-else-return': [
      'error',
      {
        allowElseIf: true
      }
    ],
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-restricted-syntax': [
      'off',
      'ForOfStatement'
    ],
    'no-return-await': 'off',
    'no-shadow': 'off',
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_$',
        varsIgnorePattern: '^_$'
      }
    ],
    'object-curly-newline': 'off',
    'operator-linebreak': [
      'error',
      'after',
      {
        overrides: {
          '?': 'before',
          ':': 'before'
        }
      }
    ],
    semi: [
      'error',
      'never'
    ]
  }
}
