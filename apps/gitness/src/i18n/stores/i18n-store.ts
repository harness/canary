import { create } from 'zustand'

import { TranslationStore } from '@harnessio/ui/views'

import i18n from '../i18n'

export const useTranslationStore = create<TranslationStore>(_set => ({
  i18n,
  t: i18n.t.bind(i18n),

  changeLanguage: (lng: string) => {
    if (lng === 'system') {
      const navigatorLang = (navigator.language || 'en').split('-')[0]
      i18n.changeLanguage(navigatorLang)
      localStorage.setItem('i18nextLngSystem', 'true')
      localStorage.setItem('i18nextLng', navigatorLang)
    } else {
      i18n.changeLanguage(lng)
      localStorage.setItem('i18nextLng', lng)
      localStorage.removeItem('i18nextLngSystem')
    }
  }
}))
