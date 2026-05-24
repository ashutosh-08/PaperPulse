const eslintPluginJsdoc = require('eslint-plugin-jsdoc');

module.exports = [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        process: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
      }
    },
    plugins: {
      jsdoc: eslintPluginJsdoc
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true
          }
        }
      ]
    }
  }
];
