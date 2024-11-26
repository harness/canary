import { initReactI18next } from 'react-i18next'

import { createInstance } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en_navbar from '../components/i18n/locales/en.json'
import fr_navbar from '../components/i18n/locales/fr.json'

// import fr from './fr.json'

// const resources = {
//   en: { translation: en },
//   fr: { translation: fr }
// }
const resources = {
  en: { translation: en_navbar },
  fr: { translation: fr_navbar }
}
export const i18nextViewsInstance = createInstance({
  resources,
  fallbackLng: 'en',
  react: {
    bindI18n: 'languageChanged',
    bindI18nStore: 'added'
    // useSuspense: true
  },
  // lng: i18nextViewsInstance.options.lng,
  interpolation: {
    escapeValue: false
  }
})
i18nextViewsInstance.use(initReactI18next).use(LanguageDetector)
i18nextViewsInstance.init()
