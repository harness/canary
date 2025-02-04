import { FullTheme } from '@harnessio/ui/context'

export enum Themes {
  DARK_STANDARD_LOW = 'dark-std-low',
  DARK = 'dark-std-std',
  DARK_PROT_STD = 'dark-prot-std',
  DARK_STANDARD_HIGH = 'dark-std-high',
  LIGHT = 'light-std-std',
  LIGHT_PROT_STD = 'light-prot-std'
}

export const getTheme = () => {
  const storedTheme = sessionStorage.getItem('view-preview-theme') as Themes

  if (storedTheme && Object.values(Themes).includes(storedTheme)) {
    return storedTheme
  }

  return Themes.DARK
}

export const useThemeStore = () => ({
  theme: getTheme() as FullTheme,
  setTheme: (_: FullTheme) => {}
})
