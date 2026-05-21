import { useEffect, useState } from 'react'

import { getMonacoThemes } from '@utils/monaco-theme-utils'

import { YamlEditorProps } from '@harnessio/yaml-editor'

type ThemeConfig = YamlEditorProps<unknown>['themeConfig']

const THEME_CLASS_PATTERN = /\b(light|dark)-[a-z]+-[a-z]+\b/
const DEFAULT_THEME = 'light-std-std'

function readThemeFromRoot(rootSelector: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const rootEl = document.querySelector(rootSelector)
  return rootEl?.className.match(THEME_CLASS_PATTERN)?.[0]
}

export function useMonacoTheme(theme?: string, rootSelector = 'html'): ThemeConfig {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
    const initial = theme ?? readThemeFromRoot(rootSelector) ?? DEFAULT_THEME
    return { defaultTheme: initial, themes: getMonacoThemes(initial) }
  })

  useEffect(() => {
    const apply = (next: string) => setThemeConfig({ defaultTheme: next, themes: getMonacoThemes(next) })

    if (theme) {
      apply(theme)
      return
    }

    const rootEl = typeof document !== 'undefined' ? document.querySelector(rootSelector) : null
    if (!rootEl) return

    apply(readThemeFromRoot(rootSelector) ?? DEFAULT_THEME)

    const observer = new MutationObserver(() => {
      const next = readThemeFromRoot(rootSelector)
      if (next) apply(next)
    })

    observer.observe(rootEl, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [rootSelector, theme])

  return themeConfig
}
