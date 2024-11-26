import { useEffect, useState } from 'react'

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

export const useTheme: () => {theme: FullTheme, setTheme: (theme: FullTheme) => void} = () => {
  const {theme, setTheme} = useThemeStore(state => ({ theme: state.theme, setTheme: state.setTheme }))
  return {theme, setTheme}
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useThemeStore(state => ({
    theme: state.theme,
    setTheme: state.setTheme
  }))

  const [systemMode, setSystemMode] = useState<ModeType>(ModeType.Dark)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const updateSystemTheme = () => {
      if (theme.startsWith(ModeType.System)) {
        setSystemMode(mediaQuery.matches ? ModeType.Dark : ModeType.Light)
      }
    }    
    mediaQuery.addEventListener('change', updateSystemTheme)
    
    return () => {
      mediaQuery.removeEventListener('change', updateSystemTheme)
    }
  }, [])

  useEffect(() => {
    const root = window.document.documentElement

    // const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const [mode, color, contrast] = theme.split('-') as [ModeType, ColorType, ContrastType]

    // Compute the effective theme based on system preference if set to "system"
    const effectiveTheme: FullTheme = `${mode === ModeType.System ? systemMode : mode}-${color}-${contrast}`

    root.className = '' // Clear existing classes
    root.classList.add(effectiveTheme) // Apply the computed theme class    
  }, [theme, setTheme, systemMode])

  return <>{children}</>
}
