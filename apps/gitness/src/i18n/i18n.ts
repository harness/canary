import { initReactI18next } from 'react-i18next'

import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import { i18nextViewsInstance } from '@harnessio/ui/internationalization'

const languageDetectorOptions = {
  // Order and from where user language should be detected
  order: ['navigator', 'cookie', 'localStorage'],

  // Keys to search language in
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',

  // Cache user language on
  caches: ['cookie', 'localStorage']
}

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    detection: languageDetectorOptions,
    resources: {},
    fallbackLng: 'en',
    debug: true,
    react: {
      bindI18n: 'languageChanged',
      bindI18nStore: 'added'
    },
    interpolation: {
      escapeValue: false
    }
  })

export const handleLanguageChange = (lng: string) => {
  console.log('handleLanguageChange here', lng)
  i18n.changeLanguage(lng)
  i18nextViewsInstance.i18nextViewsInstance.changeLanguage(lng)
}

// i18n.on('languageChanged', lng => {
//   console.log('languageChanged here', lng)
//   i18nextViewsInstance.i18nextViewsInstance.changeLanguage('en')
// })
// i18n.changeLanguage('en')

export default i18n
