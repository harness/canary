import { initReactI18next } from 'react-i18next'

import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const languageDetectorOptions = {
  // Order and from where user language should be detected
  order: ['localStorage', 'navigator', 'cookie'],

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
    // debug: true,
    react: {
      bindI18n: 'languageChanged',
      bindI18nStore: 'added'
    },
    interpolation: {
      escapeValue: false
    }
  })

export const handleLanguageChange = (lng: string) => {
  // set system language
  if (lng === 'system') {
    const navigatorLang = (navigator.language || 'en').split('-')[0]
    i18n.changeLanguage(navigatorLang)
    localStorage.setItem('i18nextLngSystem', 'true')
    localStorage.setItem('i18nextLng', navigatorLang)
  } else {
    // Set specific language
    i18n.changeLanguage(lng)
    localStorage.setItem('i18nextLng', lng)
    localStorage.removeItem('i18nextLngSystem')
  }
}

// Detect language change on the navigator
window.addEventListener('languagechange', () => {
  const navigatorLang = navigator.language.split('-')[0]

  i18n.changeLanguage(navigatorLang)
})

export default i18n
