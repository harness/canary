import type { DiffHighlighter } from '@git-diff-view/react'

export type HighlighterType = Omit<DiffHighlighter, 'getHighlighterEngine'>
