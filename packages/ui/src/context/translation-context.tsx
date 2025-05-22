import { createContext, PropsWithChildren, useContext, useMemo } from 'react'

type Substitutions = Record<string, string | undefined>

export type TFunctionWithFallback = (key: string, fallback?: string, substitutions?: Substitutions) => string

interface TranslationPayload {
  t: TFunctionWithFallback
}

type TranslationProviderProps = PropsWithChildren<{
  t?: TFunctionWithFallback
}>

const defaultTranslator: TFunctionWithFallback = (_key, fallback = '') => fallback

const TranslationContext = createContext<TranslationPayload>({
  t: defaultTranslator
})

const escapeHtml = (unsafe: string): string =>
  unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const applySubstitutions = (template: string, substitutions?: Substitutions): string => {
  if (!substitutions) return template

  return template.replace(/{{(.*?)}}/g, (_, key: string) => escapeHtml(substitutions[key.trim()] ?? ''))
}

export function TranslationProvider({ t: rawTranslator = defaultTranslator, children }: TranslationProviderProps) {
  const payload = useMemo<TranslationPayload>(
    () => ({
      t: (key, fallback = '', substitutions) => {
        const translation = rawTranslator(key, fallback)
        return applySubstitutions(translation, substitutions)
      }
    }),
    [rawTranslator]
  )

  return <TranslationContext.Provider value={payload}>{children}</TranslationContext.Provider>
}

export function useTranslation(): TranslationPayload {
  return useContext(TranslationContext)
}
