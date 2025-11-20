import plugin from 'tailwindcss/plugin'
import type { Config as TailwindConfig } from 'tailwindcss/types/config'

import { ComponentStyles } from './tailwind-utils-config/components'

export default {
  content: [],
  plugins: [
    plugin(({ addComponents }) => {
      addComponents(ComponentStyles)
    })
  ]
} satisfies TailwindConfig
