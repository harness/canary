import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'canary-ui-theme',
  ...props
}: ThemeProviderProps) {
  const getMediaQuery = () => window.matchMedia('(prefers-color-scheme: dark)')

  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme)
  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>(() => (getMediaQuery().matches ? 'dark' : 'light'))

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    const applyTheme = theme === 'system' ? systemTheme : theme
    root.classList.add(applyTheme)
  }, [theme, systemTheme])

  useEffect(() => {
    const updateSystemTheme = () => setSystemTheme(getMediaQuery().matches ? 'dark' : 'light')

    // Update system theme on initial load if theme is 'system'
    if (theme === 'system') {
      updateSystemTheme()
    }

    getMediaQuery().addEventListener('change', updateSystemTheme)

    return () => getMediaQuery().removeEventListener('change', updateSystemTheme)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme)
    setThemeState(newTheme)

    // If new theme is 'system', immediately apply the current system theme
    if (newTheme === 'system') {
      setSystemTheme(getMediaQuery().matches ? 'dark' : 'light')
    }
  }

  const value = {
    theme,
    setTheme
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
