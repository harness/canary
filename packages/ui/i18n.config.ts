export default {
  // Directory where the parser will look for files
  input: ['src/**/*.{js,jsx,ts,tsx}'],

  // Output directory for extracted translations
  output: './locales/$LOCALE/$NAMESPACE.json',

  // Specify default namespace
  defaultNamespace: 'component',

  // Specify the list of namespaces
  namespaces: ['component'],

  locales: ['en', 'fr'],

  keySeparator: '.',

  // Namespace separator
  namespaceSeparator: ':',
  keepRemoved: true,

  // i18n keys are wrapped in a function like `t('key')`
  functions: ['t']
}
