import { uiTailwindPreset } from '@harnessio/ui/tailwind.config'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [uiTailwindPreset(['src/**/*.{ts,tsx}'])]
}
