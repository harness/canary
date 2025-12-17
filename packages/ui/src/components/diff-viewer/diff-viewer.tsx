import { generateDiffFile, type DiffHighlighterLang } from '@git-diff-view/file'
import { DiffModeEnum, DiffView } from '@git-diff-view/react'

import '@git-diff-view/react/styles/diff-view.css'

import { useMemo } from 'react'

import { useTheme } from '@/context'

import { useDiffHighlighter } from './use-diff-highlighter'

interface DiffViewerProps {
  oldCode: string
  newCode: string
  lang?: DiffHighlighterLang
  diffViewWrap?: boolean
}

const DiffViewer = ({ newCode, oldCode, lang = 'yaml', diffViewWrap = false }: DiffViewerProps) => {
  const { isLightTheme } = useTheme()
  const highlighter = useDiffHighlighter({ setLoading: () => {} })

  const diffFile = useMemo(() => {
    const instance = generateDiffFile('oldFile', oldCode, 'newFile', newCode, lang, lang)
    instance.initRaw()
    return instance
  }, [oldCode, newCode, lang])

  if (!diffFile) return null

  return (
    <DiffView
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      diffFile={diffFile}
      diffViewHighlight
      diffViewWrap={diffViewWrap}
      registerHighlighter={highlighter}
      diffViewMode={DiffModeEnum.Split}
      diffViewTheme={isLightTheme ? 'light' : 'dark'}
    />
  )
}

export { DiffViewer, DiffModeEnum }
