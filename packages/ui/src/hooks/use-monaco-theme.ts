import { useEffect, useState } from 'react'

import { getMonacoThemes } from '@utils/monaco-theme-utils'

import { YamlEditorProps } from '@harnessio/yaml-editor'

type ThemeConfig = YamlEditorProps<unknown>['themeConfig']

export function useMonacoTheme(theme?: string, rootSelector = 'html'): ThemeConfig {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(undefined)

  useEffect(() => {
    if (!theme) return

    let attempts = 0
    const maxAttempts = 5
    const intervalMs = 100
    let intervalId: number | undefined

    const tryApplyTheme = () => {
      attempts++

      const rootEl = document.querySelector(rootSelector)
      if (!rootEl) return false

      const htmlClass = rootEl.className
      const hasThemeClass = htmlClass.includes(theme)

      if (hasThemeClass) {
        setThemeConfig({
          defaultTheme: theme,
          themes: getMonacoThemes(theme)
        })

        if (intervalId) {
          clearInterval(intervalId)
        }

        return true
      }

      if (attempts >= maxAttempts) {
        if (intervalId) {
          clearInterval(intervalId)
        }
      }

      return false
    }

    // Execute immediately
    const appliedImmediately = tryApplyTheme()

    // Poll if not execute immediately
    if (!appliedImmediately) {
      intervalId = window.setInterval(tryApplyTheme, intervalMs)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [rootSelector, theme])

  return themeConfig
}
