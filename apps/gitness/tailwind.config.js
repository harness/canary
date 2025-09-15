/** @type {import('tailwindcss').Config} */

import { uiTailwindPreset } from '@harnessio/ui/tailwind.config'

export default {
  presets: [uiTailwindPreset(['src/**/*.{ts,tsx}'])]
}
