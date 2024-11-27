// import LanguageDetector from 'i18next-browser-languagedetector'

import { initReactI18next } from 'react-i18next'

import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// import resourcesToBackend from 'i18next-resources-to-backend'

import { i18nextViewsInstance } from '@harnessio/ui/internationalization'

// import common from './en/common.json'
// import common_fr from './common-fr.json'

// const resources = {
//   en: { common }
//   // fr: { common: common_fr }∏
// }

console.log('i18n from views', i18nextViewsInstance)
console.log('i18n from gitness', i18n)

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  //   .use(
  //     resourcesToBackend((language: string, namespace: string) => {
  //       return import(`./${language}/${namespace}.json`)
  //     })
  //   )
  .init({
    resources: {},
    fallbackLng: 'fr',
    debug: true,
    lng: 'fr',
    interpolation: {
      escapeValue: false
    }
  })

i18n.on('languageChanged', lng => {
  console.log('languageChanged here', lng)
  i18nextViewsInstance.i18nextViewsInstance.changeLanguage('fr')
})
i18n.changeLanguage('fr')
// i18nextViewsInstance.changeLanguage('fr')

export default i18n
