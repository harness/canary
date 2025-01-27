import { useCallback, useEffect, useMemo, useState } from 'react'

import { Accordion, Badge, Button, Checkbox, CopyButton, Icon, Layout, StackedList, Text } from '@/components'
import {
  CommentItem,
  CommitFilterItemProps,
  CommitSuggestion,
  DiffFileEntry,
  DiffViewerState,
  FileViewedState,
  getFileViewedState,
  TranslationStore,
  TypesPullReqActivity
} from '@/views'
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
  diffData: DiffFileEntry
  isDeleted: boolean
  unchangedPercentage?: number
  isBinary?: boolean
}

interface LineTitleProps {
  useTranslationStore: () => TranslationStore
  header: HeaderProps
  viewed: boolean
  setViewed: (val: boolean) => void
  showViewed: boolean
  markViewed: (filePath: string, checksumAfter: string) => void
  unmarkViewed: (filePath: string) => void
  setCollapsed: (val: boolean) => void
  toggleFullDiff: () => void
  useFullDiff?: boolean
}

interface DataProps {
  data: HeaderProps[]
  diffMode: DiffModeEnum
  useTranslationStore: () => TranslationStore
  currentUser?: string
  comments: CommentItem<TypesPullReqActivity>[][]
  handleSaveComment: (comment: string, parentId?: number) => void
  deleteComment: (id: number) => void
  updateComment: (id: number, comment: string) => void
  defaultCommitFilter: CommitFilterItemProps
  selectedCommits: CommitFilterItemProps[]
  markViewed: (filePath: string, checksumAfter: string) => void
  unmarkViewed: (filePath: string) => void
  commentId?: string
  onCopyClick?: (commentId?: number) => void
  onCommentSaveAndStatusChange?: (comment: string, status: string, parentId?: number) => void
  suggestionsBatch: CommitSuggestion[]
  onCommitSuggestion: (suggestion: CommitSuggestion) => void
  addSuggestionToBatch: (suggestion: CommitSuggestion) => void
  removeSuggestionFromBatch: (commentId: number) => void
  filenameToLanguage: (fileName: string) => string | undefined
  toggleConversationStatus: (status: string, parentId?: number) => void
  handleUpload?: (blob: File, setMarkdownContent: (data: string) => void) => void
  onGetFullDiff: (path?: string) => Promise<string | void>
  scrolledToComment?: boolean
  setScrolledToComment?: (val: boolean) => void
}

const LineTitle: React.FC<LineTitleProps> = ({
  header,
  useTranslationStore,
  viewed,
  setViewed,
  showViewed,
  markViewed,
  unmarkViewed,
  setCollapsed,
  toggleFullDiff,
  useFullDiff
}) => {
  const { t } = useTranslationStore()
  const { text, numAdditions, numDeletions, filePath, checksumAfter } = header
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="inline-flex items-center gap-2">
        <Text weight="medium">{text}</Text>
        <div
          role="button"
          tabIndex={0}
          onClick={e => {
            e.preventDefault()
          }}
        >
          <CopyButton name={text} className="text-tertiary-background" />
        </div>
        <div role="button" tabIndex={0}>
          <Button
            className="text-tertiary-background"
            variant="custom"
            size="icon"
            aria-label="expand diff"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              toggleFullDiff()
            }}
          >
            <Icon name={useFullDiff ? 'collapse-diff' : 'expand-diff'} size={16} />
          </Button>
        </div>
        {numAdditions != null && numAdditions > 0 && (
          <Badge variant="outline" size="sm" theme="success">
            +{numAdditions}
          </Badge>
        )}
        {numDeletions != null && numDeletions > 0 && (
          <Badge variant="outline" size="sm" theme="destructive">
            -{numDeletions}
          </Badge>
        )}
      </div>
      <div className="inline-flex items-center gap-x-6">
        {showViewed ? (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={viewed}
              onClick={e => {
                e.stopPropagation()
                if (viewed) {
                  setViewed(false)
                  setCollapsed(false)
                  unmarkViewed(filePath)
                } else {
                  setViewed(true)
                  setCollapsed(true)
                  markViewed(filePath, checksumAfter ?? 'unknown')
                }
              }}
              className="size-4"
            />
            <Text size={2} className="text-primary/90">
              {t('views:pullRequests.viewed')}
            </Text>
          </div>
        ) : null}

        {/* <Button title="coming soon" variant="ghost" size="sm">
        <Icon name="ellipsis" size={12} className="text-primary-muted/40" />
      </Button> */}
      </div>
    </div>
  )
}

