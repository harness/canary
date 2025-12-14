import { generateDiffFile, type DiffHighlighterLang } from '@git-diff-view/file'
import { DiffModeEnum, DiffView } from '@git-diff-view/react'

import '@git-diff-view/react/styles/diff-view.css'

import { useMemo } from 'react'

import { useTheme } from '@/context'
import { useDiffHighlighter } from '@views/repo/pull-request/hooks/useDiffHighlighter'

interface DiffViewerProps {
  oldCode: string
  newCode: string
  lang?: DiffHighlighterLang
}

const DiffViewer = ({ newCode, oldCode, lang = 'yaml' }: DiffViewerProps) => {
  const { isLightTheme } = useTheme()

  const highlighter = useDiffHighlighter({ setLoading: () => {} })

  const getDiffFile = () => {
    const instance = generateDiffFile('oldFileName', oldCode, 'newFileName', newCode, lang, lang)
    instance.initRaw()
    return instance
  }

  const diffFile = useMemo(() => getDiffFile(), [])

  return (
    <DiffView
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      diffFile={diffFile}
      diffViewHighlight
      diffViewWrap={false}
      registerHighlighter={highlighter}
      diffViewMode={DiffModeEnum.Split}
      diffViewTheme={isLightTheme ? 'light' : 'dark'}
    />
  )
}

export { DiffViewer, DiffModeEnum }
