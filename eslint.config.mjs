// import { FlatCompat } from '@eslint/eslintrc'
 
// const compat = new FlatCompat({
//   // import.meta.dirname is available after Node.js v20.11.0
//   baseDirectory: import.meta.dirname,
// })
 
// const eslintConfig = [
//   ...compat.config({
//     extends: ['next'],
//     plugins: ['import'],
//   }),
//   {
//     rules: {
//       'react/no-unescaped-entities': 'off',
//       '@next/next/no-img-element': 'off',
//       '@typescript-eslint/no-unused-vars': 'off',
//       '@typescript-eslint/no-explicit-any': 'off',
//       'react-hooks/exhaustive-deps': 'off',
//       'import/no-unresolved': 'off',
//       'import/named': 'off',
//       'import/default': 'off',
//       'import/namespace': 'off',
//       'import/no-absolute-path': 'off',
//       'import/no-dynamic-require': 'off',
//       'import/no-self-import': 'off',
//       'import/no-cycle': 'off',
//       'import/no-useless-path-segments': 'off',
//     },
//   },
// ]
 
// export default eslintConfig

import { FlatCompat } from '@eslint/eslintrc'
import tsParser from '@typescript-eslint/parser'               // <- import parser object
import tsPlugin from '@typescript-eslint/eslint-plugin'      // optional import (plugin registration via compat below)

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: ['next'],
    // keep plugin names for compat; definitions are available once modules are installed
    plugins: ['import', '@typescript-eslint'],
  }),

  {
    // Use the parser object, not a string
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: ['./tsconfig.json'], // optional; required for rules that need type info
        tsconfigRootDir: import.meta.dirname,
      },
    },
    files: ['**/*.ts', '**/*.tsx'],

    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'import/no-unresolved': 'off',
      'import/named': 'off',
      'import/default': 'off',
      'import/namespace': 'off',
      'import/no-absolute-path': 'off',
      'import/no-dynamic-require': 'off',
      'import/no-self-import': 'off',
      'import/no-cycle': 'off',
      'import/no-useless-path-segments': 'off',
    },
  },

  {
    files: ['**/*.js', '**/*.mjs'],
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'import/no-unresolved': 'off',
      'import/named': 'off',
      'import/default': 'off',
      'import/namespace': 'off',
      'import/no-absolute-path': 'off',
      'import/no-dynamic-require': 'off',
      'import/no-self-import': 'off',
      'import/no-cycle': 'off',
      'import/no-useless-path-segments': 'off',
    },
  },
]

export default eslintConfig
