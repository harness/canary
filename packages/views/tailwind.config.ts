import type { Config as TailwindConfig } from 'tailwindcss/types/config'

// Import the full UI tailwind config directly from source (not dist) to avoid
// circular dependency during monorepo builds - ui must build before its dist is available
import uiTailwindConfig from '../ui/tailwind.config'

export default {
  presets: [uiTailwindConfig],
  content: ['./src/**/*.{ts,tsx}']
} satisfies TailwindConfig
