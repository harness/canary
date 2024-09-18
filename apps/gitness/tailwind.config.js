/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@harnessio/playground/tailwind.config', '@harnessio/canary/tailwind.config')],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {}
}
