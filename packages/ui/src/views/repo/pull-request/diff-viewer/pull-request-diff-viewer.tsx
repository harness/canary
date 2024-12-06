import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Card, Input, Text } from '@/components/'
import { DiffFile, DiffModeEnum, DiffView, DiffViewProps, SplitSide } from '@git-diff-view/react'
import { DiffBlock } from 'diff2html/lib/types'
import { debounce } from 'lodash-es'
import { OverlayScrollbars } from 'overlayscrollbars'

import constants from './constants'

const TextArea = ({ onChange }: { onChange: (v: string) => void }) => {
  const [val, setVal] = useState('')

  return (
    <textarea
      className="min-h-[80px] w-full border !p-[2px]"
      autoFocus
      value={val}
      onChange={e => {
        const newValue = e.target.value
        setVal(newValue)
        onChange(newValue)
      }}
    />
  )
}
interface PullRequestDiffviewerProps {
  data?: string
  fontsize: number
  highlight: boolean
  mode: DiffModeEnum
  wrap: boolean
  addWidget: boolean
  fileName: string
  lang: string
  fullContent?: string
  addedLines?: number
  removedLines?: number
  isBinary?: boolean
  deleted?: boolean
  unchangedPercentage?: number
  blocks?: DiffBlock[]
}

const PullRequestDiffViewer = ({
  data,
  highlight,
  fontsize,
  mode,
  wrap,
  addWidget,
  lang,
  fileName,
  fullContent,
  addedLines,
  removedLines,
  unchangedPercentage,
  deleted,
  isBinary,
  blocks
}: PullRequestDiffviewerProps) => {
  const ref = useRef<{ getDiffFileInstance: () => DiffFile }>(null)
  const valRef = useRef('')
  const reactWrapRef = useRef<HTMLDivElement>(null)
  const reactRef = useRef<HTMLDivElement | null>(null)
  const highlightRef = useRef(highlight)
  const fileUnchanged = useMemo(
    () => unchangedPercentage === 100 || (addedLines === 0 && removedLines === 0),
    [addedLines, removedLines, unchangedPercentage]
  )
  const diffHasVeryLongLine = useMemo(
    () => blocks?.some(block => block.lines?.some(line => line.content?.length > constants.MAX_TEXT_LINE_SIZE_LIMIT)),
    [blocks]
  )
  const fileDeleted = useMemo(() => deleted, [deleted])
  const isDiffTooLarge = useMemo(
    () => addedLines && removedLines && addedLines + removedLines > constants.PULL_REQUEST_LARGE_DIFF_CHANGES_LIMIT,
    [addedLines, removedLines]
  )
  const [renderCustomContent] = useState(
    // !shouldDiffBeShownByDefault &&
    fileUnchanged || fileDeleted || isDiffTooLarge || isBinary || diffHasVeryLongLine
  )
  highlightRef.current = highlight
  const [diffFileInstance, setDiffFileInstance] = useState<DiffFile>()

  const [extend, setExtend] = useState<DiffViewProps<string>['extendData']>({
    oldFile: { '80': { data: 'hello world!' } },
    newFile: { '87': { data: 'line have been changed!' } }
  })

  const [
    scrollBar
    //  setScrollBar
  ] = useState(true)
  const [
    expandAll
    //  setExpandAll
  ] = useState(false)

  useEffect(() => {
    if (expandAll) {
      if (ref?.current) {
        ref?.current?.getDiffFileInstance?.().onAllExpand(mode & DiffModeEnum.Split ? 'split' : 'unified')
      }
    } else {
      if (ref?.current) {
        ref?.current?.getDiffFileInstance?.().onAllCollapse(mode & DiffModeEnum.Split ? 'split' : 'unified')
      }
    }
  }, [expandAll])

  useEffect(() => {
    if (diffFileInstance && scrollBar && !wrap) {
      const instanceArray: OverlayScrollbars[] = []
      const init = () => {
        const isSplitMode = mode & DiffModeEnum.Split
        if (isSplitMode) {
          const leftScrollbar = reactWrapRef.current?.querySelector('[data-left]') as HTMLDivElement
          const rightScrollbar = reactWrapRef.current?.querySelector('[data-right]') as HTMLDivElement
          const scrollContainers = Array.from(
            reactRef.current?.querySelectorAll('.scrollbar-hide') || []
          ) as HTMLDivElement[]
          const [left, right] = scrollContainers
          if (left && right) {
            const i1 = OverlayScrollbars(
              { target: left, scrollbars: { slot: leftScrollbar } },
              {
                overflow: {
                  y: 'hidden'
                }
              }
            )
            const i2 = OverlayScrollbars(
              { target: right, scrollbars: { slot: rightScrollbar } },
              {
                overflow: {
                  y: 'hidden'
                }
              }
            )
            instanceArray.push(i1, i2)
            const leftScrollEle = i1.elements().scrollEventElement as HTMLDivElement
            const rightScrollEle = i2.elements().scrollEventElement as HTMLDivElement
            i1.on('scroll', () => {
              rightScrollEle.scrollLeft = leftScrollEle.scrollLeft
            })
            i2.on('scroll', () => {
              leftScrollEle.scrollLeft = rightScrollEle.scrollLeft
            })
          }
        } else {
          const scrollBarContainer = reactWrapRef.current?.querySelector('[data-full]') as HTMLDivElement
          const scrollContainer = reactRef.current?.querySelector('.scrollbar-hide') as HTMLDivElement
          if (scrollContainer) {
            const i = OverlayScrollbars(
              { target: scrollContainer, scrollbars: { slot: scrollBarContainer } },
              {
                overflow: {
                  y: 'hidden'
                }
              }
            )
            instanceArray.push(i)
          }
        }
      }
      const id = setTimeout(init, 1000)
      return () => {
        clearTimeout(id)
        instanceArray.forEach(i => i.destroy())
      }
    }
  }, [diffFileInstance, scrollBar, wrap, mode, data])

  const setDiffInstanceCb = useCallback(
    debounce((fileName: string, lang: string, diffString: string, content?: string) => {
      if (!diffString) {
        setDiffFileInstance(undefined)
        return
      }
      const data = DiffFile.createInstance({
        newFile: { fileName: fileName, fileLang: lang, content: content },
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
      setDiffInstanceCb(fileName, lang, data, fullContent)
    }
  }, [])

  return (
    <>
      {diffFileInstance && !renderCustomContent && (
        <DiffView<string>
          ref={ref}
          className="bg-tr w-full text-tertiary-background"
          //   renderWidgetLine={({ onClose }) => {
          //     console.log('render widget')
          //     return <></>
          //   }}
          renderWidgetLine={({ onClose, side, lineNumber }) => {
            return (
              <div className="absolute flex w-full flex-col border px-[4px] py-[8px]">
                <TextArea onChange={v => (valRef.current = v)} />
                <div className="m-[5px] mt-[0.8em] text-right">
                  <div className="inline-flex justify-end gap-x-[12px]">
                    <button
                      className="rounded-[4px] border !px-[12px] py-[6px]"
                      onClick={() => {
                        onClose()
                        valRef.current = ''
                      }}
                    >
                      cancel
                    </button>
                    <button
                      className="rounded-[4px] border !px-[12px] py-[6px]"
                      onClick={() => {
                        onClose()
                        if (valRef.current) {
                          const sideKey = side === SplitSide.old ? 'oldFile' : 'newFile'
                          setExtend(prev => {
                            const res = { ...prev }
                            res[sideKey] = {
                              ...res[sideKey],
                              [lineNumber]: { lineNumber, data: valRef.current }
                            }
                            return res
                          })
                          setTimeout(() => {
                            valRef.current = ''
                          })
                        }
                      }}
                    >
                      submit
                    </button>
                  </div>
                </div>
              </div>
            )
          }}
          diffFile={diffFileInstance}
          extendData={extend}
          renderExtendLine={({ data }) => (
            <div className="bg-background/50 px-6 py-[6px]">
              <Card className="rounded-md bg-transparent">
                <div className="flex flex-col p-4">
                  <div className="flex items-center space-x-2">
                    <div className='size-6 rounded-full bg-tertiary-background bg-[url("../images/user-avatar.svg")] bg-cover'></div>
                    <Text color="primary">adam </Text>
                    <Text size={1} color="tertiaryBackground">
                      4 hours ago
                    </Text>
                  </div>
                  <Text size={2} color="primary" className="px-8 py-2">
                    {data}
                  </Text>
                </div>
                <div className="flex items-center gap-3 border-t p-4">
                  <div className='size-6 rounded-full bg-tertiary-background bg-[url("../images/user-avatar.svg")] bg-cover'></div>
                  <Input placeholder={'Reply here'} />
                </div>
              </Card>
            </div>
          )}
          // data={data}
          diffViewFontSize={fontsize}
          diffViewHighlight={highlight}
          diffViewMode={mode}
          diffViewWrap={wrap}
          diffViewAddWidget={addWidget}
        />
      )}
      {renderCustomContent && (
        <div className="pl-6 pt-4">
          {fileDeleted
            ? 'This file was deleted.'
            : isDiffTooLarge || diffHasVeryLongLine
              ? 'Large diffs are not rendered by default.'
              : isBinary
                ? 'Binary file not shown.'
                : 'File without changes.'}
        </div>
      )}
    </>
  )
}

export default PullRequestDiffViewer
