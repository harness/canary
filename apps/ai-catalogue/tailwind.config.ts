import type { Config as TailwindConfig } from 'tailwindcss/types/config'

import componentsPreset from '../../packages/ui/tailwind-components-preset'
import designSystemPreset from '../../packages/ui/tailwind-design-system'

export default {
  presets: [componentsPreset, designSystemPreset],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ai-chat-components/src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}'
  ]
} satisfies TailwindConfig
