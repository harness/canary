import { FC, useCallback, useEffect, useMemo, useState } from 'react'

import { Accordion, Button, CopyButton, Layout, Link, StackedList, StatusBadge } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
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

interface DataProps {
  data: HeaderProps[]
  diffMode: DiffModeEnum
  toRepoFileDetails?: ({ path }: { path: string }) => string
  commitSHA: string
}

const LineTitle: FC<
  HeaderProps & { toRepoFileDetails?: ({ path }: { path: string }) => string; commitSHA: string }
> = ({ text, numAdditions, numDeletions, toRepoFileDetails, commitSHA }) => {
  return (
    <div className="flex w-full max-w-full items-center gap-cn-xs">
      <Link
        to={toRepoFileDetails?.({ path: `files/${commitSHA}/~/${encodeURI(encodeURI(text))}` }) ?? ''}
        variant="secondary"
        className="min-w-0 break-all"
      >
        {text}
      </Link>
      <CopyButton name={text} buttonVariant="ghost" className="relative z-10" />
      {!!numAdditions && (
        <StatusBadge variant="outline" size="sm" theme="success">
          +{numAdditions}
        </StatusBadge>
      )}
      {!!numDeletions && (
        <StatusBadge variant="outline" size="sm" theme="danger">
          -{numDeletions}
        </StatusBadge>
      )}
    </div>
  )
}

const CommitsAccordion: FC<{
  header: HeaderProps
  data?: string
  diffMode: DiffModeEnum
  openItems: string[]
  onToggle: () => void
  toRepoFileDetails?: ({ path }: { path: string }) => string
  commitSHA: string
}> = ({ header, diffMode, openItems, onToggle, toRepoFileDetails, commitSHA }) => {
  const { t: _ts } = useTranslation()
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
      <StackedList.Header paddingY="0" paddingX="0">
        <Accordion.Root
          type="multiple"
          className="w-full"
          value={openItems}
          onValueChange={onToggle}
          indicatorPosition="left"
        >
          <Accordion.Item value={header?.text ?? ''} className="border-none">
            <Accordion.Trigger className="!py-cn-xs !px-cn-sm hover:cursor-pointer [&>.cn-accordion-trigger-indicator]:m-0 [&>.cn-accordion-trigger-indicator]:self-center">
              <StackedList.Field
                title={<LineTitle {...header} toRepoFileDetails={toRepoFileDetails} commitSHA={commitSHA} />}
                disableTruncate
              />
            </Accordion.Trigger>
            <Accordion.Content className="pb-0">
              <div className="rounded-b-cn-3 overflow-hidden border-t bg-transparent">
                {(fileDeleted || isDiffTooLarge || fileUnchanged || header?.isBinary) && !showHiddenDiff ? (
                  <Layout.Vertical align="center" className="py-cn-lg w-full">
                    {!fileUnchanged && (
                      <Button
                        className="text-cn-brand"
                        variant="link"
                        size="sm"
                        aria-label="show diff"
                        onClick={() => setShowHiddenDiff(true)}
                      >
                        {_ts('views:pullRequests.showDiff')}
                      </Button>
                    )}
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
                    {startingLine && (
                      <div className="bg-[--diff-hunk-lineNumber--]">
                        {/* TODO: Replace pl-[48px] with a proper spacing token when available */}
                        <div className="px-cn-xs py-cn-3xs w-full pl-[48px]">{startingLine}</div>
                      </div>
                    )}
                    <PullRequestDiffViewer
                      /**
                       * In commit changes we don't need principal props as we don't have any comments.
                       */
                      principalProps={{}}
                      data={header?.data}
                      fontsize={fontsize}
                      highlight={highlight}
                      mode={diffMode}
                      wrap={wrap}
                      addWidget={false}
                      fileName={header.title}
                      lang={header.lang}
                    />
                  </>
                )}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </StackedList.Header>
    </StackedList.Root>
  )
}

export const CommitChanges: FC<DataProps> = ({ data, diffMode, commitSHA, toRepoFileDetails }) => {
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
    <Layout.Grid gapY="md">
      {data.map((item, index) => {
        return (
          <CommitsAccordion
            key={`${item.title}-${index}`}
            header={item}
            diffMode={diffMode}
            openItems={openItems}
            onToggle={() => toggleOpen(item.text)}
            toRepoFileDetails={toRepoFileDetails}
            commitSHA={commitSHA}
          />
        )
      })}
    </Layout.Grid>
  )
}

CommitChanges.displayName = 'CommitChanges'
