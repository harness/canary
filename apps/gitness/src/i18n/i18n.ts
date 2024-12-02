import { initReactI18next } from 'react-i18next'

import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import { resources } from '@harnessio/ui/locales'

const languageDetectorOptions = {
  order: ['localStorage', 'navigator', 'cookie'],
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',
  caches: ['cookie', 'localStorage']
}

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    detection: languageDetectorOptions,
    resources,
    fallbackLng: 'en',
    react: {
      bindI18n: 'languageChanged',
      bindI18nStore: 'added'
    },
    interpolation: {
      escapeValue: false
    }
  })

window.addEventListener('languagechange', () => {
  const navigatorLang = (navigator.language || 'en').split('-')[0]
  i18n.changeLanguage(navigatorLang)
})

export default i18n
