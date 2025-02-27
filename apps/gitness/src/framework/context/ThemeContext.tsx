import { ReactNode, useEffect, useState } from 'react'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { getModeColorContrastFromFullTheme } from '@harnessio/ui/components'
import { FullTheme, IThemeStore, ModeType, ThemeProvider as UIThemeProvider } from '@harnessio/ui/context'

import { useIsMFE } from '../hooks/useIsMFE'

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
  const isMFE = useIsMFE()

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

    if (!isMFE) {
      root.classList.add(effectiveTheme) // Apply the computed theme class
    } else {
      root.classList.add(mode)
    }

    // Set color-scheme meta tag
    const colorSchemeMeta =
      (document.querySelector('meta[name="color-scheme"]') as HTMLMetaElement) || document.createElement('meta')
    colorSchemeMeta.name = 'color-scheme'
    colorSchemeMeta.content = mode === ModeType.System ? systemMode.toLowerCase() : mode.toLowerCase()
    if (!colorSchemeMeta.parentNode) {
      document.head.appendChild(colorSchemeMeta)
    }
  }, [theme, setTheme, systemMode])

  return (
    <UIThemeProvider theme={theme} setTheme={setTheme}>
      {children}
    </UIThemeProvider>
  )
}
