import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

import { getDiffViewHighlighter } from '@git-diff-view/shiki'

// Re-export from UI types for backward compatibility
export type { HighlighterType } from '@harnessio/ui/types'

import type { HighlighterType } from '@harnessio/ui/types'

export const useDiffHighlighter = ({ setLoading }: { setLoading: Dispatch<SetStateAction<boolean>> }) => {
  const [highlighter, setHighlighter] = useState<HighlighterType>()

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        const shikiHighlighter = await getDiffViewHighlighter()
        if (shikiHighlighter) {
          setHighlighter(shikiHighlighter as HighlighterType)
        }
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [setLoading])

  return highlighter
}
