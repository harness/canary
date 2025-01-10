import type { Nodes } from 'hast'
import { toHtml } from 'hast-util-to-html'
import { refractor } from 'refractor'

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
  const codeBlockContent = suggestionBlock?.source || ''
  const lang = suggestionBlock?.lang || 'plaintext'
  const language = `language-${lang}`
  const html1 = toHtml(refractor.highlight(codeBlockContent, lang) as unknown as Nodes)
  const html2 = toHtml(refractor.highlight(code, lang) as unknown as Nodes)
  return (
    <div>
      <span>
        {suggestionBlock?.appliedCheckSum && suggestionBlock?.appliedCheckSum === suggestionCheckSum
          ? 'Suggestion applied'
          : 'Suggested change'}
      </span>
      <div className="pt-1">
        <div>
          <pre className={`!bg-background-danger ${language}`}>
            <code className={`${language} code-highlight`} dangerouslySetInnerHTML={{ __html: html1 }}></code>
          </pre>
        </div>
        <div>
          <pre className={`!bg-background-success ${language}`}>
            <code className={`${language} code-highlight`} dangerouslySetInnerHTML={{ __html: html2 }}></code>
          </pre>
        </div>
      </div>
    </div>
  )
}
