import { FC, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  Accordion,
  Button,
  CopyButton,
  DropdownMenu,
  Layout,
  ListActions,
  Spacer,
  StackedList,
  StatusBadge,
  Text
} from '@/components'
import { useTranslation } from '@/context'
import { formatNumber } from '@/utils'
import { DiffModeOptions, InViewDiffRenderer, jumpToFile, PrincipalPropsType, TypesDiffStats } from '@/views'
import { DiffModeEnum } from '@git-diff-view/react'
import { chunk } from 'lodash-es'

import PullRequestDiffViewer from '../../components/pull-request-diff-viewer'
import { useDiffConfig } from '../../hooks/useDiffConfig'
import {
  calculateDetectionMargin,
  IN_VIEWPORT_DETECTION_MARGIN,
  innerBlockName,
  outterBlockName,
  parseStartingLineIfOne,
  PULL_REQUEST_DIFF_RENDERING_BLOCK_SIZE,
  PULL_REQUEST_LARGE_DIFF_CHANGES_LIMIT,
  shouldRetainDiffChildren
} from '../../utils'
import { HeaderProps } from '../pull-request-compare.types'

interface LineTitleProps {
  text: string
}

const LineTitle: FC<LineTitleProps> = ({ text }) => (
  <div className="flex items-center justify-between gap-3">
    <div className="inline-flex items-center gap-2">
      <Text variant="body-strong">{text}</Text>
      <CopyButton name={text} />
    </div>
  </div>
)

interface PullRequestAccordionProps {
  header?: HeaderProps
  data?: string
  diffMode: DiffModeEnum
  currentUser?: string
  openItems: string[]
  onToggle: () => void
  setCollapsed: (val: boolean) => void
  principalProps: PrincipalPropsType
}

