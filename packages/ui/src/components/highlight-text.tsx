import { Fragment } from 'react'

import fuzzysort from 'fuzzysort'

export interface HighlightTextProps {
  text: string
  match?: string | null
  className?: string
}

/**
 * Renders `text` with the characters matching `match` highlighted in <mark>,
 * using the same fuzzysort-based matching as the file search (see search-files.tsx).
 */
export const HighlightText = ({ text, match, className }: HighlightTextProps) => {
  const result = match ? fuzzysort.single(match, text) : null

  if (!result) {
    return <span className={className}>{text}</span>
  }

  let spanKeyIndex = 0
  const parts = result
    .highlight((m, index) => <mark key={'m-' + index}>{m}</mark>)
    .filter(part => typeof part !== 'string' || part.length > 0)
    .map(part => (typeof part === 'string' ? <Fragment key={'s-' + spanKeyIndex++}>{part}</Fragment> : part))

  return <span className={className}>{parts}</span>
}
