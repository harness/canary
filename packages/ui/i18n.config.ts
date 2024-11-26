export default {
  // Directory where the parser will look for files
  input: ['src/**/*.{js,jsx,ts,tsx}'],

  // Output directory for extracted translations
  output: './locales/$LOCALE/$NAMESPACE.json',

  // Specify default namespace
  defaultNamespace: 'common',

  // Specify the list of namespaces you want to extract
  namespaces: ['common', 'component', 'dashboard'],

  locales: ['en', 'es', 'fr'],

  keySeparator: '.',

  // Namespace separator (if you're using nested keys)
  namespaceSeparator: ':',

  // If your i18n keys are wrapped in a function like `t('key')`
  functions: ['t', 'i18nextViewsInstance.t'],

  // Automatically create empty translations in all locales
  createOldCatalogs: false,
  keepRemoved: false
}
