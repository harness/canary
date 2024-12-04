export const noop = () => void 0

export const mockT = (...args: unknown[]) => {
  return args[1] || args[0]
}

export const useTranslationsStore = () => ({ t: mockT as any, changeLanguage: noop, i18n: {} as any })
