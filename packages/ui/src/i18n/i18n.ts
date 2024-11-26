import { initReactI18next } from 'react-i18next'

import { createInstance } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import component_en from '../../locales/en/component.json'
import component_fr from '../../locales/fr/component.json'

const resources = {
  en: { component: component_en },
  fr: { component: component_fr }
}
export const i18nextViewsInstance = createInstance({
  resources,
  fallbackLng: 'en',
  ns: ['component'],

  react: {
    bindI18n: 'languageChanged',
    bindI18nStore: 'added'
  },
  interpolation: {
    escapeValue: false
  }
})
i18nextViewsInstance.use(initReactI18next).use(LanguageDetector)

i18nextViewsInstance.init()
