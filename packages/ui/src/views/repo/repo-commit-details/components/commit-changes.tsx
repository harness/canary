import { FC, useCallback, useEffect, useMemo, useState } from 'react'

import { Accordion, Badge, Button, CopyButton, Layout, StackedList } from '@/components'
import { TranslationStore } from '@/views'
import { DiffModeEnum } from '@git-diff-view/react'
import PullRequestDiffViewer from '@views/repo/pull-request/components/pull-request-diff-viewer'
import { useDiffConfig } from '@views/repo/pull-request/hooks/useDiffConfig'
import { parseStartingLineIfOne, PULL_REQUEST_LARGE_DIFF_CHANGES_LIMIT } from '@views/repo/pull-request/utils'

interface HeaderProps {
  text: string
  numAdditions?: number
  numDeletions?: number
  data?: string
  title: string
  lang: string
  fileViews?: Map<string, string>
  checksumAfter?: string
  filePath: string
  isDeleted?: boolean
  unchangedPercentage?: number
  isBinary?: boolean
}

interface LineTitleProps {
  useTranslationStore: () => TranslationStore
  header: HeaderProps
}

interface DataProps {
  data: HeaderProps[]
  diffMode: DiffModeEnum
  useTranslationStore: () => TranslationStore
}

const LineTitle: FC<LineTitleProps> = ({ header, useTranslationStore }) => {
  const { t: _t } = useTranslationStore()
  const { text, numAdditions, numDeletions } = header
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="inline-flex items-center gap-2">
        <span className="text-3 font-medium">{text}</span>
        <CopyButton name={text} color="gray" />
        {!!numAdditions && (
          <Badge variant="surface" size="sm" theme="success">
            +{numAdditions}
          </Badge>
        )}
        {!!numDeletions && (
          <Badge variant="surface" size="sm" theme="danger">
            -{numDeletions}
          </Badge>
        )}
      </div>
    </div>
  )
}

const CommitsAccordion: FC<{
  header: HeaderProps
  data?: string
  diffMode: DiffModeEnum
  useTranslationStore: () => TranslationStore
  openItems: string[]
  onToggle: () => void
}> = ({ header, diffMode, useTranslationStore, openItems, onToggle }) => {
  const { t: _ts } = useTranslationStore()
  const { highlight, wrap, fontsize } = useDiffConfig()

  const startingLine = parseStartingLineIfOne(header?.data ?? '')

  const [showHiddenDiff, setShowHiddenDiff] = useState(false)
  const fileDeleted = useMemo(() => header?.isDeleted, [header?.isDeleted])
  const isDiffTooLarge = useMemo(() => {
    if (header?.numAdditions && header?.numDeletions) {
      return header?.numAdditions + header?.numDeletions > PULL_REQUEST_LARGE_DIFF_CHANGES_LIMIT
    }
    return false
  }, [header?.numAdditions, header?.numDeletions])
  const fileUnchanged = useMemo(
    () => header?.unchangedPercentage === 100 || (header?.numAdditions === 0 && header?.numDeletions === 0),
    [header?.numAdditions, header?.numDeletions, header?.unchangedPercentage]
  )

  return (
    <StackedList.Root>
      <StackedList.Item disableHover isHeader className="cursor-default p-0 hover:bg-transparent">
        <Accordion.Root type="multiple" className="w-full" value={openItems} onValueChange={onToggle}>
          <Accordion.Item isLast value={header?.text ?? ''}>
            <Accordion.Trigger leftChevron className="px-4 py-[9px] text-left">
              <StackedList.Field title={<LineTitle useTranslationStore={useTranslationStore} header={header} />} />
            </Accordion.Trigger>
            <Accordion.Content className="pb-0">
              <div className="border-t bg-transparent">
                {(fileDeleted || isDiffTooLarge || fileUnchanged || header?.isBinary) && !showHiddenDiff ? (
                  <Layout.Vertical gap="space-y-0" className="flex w-full items-center py-5">
                    <Button
                      className="text-cn-foreground-accent"
                      variant="link"
                      size="sm"
                      aria-label="show diff"
                      onClick={() => setShowHiddenDiff(true)}
                    >
                      {_ts('views:pullRequests.showDiff')}
                    </Button>
                    <span>
                      {fileDeleted
                        ? _ts('views:pullRequests.deletedFileDiff')
                        : isDiffTooLarge
                          ? _ts('views:pullRequests.largeDiff')
                          : header?.isBinary
                            ? _ts('views:pullRequests.binaryNotShown')
                            : _ts('views:pullRequests.fileNoChanges')}
                    </span>
                  </Layout.Vertical>
                ) : (
                  <>
                    {startingLine ? (
                      <div className="bg-[--diff-hunk-lineNumber--]">
                        <div className="ml-16 w-full px-2 py-1">{startingLine}</div>
                      </div>
                    ) : null}
                    <PullRequestDiffViewer
                      data={header?.data}
                      fontsize={fontsize}
                      highlight={highlight}
                      mode={diffMode}
                      wrap={wrap}
                      addWidget={false}
                      fileName={header.title}
                      lang={header.lang}
                      useTranslationStore={useTranslationStore}
                    />
                  </>
                )}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </StackedList.Item>
    </StackedList.Root>
  )
}

export const CommitChanges: FC<DataProps> = ({ data, diffMode, useTranslationStore }) => {
  const [openItems, setOpenItems] = useState<string[]>([])

  useEffect(() => {
    if (data.length > 0) {
      const itemsToOpen: string[] = []
      data.map(diffItem => {
        itemsToOpen.push(diffItem.text)
      })
      setOpenItems(itemsToOpen)
    }
  }, [data])

  const toggleOpen = useCallback(
    (fileText: string) => {
      setOpenItems(curr => (curr.includes(fileText) ? curr.filter(t => t !== fileText) : [...curr, fileText]))
    },
    [setOpenItems]
  )
  return (
    <div className="flex flex-col gap-4">
      {data.map((item, index) => {
        return (
          <CommitsAccordion
            key={`${item.title}-${index}`}
            header={item}
            diffMode={diffMode}
            useTranslationStore={useTranslationStore}
            openItems={openItems}
            onToggle={() => toggleOpen(item.text)}
          />
        )
      })}
    </div>
  )
}
