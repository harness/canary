import { createContext, PropsWithChildren, useContext } from 'react'

import { defaultTheme, IThemeStore } from '@/context'

const ThemeContext = createContext<Required<IThemeStore> | undefined>({
  theme: defaultTheme,
  setTheme: () => void 0
})

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
