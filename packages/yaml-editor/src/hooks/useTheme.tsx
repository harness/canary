import { RefObject, useEffect, useState } from 'react'

import * as monaco from 'monaco-editor'

import { ThemeDefinition } from '../types/themes'

export type MonacoThemeConfig = {
  /** @deprecated */
  rootElementSelector?: string
  defaultTheme?: string
  themes?: ThemeDefinition[]
}

export type UseTheme = (arg: {
  monacoRef: RefObject<typeof monaco | undefined>
  themeConfig?: MonacoThemeConfig
  theme?: string
  editor: any
}) => { theme: string }

export const useTheme: UseTheme = (props): { theme: string } => {
  const { themeConfig, editor, theme } = props
  const { defaultTheme } = themeConfig ?? {}

  const [themeInternal, setThemeInternal] = useState(theme ?? defaultTheme ?? 'vs-dark')

  useEffect(() => {
    themeConfig?.themes?.forEach(themeItem => {
      monaco.editor.defineTheme(themeItem.themeName, themeItem.themeData)
    })
  }, [monaco, themeConfig])

  useEffect(() => {
    if (monaco.editor && theme) {
      monaco.editor.setTheme(theme)
      setThemeInternal(theme)
    }
  }, [editor, theme, themeConfig])

  return { theme: themeInternal }
}
