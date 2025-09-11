/** @type {import('tailwindcss').Config} */

import path from 'path'

import tailwind from '@harnessio/ui/tailwind.config'

export default {
  presets: [
    {
      ...tailwind,
      content: [
        path.join(__dirname, 'node_modules/@harnessio/ui/{src,tailwind-utils-config}/**/*.{ts,tsx}'),
        './src/**/*.{ts,tsx}'
      ]
    }
  ]
}
