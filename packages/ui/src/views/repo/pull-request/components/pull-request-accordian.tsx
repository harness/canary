import { useCallback, useEffect, useMemo, useState } from 'react'

import { Accordion, Button, Checkbox, CopyButton, CounterBadge, IconV2, Layout, Link, Tag, Text } from '@/components'
import { useTranslation } from '@/context'
import {
  CommentItem,
  CommitFilterItemProps,
  CommitSuggestion,
  DiffFileEntry,
  DiffViewerState,
  FileViewedState,
  getFileViewedState,
  HandleUploadType,
  PrincipalPropsType,
  TypesPullReq,
  TypesPullReqActivity
} from '@/views'
import { DiffModeEnum } from '@git-diff-view/react'
import PullRequestDiffViewer from '@views/repo/pull-request/components/pull-request-diff-viewer'
import { FILE_VIEWED_OBSOLETE_SHA } from '@views/repo/pull-request/details/pull-request-utils'
import { useDiffConfig } from '@views/repo/pull-request/hooks/useDiffConfig'
import { parseStartingLineIfOne, PULL_REQUEST_LARGE_DIFF_CHANGES_LIMIT } from '@views/repo/pull-request/utils'

export interface HeaderProps {
  text: string
  addedLines?: number
  deletedLines?: number
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
  isRename?: boolean
  oldName?: string
  newName?: string
}

interface DataProps {
  data: HeaderProps[]
  diffMode: DiffModeEnum
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
  handleUpload?: HandleUploadType
  onGetFullDiff: (path?: string) => Promise<string | void>
  scrolledToComment?: boolean
  setScrolledToComment?: (val: boolean) => void
  jumpToDiff?: string
  setJumpToDiff: (filePath: string) => void
  toRepoFileDetails?: ({ path }: { path: string }) => string
  pullReqMetadata?: TypesPullReq
  principalProps: PrincipalPropsType
}

interface LineTitleProps {
  header: HeaderProps
  viewed: boolean
  setViewed: (val: boolean) => void
  showViewed: boolean
  markViewed: (filePath: string, checksumAfter: string) => void
  unmarkViewed: (filePath: string) => void
  setCollapsed: (val: boolean) => void
  toggleFullDiff: () => void
  useFullDiff?: boolean
  toRepoFileDetails?: ({ path }: { path: string }) => string
  sourceBranch?: string
  currentRefForDiff?: string
}

