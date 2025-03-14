import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

import type { DiffHighlighter } from '@git-diff-view/react'
import { getDiffViewHighlighter } from '@git-diff-view/shiki'

export type HighlighterType = Omit<DiffHighlighter, 'getHighlighterEngine'>

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
