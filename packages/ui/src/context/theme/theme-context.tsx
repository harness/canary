import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useEffect, useMemo, useRef } from 'react'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { getModeColorContrastFromFullTheme } from '@/components/theme-selector-v2/utils'
import { useThemeCSSLoader, type ThemeManifest } from '@/hooks/use-theme-css-loader'

import { defaultTheme, FullTheme, IThemeStore, ModeType, ThemeZustandState } from './types'

// ─── Zustand store ───────────────────────────────────────────────────────────
export const useThemeStore = create<ThemeZustandState>()(
  persist(
    set => ({
      theme: defaultTheme,
      isLightTheme: false,
      isSystemTheme: false,
      isInset: false,
      isThemeLoading: false,
      setTheme: ({ newTheme, isSystemTheme }: { newTheme: FullTheme, isSystemTheme: boolean }) => set({ theme: newTheme, isSystemTheme, isLightTheme: newTheme.includes('light') }),
      setInset: (isInset: boolean) => set({ isInset }),
      setIsThemeLoading: (loading: boolean) => set({ isThemeLoading: loading })
    }),
    {
      name: 'canary-ui-theme',
      version: 3,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as ThemeZustandState
        // @ts-expect-error - TODO: Expected for older versions
        if (version < 2 && state.theme === 'system-std-std') {
          return { ...state, theme: 'light-std-std' as FullTheme, isLightTheme: true }
        }
        return state
      },
      partialize: (state: ThemeZustandState) => ({
        theme: state.theme,
        isInset: state.isInset,
        isSystemTheme: state.isSystemTheme,
      })
    }
  )
)

// ─── Lightweight context provider (for MFE usage) ────────────────────────────

const ThemeContext = createContext<Required<IThemeStore> | undefined>({
  theme: defaultTheme,
  setTheme: () => void 0,
  isLightTheme: false,
  isInset: false,
  setInset: () => void 0,
  isThemeLoading: false,
  setIsThemeLoading: () => void 0
})

export const ThemeContextProvider = ({ children, theme: themeProp, ...rest }: PropsWithChildren<IThemeStore>) => {
  const theme = themeProp ?? defaultTheme
  const isLightTheme = useMemo(() => theme.includes(ModeType.Light), [theme])

  return (
    <ThemeContext.Provider
      value={{
        isInset: false,
        setInset: () => void 0,
        isThemeLoading: false,
        setIsThemeLoading: () => void 0,
        ...rest,
        theme,
        isLightTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

// ─── Unified smart provider ───────────────────────────────────────────────────

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme: FullTheme
  /** Pass true when rendering inside an MFE host (skips inset-layout class). */
  isMFE?: boolean
  /** Base URL from which on-demand theme CSS files are served. Required for CSS loading. */
  themesBaseUrl?: string
  /** Build-generated manifest mapping theme names to hashed filenames. Required for CSS loading. */
  themeManifest?: ThemeManifest
}

export function ThemeProvider({
  children,
  defaultTheme: defaultThemeProp,
  isMFE = false,
  themesBaseUrl,
  themeManifest
}: ThemeProviderProps) {
  const { theme, setTheme, setInset, isLightTheme, isInset, isThemeLoading, setIsThemeLoading, isSystemTheme } = useThemeStore()
  const { loadTheme } = useThemeCSSLoader(themesBaseUrl, themeManifest)

  // Adapter: IThemeStore.setTheme is (theme: FullTheme) => void; Zustand setTheme takes { newTheme, isSystemTheme }.
  // Context consumers always make direct (non-system) selections, so isSystemTheme defaults to false.
  const contextSetTheme = useCallback(
    (newTheme: FullTheme) => setTheme({ newTheme, isSystemTheme: false }),
    [setTheme]
  )

  // const [systemMode, setSystemMode] = useState<ModeType>(
  //   mediaQueryRef.current.matches ? ModeType.Dark : ModeType.Light
  // )
  const mediaQueryRef = useRef(window.matchMedia('(prefers-color-scheme: dark)'))

  useEffect(() => {
    const mediaQuery = mediaQueryRef.current
    const updateSystemTheme = () => {
      if (!isSystemTheme) return

      const { color, contrast } = getModeColorContrastFromFullTheme(theme)
      const prefersDark = mediaQuery.matches
      const resolvedMode = prefersDark ? ModeType.Dark : ModeType.Light
      setTheme({ newTheme: `${resolvedMode}-${color}-${contrast}`, isSystemTheme: true })
    }

    mediaQuery.addEventListener('change', updateSystemTheme)

    return () => {
      mediaQuery.removeEventListener('change', updateSystemTheme)
    }
  }, [isSystemTheme, setTheme, theme])

  const applyTheme = useCallback(
    async (effectiveTheme: FullTheme, mode: ModeType, staleRef: { current: boolean }) => {
      if (themesBaseUrl && themeManifest) {
        try {
          setIsThemeLoading(true)
          await loadTheme(effectiveTheme)
        } finally {
          if (!staleRef.current) {
            setIsThemeLoading(false)
          }
        }
      }

      if (staleRef.current) return

      const root = window.document.documentElement

      root.className = ''
      root.classList.add(effectiveTheme)

      if (!isMFE && isInset) {
        root.classList.add('inset-layout')
      }

      const colorSchemeMeta =
        (document.querySelector('meta[name="color-scheme"]') as HTMLMetaElement) || document.createElement('meta')
      colorSchemeMeta.name = 'color-scheme'
      colorSchemeMeta.content = mode.toLowerCase()
      if (!colorSchemeMeta.parentNode) {
        document.head.appendChild(colorSchemeMeta)
      }
    },
    [themesBaseUrl, themeManifest, loadTheme, isMFE, isInset, setIsThemeLoading]
  )

  useEffect(() => {
    if (!theme) {
      setTheme({ newTheme: defaultThemeProp, isSystemTheme: false })
    }

    const { mode, color, contrast } = getModeColorContrastFromFullTheme(theme)
    const effectiveTheme: FullTheme = `${mode}-${color}-${contrast}`

    const staleRef = { current: false }
    applyTheme(effectiveTheme, mode, staleRef)

    return () => {
      staleRef.current = true
    }
  }, [theme, setTheme, defaultThemeProp, applyTheme])

  return (
    <ThemeContextProvider {...{ theme, setTheme: contextSetTheme, setInset, isLightTheme, isInset, isThemeLoading, setIsThemeLoading }}>
      {children}
    </ThemeContextProvider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return context
}
