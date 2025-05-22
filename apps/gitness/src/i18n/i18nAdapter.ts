import { TFunction } from 'i18next'

import { TFunctionWithFallback } from '@harnessio/ui/context'

export function createI18NextAdapter(i18nT: TFunction): TFunctionWithFallback {
  return (key: string, fallback: string = '', substitutions?: Record<string, string | undefined>): string => {
    return i18nT(key, {
      ...substitutions,
      defaultValue: fallback
    })
  }
}
