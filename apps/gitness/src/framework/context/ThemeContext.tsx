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

type useThemeType = () => { theme: FullTheme; setTheme: (theme: FullTheme) => void }
export const useTheme: useThemeType = () => {
  return useThemeStore(state => ({ theme: state.theme, setTheme: state.setTheme }))
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const [systemMode, setSystemMode] = useState<ModeType>(mediaQuery.matches ? ModeType.Dark : ModeType.Light)
  useEffect(() => {
    const updateSystemTheme = () => {
      setSystemMode(mediaQuery.matches ? ModeType.Dark : ModeType.Light)
    }

    mediaQuery.addEventListener('change', updateSystemTheme)

    return () => {
      mediaQuery.removeEventListener('change', updateSystemTheme)
    }
  }, [])

  useEffect(() => {
    const root = window.document.documentElement

    const [mode, color, contrast] = theme.split('-') as [ModeType, ColorType, ContrastType]

    // Compute the effective theme based on system preference if set to "system"
    const effectiveTheme: FullTheme = `${mode === ModeType.System ? systemMode : mode}-${color}-${contrast}`

    root.className = '' // Clear existing classes
    root.classList.add(effectiveTheme) // Apply the computed theme class
  }, [theme, setTheme, systemMode])

  return <>{children}</>
}