export const LineTitle: React.FC<LineTitleProps> = ({
  header,
  viewed,
  setViewed,
  showViewed,
  markViewed,
  unmarkViewed,
  setCollapsed,
  toggleFullDiff,
  useFullDiff,
  toRepoFileDetails,
  sourceBranch,
  currentRefForDiff
}) => {
  const { t } = useTranslation()
  const { text, addedLines, deletedLines, filePath, checksumAfter, fileViews, isRename, oldName, newName } = header

  // Determine the display text and link path for renamed files
  const displayText = isRename ? `${oldName} → ${newName}` : text
  const linkPath = isRename ? newName : filePath
  const copyText = isRename ? newName || text : text

  return (
    <div className="flex items-center justify-between gap-x-3">
      <div className="inline-flex items-center gap-x-4">
        <div className="flex items-center gap-x-2">
          <Button
            variant="ghost"
            size="sm"
            aria-label="expand diff"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              toggleFullDiff()
            }}
          >
            <IconV2 name={useFullDiff ? 'collapse-code' : 'expand-code'} />
          </Button>
          <Link
            to={toRepoFileDetails?.({ path: `files/${currentRefForDiff || sourceBranch}/~/${linkPath}` }) ?? ''}
            className="font-medium leading-tight text-cn-foreground-1"
          >
            {displayText}
          </Link>
          <CopyButton name={copyText} size="xs" color="gray" />
        </div>

        <div className="flex items-center gap-x-1">
          {addedLines != null && addedLines > 0 && <CounterBadge theme="success">+{addedLines}</CounterBadge>}
          {deletedLines != null && deletedLines > 0 && <CounterBadge theme="danger">-{deletedLines}</CounterBadge>}
        </div>
      </div>
      <div className="inline-flex items-center gap-x-2">
        {/* Show "Changed since last viewed" tag when file is obsolete */}
        {fileViews?.get(filePath) === FILE_VIEWED_OBSOLETE_SHA && (
          <Tag value={t('views:pullRequests.changedSinceLastView')} theme="orange" />
        )}
        {showViewed ? (
          <Button variant="ghost" size="sm" className="gap-x-2.5 px-2.5 py-1.5" onClick={e => e.stopPropagation()}>
            <Checkbox
              checked={viewed}
              onCheckedChange={checked => {
                setViewed(checked === true)
                if (checked) {
                  setCollapsed(true)
                  markViewed(filePath, checksumAfter ?? 'unknown')
                } else {
                  setCollapsed(false)
                  unmarkViewed(filePath)
                }
              }}
              label={t('views:pullRequests.markViewed')}
            />
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export const PullRequestAccordion: React.FC<{
  header: HeaderProps
  diffMode: DiffModeEnum
  currentUser?: string
  comments?: CommentItem<TypesPullReqActivity>[][]
  handleSaveComment?: (comment: string, parentId?: number) => Promise<void>
  deleteComment?: (id: number) => Promise<void>
  updateComment?: (id: number, comment: string) => Promise<void>
  defaultCommitFilter?: CommitFilterItemProps
  selectedCommits?: CommitFilterItemProps[]
  markViewed?: (filePath: string, checksumAfter: string) => void
  unmarkViewed?: (filePath: string) => void
  autoExpand?: boolean
  onCopyClick?: (commentId?: number) => void
  onCommentSaveAndStatusChange?: (comment: string, status: string, parentId?: number) => void
  suggestionsBatch?: CommitSuggestion[]
  onCommitSuggestion?: (suggestion: CommitSuggestion) => void
  addSuggestionToBatch?: (suggestion: CommitSuggestion) => void
  removeSuggestionFromBatch?: (commentId: number) => void
  filenameToLanguage?: (fileName: string) => string | undefined
  toggleConversationStatus?: (status: string, parentId?: number) => void
  handleUpload?: DataProps['handleUpload']
  onGetFullDiff?: (path?: string) => Promise<string | void>
  scrolledToComment?: boolean
  setScrolledToComment?: (val: boolean) => void
  openItems: string[]
  isOpen?: boolean
  onToggle: () => void
  setCollapsed: (val: boolean) => void
  toRepoFileDetails?: ({ path }: { path: string }) => string
  sourceBranch?: string
  principalProps: PrincipalPropsType
  hideViewedCheckbox?: boolean
  addWidget?: boolean
  currentRefForDiff?: string
}> = ({
  header,
  diffMode,
  currentUser,
  comments,
  handleSaveComment,
  deleteComment,
  updateComment,
  defaultCommitFilter,
  selectedCommits,
  markViewed,
  unmarkViewed,
  autoExpand,
  onCopyClick,
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
  setCollapsed,
  toRepoFileDetails,
  sourceBranch,
  principalProps,
  hideViewedCheckbox = false,
  addWidget = true,
  currentRefForDiff
}) => {
  const { t: _ts } = useTranslation()
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
        onGetFullDiff?.(header.filePath).then(rawDiff => {
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
    <Accordion.Root
      type="multiple"
      className="w-full"
      value={openItems}
      onValueChange={onToggle}
      indicatorPosition="left"
    >
      <Accordion.Item value={header?.text ?? ''} className="rounded-3 border-none">
        <Accordion.Trigger
          className="rounded-t-3 bg-cn-background-2 px-4 py-2 [&>.cn-accordion-trigger-indicator]:m-0 [&>.cn-accordion-trigger-indicator]:self-center"
          headerClassName="z-[18] sticky top-[107px] border-cn-borders-2 border rounded-t-3"
        >
          <LineTitle
            header={header}
            viewed={viewed}
            setViewed={setViewed}
            showViewed={showViewedCheckbox && !hideViewedCheckbox}
            markViewed={markViewed ?? (() => {})}
            unmarkViewed={unmarkViewed ?? (() => {})}
            setCollapsed={setCollapsed}
            toggleFullDiff={toggleFullDiff}
            useFullDiff={useFullDiff}
            toRepoFileDetails={toRepoFileDetails}
            sourceBranch={sourceBranch}
            currentRefForDiff={currentRefForDiff}
          />
        </Accordion.Trigger>
        <Accordion.Content className="pb-0" containerClassName="rounded-b-3 border-x border-b border-cn-borders-2">
          <div className="bg-transparent">
            {(fileDeleted || isDiffTooLarge || fileUnchanged || header?.isBinary) && !showHiddenDiff ? (
              <Layout.Vertical align="center" className="py-5">
                <Button
                  className="text-cn-foreground-accent"
                  variant="link"
                  size="sm"
                  aria-label="show diff"
                  onClick={() => setShowHiddenDiff(true)}
                >
                  {_ts('views:pullRequests.showDiff')}
                </Button>
                <Text variant="body-strong">
                  {fileDeleted
                    ? _ts('views:pullRequests.deletedFileDiff')
                    : isDiffTooLarge
                      ? _ts('views:pullRequests.largeDiff')
                      : header?.isBinary
                        ? _ts('views:pullRequests.binaryNotShown')
                        : _ts('views:pullRequests.fileNoChanges')}
                </Text>
              </Layout.Vertical>
            ) : (
              <>
                {startingLine ? (
                  <div className="bg-[--diff-hunk-lineNumber--]">
                    <div className="ml-16 w-full px-2 py-1">{startingLine}</div>
                  </div>
                ) : null}
                <PullRequestDiffViewer
                  principalProps={principalProps}
                  handleUpload={handleUpload}
                  blocks={header.diffData.blocks}
                  data={rawDiffData}
                  fontsize={fontsize}
                  highlight={highlight}
                  mode={diffMode}
                  wrap={wrap}
                  addWidget={addWidget}
                  fileName={header?.title ?? ''}
                  lang={header?.lang ?? ''}
                  currentUser={currentUser}
                  comments={comments}
                  handleSaveComment={handleSaveComment}
                  deleteComment={deleteComment}
                  updateComment={updateComment}
                  onCopyClick={onCopyClick}
                  onCommitSuggestion={onCommitSuggestion}
                  addSuggestionToBatch={addSuggestionToBatch}
                  suggestionsBatch={suggestionsBatch}
                  removeSuggestionFromBatch={removeSuggestionFromBatch}
                  filenameToLanguage={filenameToLanguage}
                  toggleConversationStatus={toggleConversationStatus}
                  scrolledToComment={scrolledToComment}
                  setScrolledToComment={setScrolledToComment}
                  collapseDiff={() => setCollapsed(true)}
                />
              </>
            )}
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}
