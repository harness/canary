import { initReactI18next } from 'react-i18next'

import { createInstance } from 'i18next'

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
  //   lng: 'fr',
  interpolation: {
    escapeValue: false
  }
})
i18nextViewsInstance.use(initReactI18next)
i18nextViewsInstance.init()
