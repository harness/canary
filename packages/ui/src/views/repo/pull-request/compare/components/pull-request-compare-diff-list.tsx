import { FC, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  Accordion,
  Badge,
  Button,
  CopyButton,
  DropdownMenu,
  Layout,
  ListActions,
  Spacer,
  StackedList,
  Text
} from '@/components'
import { DiffModeOptions, InViewDiffRenderer, jumpToFile, TranslationStore, TypesDiffStats } from '@/views'
import { DiffModeEnum } from '@git-diff-view/react'
import { formatNumber } from '@utils/utils'
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
      <p className="font-medium">{text}</p>
      <CopyButton name={text} />
    </div>
    {/* <div className="inline-flex items-center gap-x-6">
      <div className="flex items-center gap-2">
        <Icon name="ellipsis" size={12} />
      </div>
    </div> */}
  </div>
)

interface PullRequestAccordionProps {
  header?: HeaderProps
  data?: string
  diffMode: DiffModeEnum
  currentUser?: string
  useTranslationStore: () => TranslationStore
  openItems: string[]
  onToggle: () => void
  setCollapsed: (val: boolean) => void
}

const PullRequestAccordion: FC<PullRequestAccordionProps> = ({
  header,
  diffMode,
  currentUser,
  useTranslationStore,
  openItems,
  onToggle,
  setCollapsed
}) => {
  const { t: _ts } = useTranslationStore()
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
        <Accordion.Root type="multiple" className="w-full" value={openItems} onValueChange={onToggle}>
          <Accordion.Item isLast value={header?.text ?? ''}>
            <Accordion.Trigger leftChevron className="p-4 text-left">
              <StackedList.Field title={<LineTitle text={header?.text ?? ''} />} />
            </Accordion.Trigger>
            <Accordion.Content className="pb-0">
              <div className="border-t bg-transparent">
                {(fileDeleted || isDiffTooLarge || fileUnchanged || header?.isBinary) && !showHiddenDiff ? (
                  <Layout.Vertical gap="space-y-0" className="flex w-full items-center py-5">
                    <Button
                      className="text-cn-foreground-accent"
                      variant="link_accent"
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
                    {startingLine && (
                      <div className="bg-[--diff-hunk-lineNumber--]">
                        <div className="ml-16 w-full px-2 py-1">{startingLine}</div>
                      </div>
                    )}
                    <PullRequestDiffViewer
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
                      useTranslationStore={useTranslationStore}
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
  useTranslationStore: () => TranslationStore
  jumpToDiff?: string
  setJumpToDiff: (fileName: string) => void
}

const PullRequestCompareDiffList: FC<PullRequestCompareDiffListProps> = ({
  diffStats,
  diffData,
  currentUser,
  useTranslationStore,
  jumpToDiff,
  setJumpToDiff
}) => {
  const { t } = useTranslationStore()
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
            <p className="text-14 leading-tight text-cn-foreground-2">
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
            <DropdownMenu.Content align="end">
              <div className="max-h-[360px] overflow-y-auto px-1">
                {diffData?.map(diff => (
                  <DropdownMenu.Item
                    key={diff.filePath}
                    onClick={() => {
                      if (diff.filePath) {
                        setJumpToDiff(diff.filePath)
                      }
                    }}
                    className="flex w-80 cursor-pointer items-center justify-between px-3 py-2"
                  >
                    <Text size={1} className="flex-1 overflow-hidden truncate text-primary">
                      {diff.filePath}
                    </Text>
                    <div className="ml-4 flex items-center space-x-2">
                      {diff.addedLines != null && diff.addedLines > 0 && (
                        <Badge variant="surface" size="sm" theme="success">
                          +{diff.addedLines}
                        </Badge>
                      )}
                      {diff.removedLines != null && diff.removedLines > 0 && (
                        <Badge variant="surface" size="sm" theme="danger">
                          -{diff.removedLines}
                        </Badge>
                      )}
                    </div>
                  </DropdownMenu.Item>
                ))}
              </div>
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
                      key={`item?.title ? ${item?.title}-${index} : ${index}`}
                      header={item}
                      currentUser={currentUser}
                      data={item?.data}
                      diffMode={diffMode}
                      useTranslationStore={useTranslationStore}
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
