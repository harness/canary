/** @type {import('tailwindcss').Config} */
import tailwind from '@harnessio/ui/tailwind.config'
import path from 'path'

export default {
  presets: [
    {
      ...tailwind,
      content: [path.join(__dirname, 'node_modules/@harnessio/ui/src/**/*.{ts,tsx}'), './src/**/*.{ts,tsx}']
    }
  ]
}
