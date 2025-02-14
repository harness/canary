import { createContext, PropsWithChildren, useContext } from 'react'

import { ColorType, ContrastType, FullTheme, IThemeStore, ModeType } from '@/components'

const ThemeContext = createContext<Required<IThemeStore> | undefined>(undefined)

export const defaultTheme = `${ModeType.Dark}-${ColorType.Standard}-${ContrastType.Standard}` as FullTheme

export const ThemeProvider = ({ children, ...rest }: PropsWithChildren<IThemeStore>) => {
  return (
    <ThemeContext.Provider
      value={{
        ...rest,
        theme: rest?.theme ?? defaultTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return context
}
