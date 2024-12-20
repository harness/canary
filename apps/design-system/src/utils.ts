export const noop = () => void 0

export const mockT = (key: string, options?: { [key: string]: any }) => {
  if (typeof options === 'string') {
    return options
  }

  if (typeof options === 'object' && options?.defaultValue) {
    return options.defaultValue.replace(/{{\s*(\w+)\s*}}/g, (_: string, variable: string) => options[variable] || '')
  }

  return key
}

export const useTranslationsStore = () => ({ t: mockT as any, changeLanguage: noop, i18n: {} as any })
export const useThemeStore = () => ({ theme: 'dark-std-std' as any, setTheme: noop })
