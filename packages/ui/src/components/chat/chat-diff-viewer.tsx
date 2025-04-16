import { CSSProperties, useCallback, useEffect, useState } from 'react'

import { DiffFile, DiffModeEnum, DiffView } from '@git-diff-view/react'
import { getDiffViewHighlighter } from '@git-diff-view/shiki'
import { HighlighterType } from '@views/repo/pull-request/hooks/useDiffHighlighter'
import { debounce } from 'lodash-es'

interface ChatDiffViewerProps {
  data: string
  mode?: DiffModeEnum
  lang?: string
  fileName?: string
}

export const ChatDiffViewer = ({ data, mode = 4, lang = 'go', fileName }: ChatDiffViewerProps) => {
  const [, setLoading] = useState(false)
  const [diffFileInstance, setDiffFileInstance] = useState<DiffFile>()
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

  const setDiffInstanceCb = useCallback(
    debounce((lang: string, diffString: string, content?: string) => {
      if (!diffString) {
        setDiffFileInstance(undefined)
        return
      }
      const data = DiffFile.createInstance({
        newFile: { fileLang: lang, content: content },
        hunks: [diffString]
      })
      try {
        data?.init()
        if (mode === DiffModeEnum.Split) {
          data?.buildSplitDiffLines()
        } else {
          data?.buildUnifiedDiffLines()
        }

        setDiffFileInstance(data)
      } catch (e) {
        alert((e as Error).message)
      }
    }, 100),
    []
  )

  useEffect(() => {
    if (data) {
      setDiffInstanceCb(lang, data)
    }
  }, [data, lang, setDiffInstanceCb])

  return (
    <div className="mr-7 mt-3 flex flex-col rounded-md border border-cn-borders-2 bg-cn-background-1">
      {fileName && (
        <span className="rounded-[inherit] border-b border-cn-borders-2 bg-cn-background-2 p-4 text-2 font-medium text-cn-foreground-1">
          {fileName}
        </span>
      )}
      {diffFileInstance && (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <DiffView
          style={{ '--diff-plain-lineNumber--': 'var(--cn-bg-1)' } as CSSProperties}
          className="w-full text-cn-foreground-1"
          diffFile={diffFileInstance}
          diffViewFontSize={14}
          diffViewHighlight={true}
          diffViewMode={4}
          registerHighlighter={highlighter}
          diffViewWrap={false}
        />
      )}
    </div>
  )
}
