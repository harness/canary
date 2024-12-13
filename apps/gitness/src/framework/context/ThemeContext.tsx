import { ReactNode, useEffect, useState } from 'react'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { FullTheme, getModeColorContrastFromFullTheme, IThemeStore, ModeType } from '@harnessio/ui/components'

export const useThemeStore = create<IThemeStore>()(
  persist(
    set => ({
      theme: undefined,
      setTheme: (newTheme: FullTheme) => set({ theme: newTheme })
    }),
    {
      name: 'canary-ui-theme' // LocalStorage key
    }
  )
)

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme: FullTheme
}
export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const { theme, setTheme } = useThemeStore()

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
    if (!theme) {
      setTheme(defaultTheme)
    }

    const root = window.document.documentElement

    const { mode, color, contrast } = getModeColorContrastFromFullTheme(theme)

    // Compute the effective theme based on system preference if set to "system"
    const effectiveTheme: FullTheme = `${mode === ModeType.System ? systemMode : mode}-${color}-${contrast}`

    root.className = '' // Clear existing classes
    root.classList.add(effectiveTheme) // Apply the computed theme class
  }, [theme, setTheme, systemMode])

  return <>{children}</>
}
