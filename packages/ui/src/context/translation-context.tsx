import { createContext, useContext } from 'react'

import { i18n, TFunction } from 'i18next'

export interface TranslationStore {
  t: TFunction
  i18n: i18n
  changeLanguage: (lng: string) => void
}

export const TranslationContext = createContext<TranslationStore | null>(null)

export const TranslationProvider = ({
  children,
  useTranslationStore
}: {
  children: React.ReactNode
  useTranslationStore: () => TranslationStore
}) => {
  const store = useTranslationStore()
  return <TranslationContext.Provider value={store}>{children}</TranslationContext.Provider>
}

export const useTranslation = () => {
  const context = useContext(TranslationContext)

  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider')
  }

  return context
}
