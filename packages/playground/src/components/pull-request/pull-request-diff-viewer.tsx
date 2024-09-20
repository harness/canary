import { DiffModeEnum, DiffFile, DiffView, DiffViewProps, SplitSide } from '@git-diff-view/react'
import {
  //   Accordion,
  //   AccordionContent,
  //   AccordionItem,
  //   AccordionTrigger,
  //   Button,
  Card,
  Input,
  //   StackedList,
  Text
} from '@harnessio/canary'
import React, { useEffect, useRef, useState } from 'react'
import { OverlayScrollbars } from 'overlayscrollbars'
// import * as data from '../../data/mockDiffViewerdata'
// import '@git-diff-view/react/styles/diff-view.css'
// import { MessageData } from './worker'
import { usePrevious } from './usePrevious'
// const worker = new Worker(new URL('./worker.ts', import.meta.url), {
//   type: 'module'
// })
const TextArea = ({ onChange }: { onChange: (v: string) => void }) => {
  const [val, setVal] = useState('')

  useEffect(() => {
    onChange(val)
  }, [val])

  return (
    <textarea
      className="min-h-[80px] w-full border !p-[2px]"
      autoFocus
      value={val}
      onChange={e => setVal(e.target.value)}
    />
  )
}
interface PullRequestDiffviewerProps {
  data:
    | {
        oldFile?: {
          fileName?: string | null
          fileLang?: string | null
          content?: string | null
        }
        newFile?: {
          fileName?: string | null
          fileLang?: string | null
          content?: string | null
        }
        hunks: string[]
      }
    | undefined
  fontsize: number
  highlight: boolean
  mode: DiffModeEnum
  wrap: boolean
  addWidget: boolean
}

const PullRequestDiffViewer = ({ data, highlight, fontsize, mode, wrap, addWidget }: PullRequestDiffviewerProps) => {
  // const [v] = useState<K>('a')

  const ref = useRef<{ getDiffFileInstance: () => DiffFile }>(null)
  const valRef = useRef('')
  const reactWrapRef = useRef<HTMLDivElement>(null)
  const reactRef = useRef<HTMLDivElement | null>(null)
  const highlightRef = useRef(highlight)

  highlightRef.current = highlight
  const [
    diffFileInstance
    // setDiffFileInstance
  ] = useState<DiffFile>()
  const previous = usePrevious(diffFileInstance)

  const [extend, setExtend] = useState<DiffViewProps<string>['extendData']>({
    oldFile: { '80': { data: 'hello world!' } },
    newFile: { '87': { data: 'line have been changed!' } }
  })
  useEffect(() => {
    if (previous && diffFileInstance !== previous) {
      setExtend({ oldFile: {}, newFile: {} })
    }
  }, [diffFileInstance, previous])
  const [
    scrollBar
    //  setScrollBar
  ] = useState(true)
  const [
    expandAll
    //  setExpandAll
  ] = useState(false)
  //   useEffect(() => {
  //     worker.addEventListener('message', (e: MessageEvent<MessageData>) => {
  //       const { data, bundle } = e.data
  //       const instance = DiffFile.createInstance(data || {}, bundle)
  //       setExpandAll(false)
  //       setDiffFileInstance(instance)
  //       console.timeEnd('parse')
  //     })
  //   }, [])
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

  // useEffect(() => {
  //   const _data = data[v]
  //   if (_data) {
  //     console.time('parse')
  //     // Assuming worker is defined and set up correctly
  //     //   worker.postMessage({ type: 'parse', data: _data, highlight: highlightRef.current })
  //   }
  // }, [v])

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

  const handleClick = () => {
    console.log('click')
  }
  useEffect(() => {
    // const instance = DiffFile.createInstance(data || {}, bundle)
    // setExpandAll(false)
    // setDiffFileInstance(instance)
  }, [handleClick])
  return (
    <DiffView<string>
      ref={ref}
      className="text-tertiary-background bg-tr"
      //   renderWidgetLine={({ onClose }) => {
      //     console.log('render widget')
      //     return <></>
      //   }}
      renderWidgetLine={({ onClose, side, lineNumber }) => {
        return (
          <div className="flex w-full absolute flex-col border px-[4px] py-[8px]">
            <TextArea onChange={v => (valRef.current = v)} />
            <div className="m-[5px] mt-[0.8em] text-right">
              <div className="inline-flex justify-end gap-x-[12px]">
                <button
                  className="rounded-[4px] border !px-[12px] py-[6px]"
                  onClick={() => {
                    onClose()
                    valRef.current = ''
                  }}>
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
                  }}>
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
          <Card className="bg-transparent rounded-md">
            <div className="flex flex-col px-4 py-4">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-full bg-tertiary-background  bg-cover"></div>
                <Text color="primary">adam </Text>
                <Text size={1} color="tertiaryBackground">
                  4 hours ago
                </Text>
              </div>
              <Text size={2} color="primary" className="px-8 py-2">
                {data}
              </Text>
            </div>
            <div className="flex items-center gap-3 border-t px-4 py-4">
              <div className="h-6 w-6 rounded-full bg-tertiary-background  bg-cover"></div>
              <Input placeholder={'Reply here'} />
            </div>
          </Card>
        </div>
      )}
      data={data}
      diffViewFontSize={fontsize}
      diffViewHighlight={highlight}
      diffViewMode={mode}
      diffViewWrap={wrap}
      diffViewAddWidget={addWidget}
      onAddWidgetClick={() => {
        handleClick()
      }}
    />
  )
}

export default PullRequestDiffViewer
