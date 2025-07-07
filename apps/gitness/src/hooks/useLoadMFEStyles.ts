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

const fetchHighlightJSStyles = async () => {
  const highlightJSStyles = await import(
    /* webpackChunkName: "highlightjs-styles" */ '!!raw-loader!highlight.js/styles/atom-one-dark.css'
  )
  return highlightJSStyles.default
}

export function useLoadMFEStyles(shadowRoot?: ShadowRoot | null) {
  const [isStylesLoaded, setIsStylesLoaded] = useState(false)

  useEffect(() => {
    if (shadowRoot) {
      Promise.all([fetchUIStyles(), fetchMonacoStyles(), fetchMarkdownPreviewStyles(), fetchHighlightJSStyles()]).then(
        ([uiStyles, monacoStyles, markdownPreviewStyles, highlightJSStyles]) => {
          const styleElement = document.createElement('style')
          styleElement.innerHTML = `${uiStyles}\n${monacoStyles}\n${markdownPreviewStyles}\n${highlightJSStyles}`
          shadowRoot?.appendChild(styleElement)
          setIsStylesLoaded(true)
        }
      )
    }
  }, [shadowRoot])

  return isStylesLoaded
}
