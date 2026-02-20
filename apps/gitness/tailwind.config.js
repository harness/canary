const path = require('path')

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@harnessio/ui/tailwind.config')],
  content: [
    'node_modules/@harnessio/ui/src/**/*.{ts,tsx}',
    path.join(__dirname, '../../packages/views/src/**/*.{ts,tsx}'),
    './src/**/*.{ts,tsx}'
  ]
}
