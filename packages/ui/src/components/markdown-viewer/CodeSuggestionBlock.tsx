import { useMemo } from 'react'

import hljs from 'highlight.js'

export interface SuggestionBlock {
  source: string
  lang?: string
}

export interface Suggestion {
  check_sum: string
  comment_id: number
}

interface CodeSuggestionBlockProps {
  code: string
  suggestionBlock?: SuggestionBlock
}
export function CodeSuggestionBlock({ code, suggestionBlock }: CodeSuggestionBlockProps) {
  const language = useMemo(() => suggestionBlock?.lang || 'plaintext', [suggestionBlock?.lang])

  const highlightedHtmlOld = useMemo(() => {
    const codeBlockContent = suggestionBlock?.source || ''

    try {
      if (!language) return hljs.highlightAuto(codeBlockContent).value
      return hljs.highlight(codeBlockContent, { language }).value
    } catch {
      // Fallback to auto-detection if language is unknown
      return hljs.highlightAuto(codeBlockContent).value
    }
  }, [suggestionBlock?.source, language])

  const highlightedHtmlNew = useMemo(() => {
    try {
      if (!language) return hljs.highlightAuto(code).value
      return hljs.highlight(code, { language }).value
    } catch {
      // Fallback to auto-detection if language is unknown
      return hljs.highlightAuto(code).value
    }
  }, [code, language])

  return (
    <>
      <code
        className={`${language} code-highlight !bg-cn-diff-danger !py-cn-xs !pr-cn-sm !pl-cn-md`}
        dangerouslySetInnerHTML={{ __html: highlightedHtmlOld }}
      />
      <code
        className={`${language} code-highlight !bg-cn-diff-success !py-cn-xs !pr-cn-sm !pl-cn-md`}
        dangerouslySetInnerHTML={{ __html: highlightedHtmlNew }}
      />
    </>
  )
}