const PullRequestAccordion: FC<PullRequestAccordionProps> = ({
  header,
  diffMode,
  currentUser,
  openItems,
  onToggle,
  setCollapsed,
  principalProps
}) => {
  const { t: _ts } = useTranslation()
  const { highlight, wrap, fontsize } = useDiffConfig()
  const [showHiddenDiff, setShowHiddenDiff] = useState(false)
  const startingLine = useMemo(
    () => (parseStartingLineIfOne(header?.data ?? '') !== null ? parseStartingLineIfOne(header?.data ?? '') : null),
    [header?.data]
  )

  const fileDeleted = useMemo(() => header?.isDeleted, [header?.isDeleted])
  const isDiffTooLarge = useMemo(() => {
    if (header?.addedLines && header?.removedLines) {
      return header?.addedLines + header?.removedLines > PULL_REQUEST_LARGE_DIFF_CHANGES_LIMIT
    }
    return false
  }, [header?.addedLines, header?.removedLines])
  const fileUnchanged = useMemo(
    () => header?.unchangedPercentage === 100 || (header?.addedLines === 0 && header?.removedLines === 0),
    [header?.addedLines, header?.removedLines, header?.unchangedPercentage]
  )

  return (
    <StackedList.Root>
      <StackedList.Item disableHover isHeader className="cursor-default p-0 hover:bg-transparent">
        <Accordion.Root
          type="multiple"
          className="w-full"
          value={openItems}
          onValueChange={onToggle}
          indicatorPosition="left"
        >
          <Accordion.Item value={header?.text ?? ''} className="border-none">
            <Accordion.Trigger className="px-4 [&>.cn-accordion-trigger-indicator]:m-0 [&>.cn-accordion-trigger-indicator]:self-center">
              <StackedList.Field title={<LineTitle text={header?.text ?? ''} />} />
            </Accordion.Trigger>
            <Accordion.Content className="pb-0">
              <div className="border-t bg-transparent">
                {(fileDeleted || isDiffTooLarge || fileUnchanged || header?.isBinary) && !showHiddenDiff ? (
                  <Layout.Vertical align="center" className="w-full py-5">
                    <Button variant="link" size="sm" aria-label="show diff" onClick={() => setShowHiddenDiff(true)}>
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
                    {startingLine && (
                      <div className="bg-[--diff-hunk-lineNumber--]">
                        <div className="ml-16 w-full px-2 py-1">{startingLine}</div>
                      </div>
                    )}
                    <PullRequestDiffViewer
                      principalProps={principalProps}
                      currentUser={currentUser}
                      data={header?.data}
                      fontsize={fontsize}
                      highlight={highlight}
                      mode={diffMode}
                      wrap={wrap}
                      addWidget={false}
                      fileName={header?.title ?? ''}
                      lang={header?.lang ?? ''}
                      isBinary={header?.isBinary}
                      addedLines={header?.addedLines}
                      removedLines={header?.removedLines}
                      deleted={header?.isDeleted}
                      unchangedPercentage={header?.unchangedPercentage}
                      collapseDiff={() => setCollapsed(true)}
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

interface PullRequestCompareDiffListProps {
  diffStats: TypesDiffStats
  diffData: HeaderProps[]
  currentUser?: string
  jumpToDiff?: string
  setJumpToDiff: (fileName: string) => void
  principalProps: PrincipalPropsType
}

const PullRequestCompareDiffList: FC<PullRequestCompareDiffListProps> = ({
  diffStats,
  diffData,
  currentUser,
  jumpToDiff,
  setJumpToDiff,
  principalProps
}) => {
  const { t } = useTranslation()
  const [diffMode, setDiffMode] = useState<DiffModeEnum>(DiffModeEnum.Split)
  const handleDiffModeChange = (value: string) => {
    setDiffMode(value === 'Split' ? DiffModeEnum.Split : DiffModeEnum.Unified)
  }
  const [openItems, setOpenItems] = useState<string[]>([])
  const diffBlocks = useMemo(() => chunk(diffData, PULL_REQUEST_DIFF_RENDERING_BLOCK_SIZE), [diffData])
  const diffsContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (diffData.length > 0) {
      const itemsToOpen: string[] = []
      diffData.map(diffItem => {
        itemsToOpen.push(diffItem.text)
      })
      setOpenItems(itemsToOpen)
    }
  }, [diffData])

  const toggleOpen = useCallback(
    (fileText: string) => {
      setOpenItems(curr => (curr.includes(fileText) ? curr.filter(t => t !== fileText) : [...curr, fileText]))
    },
    [setOpenItems]
  )
  useEffect(() => {
    if (!jumpToDiff) return
    jumpToFile(jumpToDiff, diffBlocks, setJumpToDiff)
  }, [jumpToDiff, diffBlocks, setJumpToDiff])

  const setCollapsed = useCallback(
    (fileText: string, val: boolean) => {
      setOpenItems(items => {
        if (val) {
          return items.filter(item => item !== fileText)
        } else {
          return items.includes(fileText) ? items : [...items, fileText]
        }
      })
    },
    [setOpenItems]
  )

  const changedFilesCount = diffStats.files_changed || 0

  return (
    <>
      <ListActions.Root>
        <ListActions.Left>
          <DropdownMenu.Root>
            <p className="text-2 leading-tight text-cn-foreground-2">
              {t('views:commits.commitDetailsDiffShowing', 'Showing')}{' '}
              <FilesChangedCount showAsDropdown={changedFilesCount !== 0}>
                <span className="cursor-pointer text-cn-foreground-accent ease-in-out">
                  {formatNumber(changedFilesCount)} {t('views:commits.commitDetailsDiffChangedFiles', 'changed files')}
                </span>
              </FilesChangedCount>{' '}
              {t('views:commits.commitDetailsDiffWith', 'with')} {formatNumber(diffStats?.additions || 0)}{' '}
              {t('views:commits.commitDetailsDiffAdditionsAnd', 'additions and')}{' '}
              {formatNumber(diffStats?.deletions || 0)} {t('views:commits.commitDetailsDiffDeletions', 'deletions')}
            </p>
            <DropdownMenu.Content className="max-h-[360px]" align="end">
              {diffData?.map(diff => (
                <DropdownMenu.Item
                  key={diff.filePath}
                  onClick={() => {
                    if (diff.filePath) {
                      setJumpToDiff(diff.filePath)
                    }
                  }}
                  title={
                    <>
                      <Text color="foreground-1" truncate>
                        {diff.filePath}
                      </Text>
                      <div className="ml-4 flex items-center space-x-2">
                        {diff.addedLines != null && diff.addedLines > 0 && (
                          <StatusBadge variant="outline" size="sm" theme="success">
                            +{diff.addedLines}
                          </StatusBadge>
                        )}
                        {diff.removedLines != null && diff.removedLines > 0 && (
                          <StatusBadge variant="outline" size="sm" theme="danger">
                            -{diff.removedLines}
                          </StatusBadge>
                        )}
                      </div>
                    </>
                  }
                />
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </ListActions.Left>
        <ListActions.Right>
          <ListActions.Dropdown
            selectedValue={diffMode === DiffModeEnum.Split ? 'Split' : 'Unified'}
            onChange={handleDiffModeChange}
            title={diffMode === DiffModeEnum.Split ? 'Split' : 'Unified'}
            items={DiffModeOptions}
          />
        </ListActions.Right>
      </ListActions.Root>
      <Spacer size={3} />
      <div className="flex flex-col" ref={diffsContainerRef}>
        {diffBlocks?.map((diffsBlock, blockIndex) => {
          return (
            <InViewDiffRenderer
              key={blockIndex}
              blockName={outterBlockName(blockIndex)}
              root={document as unknown as RefObject<Element>}
              shouldRetainChildren={shouldRetainDiffChildren}
              detectionMargin={calculateDetectionMargin(diffData?.length)}
            >
              {diffsBlock?.map((item, index) => (
                <div className="pt-4" key={item.filePath}>
                  <InViewDiffRenderer
                    key={item.filePath}
                    blockName={innerBlockName(item?.filePath ?? (blockIndex + index).toString())}
                    root={diffsContainerRef}
                    shouldRetainChildren={shouldRetainDiffChildren}
                    detectionMargin={IN_VIEWPORT_DETECTION_MARGIN}
                  >
                    <PullRequestAccordion
                      principalProps={principalProps}
                      key={`item?.title ? ${item?.title}-${index} : ${index}`}
                      header={item}
                      currentUser={currentUser}
                      data={item?.data}
                      diffMode={diffMode}
                      openItems={openItems}
                      onToggle={() => toggleOpen(item.text)}
                      setCollapsed={val => setCollapsed(item.text, val)}
                    />
                  </InViewDiffRenderer>
                </div>
              ))}
            </InViewDiffRenderer>
          )
        })}
      </div>
    </>
  )
}

function FilesChangedCount({
  children,
  showAsDropdown = false
}: {
  children: React.ReactNode
  showAsDropdown: boolean
}) {
  return showAsDropdown ? <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger> : <>{children}</>
}

export default PullRequestCompareDiffList
