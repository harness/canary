import { clsx, type ClassValue } from 'clsx'
import { createTailwindMerge, getDefaultConfig, mergeConfigs } from 'tailwind-merge'

import tailwindConfig from '../../tailwind-design-system'

const customTwMerge = createTailwindMerge(getDefaultConfig, config =>
  mergeConfigs<'font-size' | 'box-shadow'>(config, {
    extend: {
      classGroups: {
        'font-size': Object.keys(tailwindConfig?.theme?.extend?.fontSize || {}).map(key => `text-${key}`),
        'box-shadow': Object.keys(tailwindConfig?.theme?.extend?.boxShadow || {}).map(key => `shadow-${key}`)
      }
    }
  })
)

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}
