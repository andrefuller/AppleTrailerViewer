module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier'],
  env: {
    browser: true,
    es6: true,
    node: true
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.config.js']
      }
    ]
  },
  globals: {
    // Collections
    moment: true
  }
};
