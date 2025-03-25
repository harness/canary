import { i18n, TFunction } from 'i18next'

export interface TranslationStore {
  t: TFunction
  i18n: i18n
  changeLanguage: (lng: string) => void
}
