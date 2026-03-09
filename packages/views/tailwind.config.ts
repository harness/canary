import type { Config as TailwindConfig } from 'tailwindcss/types/config'

// Import the full UI tailwind config which includes both design system and component presets
import uiTailwindConfig from '@harnessio/ui/tailwind.config'

export default {
  presets: [uiTailwindConfig],
  content: ['./src/**/*.{ts,tsx}']
} satisfies TailwindConfig
