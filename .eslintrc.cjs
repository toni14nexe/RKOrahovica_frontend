module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier'],
  rules: {
    'vue/multi-word-component-names': 0,
    'prettier/prettier': 'error',
    'vue/no-unused-vars': 'error',
    'vue/padding-line-between-blocks': 'error',
  },
};
