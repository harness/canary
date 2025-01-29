import { useEffect, useState } from 'react'

const fetchUIStyles = async () => {
  const uiStyles = await import(
    /* webpackChunkName: "harness-openSource-ui-styles" */ '!!raw-loader!@harnessio/ui/styles.css'
  )
  return uiStyles.default
}

const fetchMonacoStyles = async () => {
  const monacoStyles = await import(/* webpackChunkName: "monaco-styles" */ '!!raw-loader!../styles/monaco-styles.css')
  return monacoStyles.default
}

const fetchMarkdownPreviewStyles = async () => {
  const markdownPreviewStyles = await import(
    /* webpackChunkName: "markdown-preview-styles" */ '!!raw-loader!@harnessio/ui/markdown-preview-styles.css'
  )
  return markdownPreviewStyles.default
}

export function useLoadMFEStyles(portalContainer: Element | undefined) {
  const [isStylesLoaded, setIsStylesLoaded] = useState(false)

  useEffect(() => {
    if (portalContainer) {
      Promise.all([fetchUIStyles(), fetchMonacoStyles(), fetchMarkdownPreviewStyles()]).then(
        ([uiStyles, monacoStyles, markdownPreviewStyles]) => {
          const styleElement = document.createElement('style')
          styleElement.innerHTML = `${uiStyles}\n${monacoStyles}\n${markdownPreviewStyles}`
          portalContainer?.appendChild(styleElement)
          setIsStylesLoaded(true)
        }
      )
    }
  }, [portalContainer])

  return isStylesLoaded
}
