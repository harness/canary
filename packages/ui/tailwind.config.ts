import type { Config as TailwindConfig } from 'tailwindcss/types/config'

import componentsPreset from './tailwind-components-preset'
import designSystemPreset from './tailwind-design-system'

export default {
  presets: [componentsPreset, designSystemPreset],
  content: ['./src/**/*.{ts,tsx}']
} satisfies TailwindConfig
