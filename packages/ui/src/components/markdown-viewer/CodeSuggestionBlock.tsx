import { useMemo } from 'react'

import hljs from 'highlight.js'

export interface SuggestionBlock {
  source: string
  lang?: string
  commentId?: number
  appliedCheckSum?: string
  appliedCommitSha?: string
}

export interface Suggestion {
  check_sum: string
  comment_id: number
}

interface CodeSuggestionBlockProps {
  code: string
  suggestionBlock?: SuggestionBlock
  suggestionCheckSum?: string
}
export function CodeSuggestionBlock({ code, suggestionBlock, suggestionCheckSum }: CodeSuggestionBlockProps) {
  const language = useMemo(() => suggestionBlock?.lang || 'plaintext', [suggestionBlock?.lang])

  const highlightedHtmlOld = useMemo(() => {
    const codeBlockContent = suggestionBlock?.source || ''

    if (!language) return hljs.highlightAuto(codeBlockContent).value
    return hljs.highlight(codeBlockContent, { language }).value
  }, [suggestionBlock?.source, language])

  const highlightedHtmlNew = useMemo(() => {
    if (!language) return hljs.highlightAuto(code).value
    return hljs.highlight(code, { language }).value
  }, [code, language])

  return (
    <div>
      <span>
        {suggestionBlock?.appliedCheckSum && suggestionBlock?.appliedCheckSum === suggestionCheckSum
          ? 'Suggestion applied'
          : 'Suggested change'}
      </span>
      <div className="pt-1">
        <pre className="!bg-background-danger">
          <code
            className={`${language} code-highlight`}
            dangerouslySetInnerHTML={{ __html: highlightedHtmlOld }}
          ></code>
        </pre>
        <pre className="!bg-background-success">
          <code
            className={`${language} code-highlight`}
            dangerouslySetInnerHTML={{ __html: highlightedHtmlNew }}
          ></code>
        </pre>
      </div>
    </div>
  )
}
