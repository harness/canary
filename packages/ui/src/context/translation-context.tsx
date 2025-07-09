import { createContext, PropsWithChildren, useContext, useMemo } from 'react'

type Options = Record<string, any>

export type TFunction = (key: string, options?: Options) => string
export type TFunctionWithFallback = (key: string, fallback?: string, options?: Options) => string

interface TranslationPayload {
  t: TFunctionWithFallback
}

type TranslationProps = PropsWithChildren<{
  t?: TFunction
}>

function defaultTranslator(_: string, options?: Options): string {
  return options?.defaultValue ?? ''
}

const TranslationContext = createContext<TranslationPayload>({
  t: (key, fallback = '', options) => defaultTranslator(key, { ...options, defaultValue: fallback })
})

export const getT = (translator: TFunction) => {
  return {
    t: (key: string, fallback: string = '', options?: Options) =>
      translator(key, { ...options, defaultValue: fallback }) || fallback
  }
}

export function TranslationProvider({ t: translator = defaultTranslator, children }: TranslationProps) {
  const payload = useMemo(() => getT(translator), [translator])

  return <TranslationContext.Provider value={payload}>{children}</TranslationContext.Provider>
}
export function useTranslation(): TranslationPayload {
  return useContext(TranslationContext)
}
