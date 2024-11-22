import { clsx, type ClassValue } from 'clsx'
import { createTailwindMerge, getDefaultConfig, mergeConfigs } from 'tailwind-merge'

import tailwindConfig from '../../configs/tailwind'

const customTwMerge = createTailwindMerge(getDefaultConfig, config =>
  mergeConfigs<'font-size'>(config, {
    extend: {
      classGroups: {
        'font-size': Object.keys(tailwindConfig.theme.extend.fontSize).map(key => `text-${key}`)
      }
    }
  })
)

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}
