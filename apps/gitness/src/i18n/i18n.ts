import { initReactI18next } from 'react-i18next'

import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import { resources as uiResources } from '@harnessio/ui/locales'
import { resources as viewsResources } from '@harnessio/views/locales'

const languageDetectorOptions = {
  order: ['localStorage', 'navigator', 'cookie'],
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',
  caches: ['cookie', 'localStorage']
}

const combinedResources = {
  en: {
    ...uiResources.en,
    ...viewsResources.en
  },
  fr: {
    ...uiResources.fr,
    ...viewsResources.fr
  }
}

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    detection: languageDetectorOptions,
    resources: combinedResources,
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
