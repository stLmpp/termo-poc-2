module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['svelte3', '@typescript-eslint'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  rules: {
    'object-shorthand': ['error'],
    'object-curly-spacing': ['error', 'always'],
    'arrow-parens': ['error', 'as-needed'],
    'brace-style': ['off', 'off'],
    'id-blacklist': 'off',
    'id-match': 'off',
    'import/order': 'off',
    'linebreak-style': 'off',
    'new-parens': 'off',
    'newline-per-chained-call': 'off',
    'no-extra-semi': 'off',
    'no-irregular-whitespace': 'off',
    'no-trailing-spaces': ['error', { ignoreComments: true, skipBlankLines: true }],
    'no-underscore-dangle': 'off',
    'space-in-parens': ['off', 'never'],
    quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
    'no-console': ['error'],
    curly: ['error', 'multi-line'],
    'no-useless-constructor': ['off'],
    'comma-dangle': [
      'error',
      {
        objects: 'always-multiline',
        arrays: 'always-multiline',
        functions: 'never',
        imports: 'always-multiline',
        exports: 'always-multiline',
      },
    ],
    'arrow-body-style': ['error', 'as-needed'],
    'prefer-arrow-callback': ['error'],
    'no-shadow': ['off'],
    'prefer-const': ['error', { destructuring: 'all' }],
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    '@typescript-eslint/explicit-member-accessibility': ['off', { accessibility: 'explicit' }],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/unified-signatures': 'off',
    '@typescript-eslint/no-useless-constructor': ['off'],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/prefer-optional-chain': ['warn'],
    '@typescript-eslint/explicit-module-boundary-types': ['off'],
    '@typescript-eslint/no-shadow': ['error', { allow: ['_'] }],
    '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as' }],
    '@typescript-eslint/no-inferrable-types': ['error'],
    '@typescript-eslint/typedef': [
      'error',
      {
        arrowParameter: false,
        memberVariableDeclaration: false,
        parameter: false,
        propertyDeclaration: true,
      },
    ],
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
      },
    ],
  },
  settings: {
    'svelte3/typescript': true,
  },
};
