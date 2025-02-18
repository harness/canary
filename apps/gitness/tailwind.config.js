/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    // require('@harnessio/canary/tailwind.config'),
    // require('@harnessio/views/tailwind.config')
    require('@harnessio/ui/tailwind.config')
  ],
  content: [
    'node_modules/@harnessio/views/src/**/*.{ts,tsx}',
    'node_modules/@harnessio/ui/src/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ]
}
