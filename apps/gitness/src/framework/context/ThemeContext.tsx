import { useEffect } from 'react'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { ColorType, ContrastType, FullTheme, ModeType, ThemeState } from '@harnessio/ui/components'

const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      theme: 'system-std-std' as FullTheme, // Default theme
      setTheme: (newTheme: FullTheme) => set({ theme: newTheme })
    }),
    {
      name: 'canary-ui-theme' // LocalStorage key
    }
  )
)

export const useTheme = () => {
  const { theme, setTheme } = useThemeStore(state => ({ theme: state.theme, setTheme: state.setTheme }))
  return { theme, setTheme }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useThemeStore(state => ({
    theme: state.theme,
    setTheme: state.setTheme
  }))

  useEffect(() => {
    const root = window.document.documentElement

    const getMediaQuery = () => window.matchMedia('(prefers-color-scheme: dark)')
    const [mode, color, contrast] = theme.split('-') as [ModeType, ColorType, ContrastType]

    // Compute the effective theme based on system preference if set to "system"
    const effectiveMode = mode === ModeType.System ? (getMediaQuery().matches ? ModeType.Dark : ModeType.Light) : mode
    const effectiveTheme: FullTheme = `${effectiveMode}-${color}-${contrast}`

    root.className = '' // Clear existing classes
    root.classList.add(effectiveTheme) // Apply the computed theme class

    const updateSystemTheme = () => {
      if (theme.startsWith(ModeType.System)) {
        setTheme(`${getMediaQuery().matches ? ModeType.Dark : ModeType.Light}-${color}-${contrast}` as FullTheme)
      }
    }

    getMediaQuery().addEventListener('change', updateSystemTheme)

    return () => {
      getMediaQuery().removeEventListener('change', updateSystemTheme)
    }
  }, [theme, setTheme])

  return <>{children}</>
}