const PullRequestAccordion: React.FC<{
  header: HeaderProps
  data?: string
  diffMode: DiffModeEnum
  useTranslationStore: () => TranslationStore
  currentUser?: string
  comments: CommentItem<TypesPullReqActivity>[][]
  handleSaveComment: (comment: string, parentId?: number) => void
  deleteComment: (id: number) => void
  updateComment: (id: number, comment: string) => void
  defaultCommitFilter: CommitFilterItemProps
  selectedCommits: CommitFilterItemProps[]
  markViewed: (filePath: string, checksumAfter: string) => void
  unmarkViewed: (filePath: string) => void
  commentId?: string
  autoExpand?: boolean
  onCopyClick?: (commentId?: number) => void
  onCommentSaveAndStatusChange?: (comment: string, status: string, parentId?: number) => void
  suggestionsBatch: CommitSuggestion[]
  onCommitSuggestion: (suggestion: CommitSuggestion) => void
  addSuggestionToBatch: (suggestion: CommitSuggestion) => void
  removeSuggestionFromBatch: (commentId: number) => void
  filenameToLanguage: (fileName: string) => string | undefined
  toggleConversationStatus: (status: string, parentId?: number) => void
  handleUpload?: (blob: File, setMarkdownContent: (data: string) => void) => void
  onGetFullDiff: (path?: string) => Promise<string | void>
  scrolledToComment?: boolean
  setScrolledToComment?: (val: boolean) => void
  openItems: string[]
  isOpen: boolean
  onToggle: () => void
  setCollapsed: (val: boolean) => void
}> = ({
  header,
  diffMode,
  useTranslationStore,
  currentUser,
  comments,
  handleSaveComment,
  deleteComment,
  updateComment,
  defaultCommitFilter,
  selectedCommits,
  markViewed,
  unmarkViewed,
  commentId,
  autoExpand,
  onCopyClick,
  onCommentSaveAndStatusChange,
  suggestionsBatch,
  onCommitSuggestion,
  addSuggestionToBatch,
  removeSuggestionFromBatch,
  filenameToLanguage,
  toggleConversationStatus,
  handleUpload,
  onGetFullDiff,
  scrolledToComment,
  setScrolledToComment,
  openItems,
  isOpen,
  onToggle,
  setCollapsed
}) => {
  const { t: _ts } = useTranslationStore()
  const { highlight, wrap, fontsize } = useDiffConfig()
  const [useFullDiff, setUseFullDiff] = useState(false)
  const diffViewerState = useMemo(() => new Map<string, DiffViewerState>(), [])
  const [rawDiffData, setRawDiffData] = useState(
    useFullDiff ? diffViewerState.get(header.filePath)?.fullRawDiff : header?.data
  )
  const [showHiddenDiff, setShowHiddenDiff] = useState(false)
  const fileDeleted = useMemo(() => header.isDeleted, [header.isDeleted])
  const isDiffTooLarge = useMemo(
    () => header.diffData.addedLines + header.diffData.deletedLines > PULL_REQUEST_LARGE_DIFF_CHANGES_LIMIT,
    [header.diffData.addedLines, header.diffData.deletedLines]
  )
  const fileUnchanged = useMemo(
    () =>
      header?.diffData?.unchangedPercentage === 100 ||
      (header?.diffData?.addedLines === 0 && header?.diffData?.deletedLines === 0),
    [header?.diffData?.addedLines, header?.diffData?.deletedLines, header?.diffData?.unchangedPercentage]
  )
  // File viewed feature is only enabled if no commit range is provided ie defaultCommitFilter is selected (otherwise component is hidden, too)
  const [showViewedCheckbox, setShowViewedCheckbox] = useState(
    selectedCommits?.[0].value === defaultCommitFilter?.value
  )
  const [viewed, setViewed] = useState(
    selectedCommits?.[0] === defaultCommitFilter &&
      getFileViewedState(header?.filePath, header?.checksumAfter, header?.fileViews) === FileViewedState.VIEWED
  )
  const startingLine =
    parseStartingLineIfOne(header?.data ?? '') !== null ? parseStartingLineIfOne(header?.data ?? '') : null

  useEffect(() => {
    setRawDiffData(useFullDiff ? diffViewerState.get(header.filePath)?.fullRawDiff : header?.data)
  }, [useFullDiff, diffViewerState, header?.filePath, header?.data])

  useEffect(() => {
    if (autoExpand && !isOpen) {
      onToggle()
    }
  }, [autoExpand, isOpen, onToggle])

  const toggleFullDiff = useCallback(() => {
    if (!useFullDiff) {
      // fetch the full diff if not already
      if (!diffViewerState.get(header.filePath)?.fullRawDiff) {
        onGetFullDiff(header.filePath).then(rawDiff => {
          if (rawDiff && typeof rawDiff === 'string') {
            diffViewerState.set(header.filePath, {
              ...diffViewerState.get(header.filePath),
              fullRawDiff: rawDiff
            })
            setRawDiffData(rawDiff)
          }
        })
      }
      if (!isOpen) {
        setCollapsed(false)
      }
      if (fileDeleted || isDiffTooLarge || header?.isBinary || fileUnchanged) {
        setShowHiddenDiff(true)
      }
    }
    diffViewerState.set(header.filePath, {
      ...diffViewerState.get(header.filePath),
      useFullDiff: !useFullDiff
    })
    setUseFullDiff(prev => !prev)
  }, [
    useFullDiff,
    onGetFullDiff,
    diffViewerState,
    header.filePath,
    setCollapsed,
    header?.isBinary,
    fileDeleted,
    isDiffTooLarge,
    fileUnchanged,
    isOpen
  ])

  // If commits change, check if "viewed" should be updated
  useEffect(() => {
    if (selectedCommits?.[0].value === defaultCommitFilter?.value) {
      setViewed(getFileViewedState(header.filePath, header.checksumAfter, header.fileViews) === FileViewedState.VIEWED)
      setShowViewedCheckbox(true)
    } else {
      setShowViewedCheckbox(false)
    }
  }, [selectedCommits, defaultCommitFilter, header.filePath, header.checksumAfter, header.fileViews])

  return (
    <StackedList.Root>
      <StackedList.Item disableHover isHeader className="cursor-default p-0 hover:bg-transparent">
        <Accordion.Root type="multiple" className="w-full" value={openItems} onValueChange={onToggle}>
          <Accordion.Item isLast value={header?.text ?? ''}>
            <Accordion.Trigger leftChevron className="p-4 text-left">
              <StackedList.Field
                title={
                  <LineTitle
                    useTranslationStore={useTranslationStore}
                    header={header}
                    viewed={viewed}
                    setViewed={setViewed}
                    showViewed={showViewedCheckbox}
                    markViewed={markViewed}
                    unmarkViewed={unmarkViewed}
                    setCollapsed={setCollapsed}
                    toggleFullDiff={toggleFullDiff}
                    useFullDiff={useFullDiff}
                  />
                }
              />
            </Accordion.Trigger>
            <Accordion.Content>
              <div className="border-t bg-transparent">
                {(fileDeleted || isDiffTooLarge || fileUnchanged || header?.isBinary) && !showHiddenDiff ? (
                  <Layout.Vertical gap="space-y-0" className="items-center py-5">
                    <Button
                      className="text-foreground-accent"
                      variant="link_accent"
                      size="sm"
                      aria-label="show diff"
                      onClick={() => setShowHiddenDiff(true)}
                    >
                      {_ts('views:pullRequests.showDiff')}
                    </Button>
                    <p className="font-medium">
                      {fileDeleted
                        ? _ts('views:pullRequests.deletedFileDiff')
                        : isDiffTooLarge
                          ? _ts('views:pullRequests.largeDiff')
                          : header?.isBinary
                            ? _ts('views:pullRequests.binaryNotShown')
                            : _ts('views:pullRequests.fileNoChanges')}
                    </p>
                  </Layout.Vertical>
                ) : (
                  <>
                    {startingLine ? (
                      <div className="bg-[--diff-hunk-lineNumber--]">
                        <div className="ml-16 w-full px-2 py-1">{startingLine}</div>
                      </div>
                    ) : null}
                    <PullRequestDiffViewer
                      handleUpload={handleUpload}
                      data={rawDiffData}
                      fontsize={fontsize}
                      highlight={highlight}
                      mode={diffMode}
                      wrap={wrap}
                      addWidget
                      fileName={header?.title ?? ''}
                      lang={header?.lang ?? ''}
                      currentUser={currentUser}
                      comments={comments}
                      handleSaveComment={handleSaveComment}
                      deleteComment={deleteComment}
                      updateComment={updateComment}
                      useTranslationStore={useTranslationStore}
                      commentId={commentId}
                      onCopyClick={onCopyClick}
                      onCommentSaveAndStatusChange={onCommentSaveAndStatusChange}
                      onCommitSuggestion={onCommitSuggestion}
                      addSuggestionToBatch={addSuggestionToBatch}
                      suggestionsBatch={suggestionsBatch}
                      removeSuggestionFromBatch={removeSuggestionFromBatch}
                      filenameToLanguage={filenameToLanguage}
                      toggleConversationStatus={toggleConversationStatus}
                      scrolledToComment={scrolledToComment}
                      setScrolledToComment={setScrolledToComment}
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

export function PullRequestChanges({
  data,
  diffMode,
  useTranslationStore,
  currentUser,
  comments,
  handleSaveComment,
  deleteComment,
  updateComment,
  defaultCommitFilter,
  selectedCommits,
  markViewed,
  unmarkViewed,
  commentId,
  onCopyClick,
  onCommentSaveAndStatusChange,
  suggestionsBatch,
  onCommitSuggestion,
  addSuggestionToBatch,
  removeSuggestionFromBatch,
  filenameToLanguage,
  toggleConversationStatus,
  handleUpload,
  onGetFullDiff,
  scrolledToComment,
  setScrolledToComment
}: DataProps) {
  const [openItems, setOpenItems] = useState<string[]>([])

  useEffect(() => {
    if (data.length > 0) {
      const itemsToOpen: string[] = []
      data.map(diffItem => {
        const fileComments =
          comments?.filter((thread: CommentItem<TypesPullReqActivity>[]) =>
            thread.some(
              (comment: CommentItem<TypesPullReqActivity>) =>
                comment.payload?.payload?.code_comment?.path === diffItem.text
            )
          ) || []
        const found = fileComments.some(thread => thread.some(comment => String(comment.id) === commentId))
        if (commentId && found) {
          itemsToOpen.push(diffItem.text)
        } else {
          const isFileViewed =
            getFileViewedState(diffItem?.filePath, diffItem?.checksumAfter, diffItem?.fileViews) ===
            FileViewedState.VIEWED
          if (!isFileViewed) {
            itemsToOpen.push(diffItem.text)
          }
        }
      })
      setOpenItems(itemsToOpen)
    }
  }, [data, commentId, setOpenItems])

  const isOpen = useCallback(
    (fileText: string) => {
      return openItems.includes(fileText)
    },
    [openItems]
  )
  const toggleOpen = useCallback(
    (fileText: string) => {
      setOpenItems(curr => (curr.includes(fileText) ? curr.filter(t => t !== fileText) : [...curr, fileText]))
    },
    [setOpenItems]
  )

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

  return (
    <div className="flex flex-col gap-4">
      {data.map((item, index) => {
        // Filter activityBlocks that are relevant for this file
        const fileComments =
          comments?.filter((thread: CommentItem<TypesPullReqActivity>[]) =>
            thread.some(
              (comment: CommentItem<TypesPullReqActivity>) => comment.payload?.payload?.code_comment?.path === item.text
            )
          ) || []

        return (
          <PullRequestAccordion
            handleUpload={handleUpload}
            key={`${item.title}-${index}`}
            header={item}
            diffMode={diffMode}
            useTranslationStore={useTranslationStore}
            currentUser={currentUser}
            comments={fileComments}
            handleSaveComment={handleSaveComment}
            deleteComment={deleteComment}
            updateComment={updateComment}
            defaultCommitFilter={defaultCommitFilter}
            selectedCommits={selectedCommits}
            markViewed={markViewed}
            unmarkViewed={unmarkViewed}
            commentId={commentId}
            autoExpand={openItems.includes(item.text)}
            onCopyClick={onCopyClick}
            onCommentSaveAndStatusChange={onCommentSaveAndStatusChange}
            onCommitSuggestion={onCommitSuggestion}
            addSuggestionToBatch={addSuggestionToBatch}
            suggestionsBatch={suggestionsBatch}
            removeSuggestionFromBatch={removeSuggestionFromBatch}
            filenameToLanguage={filenameToLanguage}
            toggleConversationStatus={toggleConversationStatus}
            onGetFullDiff={onGetFullDiff}
            scrolledToComment={scrolledToComment}
            setScrolledToComment={setScrolledToComment}
            openItems={openItems}
            isOpen={isOpen(item.text)}
            onToggle={() => toggleOpen(item.text)}
            setCollapsed={val => setCollapsed(item.text, val)}
          />
        )
      })}
    </div>
  )
}
