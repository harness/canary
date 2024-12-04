import { RefObject, useEffect, useState } from 'react'

import * as monaco from 'monaco-editor'

import { ThemeDefinition } from '../types/themes'

export type UseTheme = (arg: {
  monacoRef: RefObject<typeof monaco | undefined>
  themeConfig?: {
    rootElementSelector?: string
    defaultTheme?: string
    themes?: ThemeDefinition[]
  }
  editor: any
}) => { theme: string }

export const useTheme: UseTheme = (props): { theme: string } => {
  const { themeConfig, editor } = props
  const { rootElementSelector, defaultTheme } = themeConfig ?? {}

  const [theme, setTheme] = useState(defaultTheme ?? 'vs-dark')

  useEffect(() => {
    themeConfig?.themes?.forEach(theme => {
      monaco.editor.defineTheme(theme.themeName, theme.themeData)
    })
  }, [monaco])

  useEffect(() => {
    const monacoEditor = monaco.editor

    if (!monacoEditor) return

    // if there is no selector for observing element, set default theme
    if (!rootElementSelector) {
      monacoEditor?.setTheme(theme)
      return
    }

    const targetNode = document.querySelector(rootElementSelector)

    if (!targetNode) return

    const config = { attributes: true, childList: false, subtree: false }

    const callback = () => {
      const newTheme = targetNode.classList.contains('dark') ? 'dark' : 'light'

      if (theme !== newTheme) {
        setTheme(newTheme)

        const monacoEditor = monaco.editor
        monacoEditor?.setTheme(newTheme)
      }
    }

    const observer = new MutationObserver(callback)
    observer.observe(targetNode, config)

    return () => {
      observer.disconnect()
    }
  }, [editor])

  return { theme }
}
