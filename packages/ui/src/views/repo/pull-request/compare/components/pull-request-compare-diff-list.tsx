import { FC, useCallback, useEffect, useMemo, useState } from 'react'

import {
  Accordion,
  Badge,
  Button,
  CopyButton,
  DropdownMenu,
  Icon,
  Layout,
  ListActions,
  Spacer,
  StackedList,
  Text
} from '@/components'
import { DiffModeOptions, TranslationStore, TypesDiffStats } from '@/views'
import { DiffModeEnum } from '@git-diff-view/react'

import PullRequestDiffViewer from '../../components/pull-request-diff-viewer'
import { useDiffConfig } from '../../hooks/useDiffConfig'
import { parseStartingLineIfOne, PULL_REQUEST_LARGE_DIFF_CHANGES_LIMIT } from '../../utils'
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
    <div className="inline-flex items-center gap-x-6">
      <div className="flex items-center gap-2">
        <Icon name="ellipsis" size={12} />
      </div>
    </div>
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
}

const PullRequestAccordion: FC<PullRequestAccordionProps> = ({
  header,
  diffMode,
  currentUser,
  useTranslationStore,
  openItems,
  onToggle
}) => {
  const { t: _ts } = useTranslationStore()
  const { highlight, wrap, fontsize } = useDiffConfig()
  const startingLine =
    parseStartingLineIfOne(header?.data ?? '') !== null ? parseStartingLineIfOne(header?.data ?? '') : null
  const [showHiddenDiff, setShowHiddenDiff] = useState(false)

  const fileDeleted = useMemo(() => header?.deleted, [header?.deleted])
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
            <Accordion.Content>
              <div className="border-t bg-transparent">
                {(fileDeleted || isDiffTooLarge || fileUnchanged || header?.isBinary) && !showHiddenDiff ? (
                  <Layout.Vertical className="flex w-full items-center py-5">
                    <Button
                      className="text-tertiary-background"
                      variant="secondary"
                      size="md"
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
                      deleted={header?.deleted}
                      unchangedPercentage={header?.unchangedPercentage}
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

interface PullRequestCompareDiffListProps {
  diffStats: TypesDiffStats
  diffData: HeaderProps[]
  currentUser?: string
  useTranslationStore: () => TranslationStore
}

const PullRequestCompareDiffList: FC<PullRequestCompareDiffListProps> = ({
  diffStats,
  diffData,
  currentUser,
  useTranslationStore
}) => {
  const [diffMode, setDiffMode] = useState<DiffModeEnum>(DiffModeEnum.Split)
  const handleDiffModeChange = (value: string) => {
    setDiffMode(value === 'Split' ? DiffModeEnum.Split : DiffModeEnum.Unified)
  }
  const [openItems, setOpenItems] = useState<string[]>([])

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

  return (
    <>
      <ListActions.Root>
        <ListActions.Left>
          <DropdownMenu.Root>
            <p className="text-14 leading-tight text-foreground-4">
              Showing{' '}
              <DropdownMenu.Trigger asChild>
                <span className="cursor-pointer text-foreground-accent ease-in-out">
                  {diffStats.files_changed || 0} changed files
                </span>
              </DropdownMenu.Trigger>{' '}
              with {diffStats.additions || 0} additions and {diffStats.deletions || 0} deletions
            </p>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Group>
                {diffData?.map(diff => (
                  <DropdownMenu.Item
                    key={diff.filePath}
                    onClick={() => {}}
                    className="flex w-80 cursor-pointer items-center justify-between px-3 py-2"
                  >
                    <Text size={1} className="flex-1 overflow-hidden truncate text-primary">
                      {diff.filePath}
                    </Text>
                    <div className="ml-4 flex items-center space-x-2">
                      {diff.addedLines != null && diff.addedLines > 0 && (
                        <Badge variant="outline" size="sm" theme="success">
                          +{diff.addedLines}
                        </Badge>
                      )}
                      {diff.removedLines != null && diff.removedLines > 0 && (
                        <Badge variant="outline" size="sm" theme="destructive">
                          -{diff.removedLines}
                        </Badge>
                      )}
                    </div>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Group>
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
      {diffData?.map((item, index) => (
        <>
          <Spacer size={3} />
          <PullRequestAccordion
            key={`item?.title ? ${item?.title}-${index} : ${index}`}
            header={item}
            currentUser={currentUser}
            data={item?.data}
            diffMode={diffMode}
            useTranslationStore={useTranslationStore}
            openItems={openItems}
            onToggle={() => toggleOpen(item.text)}
          />
        </>
      ))}
    </>
  )
}

export default PullRequestCompareDiffList
