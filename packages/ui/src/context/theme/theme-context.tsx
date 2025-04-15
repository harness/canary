import { createContext, PropsWithChildren, useContext, useMemo } from 'react'

import { defaultTheme, IThemeStore, ModeType } from '@/context'

const ThemeContext = createContext<Required<IThemeStore> | undefined>({
  theme: defaultTheme,
  setTheme: () => void 0,
  isLightTheme: false
})

export const ThemeProvider = ({ children, theme: themeProp, ...rest }: PropsWithChildren<IThemeStore>) => {
  const theme = themeProp ?? defaultTheme
  const isLightTheme = useMemo(() => theme.includes(ModeType.Light), [theme])

  return <ThemeContext.Provider value={{ ...rest, theme, isLightTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return context
}
