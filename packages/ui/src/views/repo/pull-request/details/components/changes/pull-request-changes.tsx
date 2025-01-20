import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Checkbox,
  CopyButton,
  Icon,
  StackedList,
  Text
} from '@components/index'
import { DiffModeEnum } from '@git-diff-view/react'
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
} from '@views/index'
import PullRequestDiffViewer from '@views/repo/pull-request/components/pull-request-diff-viewer'
import { useDiffConfig } from '@views/repo/pull-request/hooks/useDiffConfig'
import { parseStartingLineIfOne } from '@views/repo/pull-request/utils'

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
        <div
          role="button"
          tabIndex={0}
          onClick={e => {
            e.preventDefault()
          }}
        >
          <Button
            className="text-tertiary-background"
            variant="custom"
            size="icon"
            aria-label="expand diff"
            onClick={() => toggleFullDiff()}
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
  setScrolledToComment
}) => {
  const { highlight, wrap, fontsize } = useDiffConfig()
  const [useFullDiff, setUseFullDiff] = useState(false)
  const diffViewerState = useMemo(() => new Map<string, DiffViewerState>(), [])
  const [rawDiffData, setRawDiffData] = useState(
    useFullDiff ? diffViewerState.get(header.filePath)?.fullRawDiff : header?.data
  )
  // File viewed feature is only enabled if no commit range is provided ie defaultCommitFilter is selected (otherwise component is hidden, too)
  const [showViewedCheckbox, setShowViewedCheckbox] = useState(
    selectedCommits?.[0].value === defaultCommitFilter?.value
  )
  const [viewed, setViewed] = useState(
    selectedCommits?.[0] === defaultCommitFilter &&
      getFileViewedState(header?.filePath, header?.checksumAfter, header?.fileViews) === FileViewedState.VIEWED
    // && !shouldDiffBeShownByDefault
  )
  const startingLine =
    parseStartingLineIfOne(header?.data ?? '') !== null ? parseStartingLineIfOne(header?.data ?? '') : null

  const [openItems, setOpenItems] = useState<string[]>([])

  useEffect(() => {
    setRawDiffData(useFullDiff ? diffViewerState.get(header.filePath)?.fullRawDiff : header?.data)
  }, [useFullDiff, diffViewerState, header?.filePath, header?.data])

  const toggleFullDiff = useCallback(() => {
    if (!useFullDiff && !diffViewerState.get(header.filePath)?.fullRawDiff) {
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
    diffViewerState.set(header.filePath, {
      ...diffViewerState.get(header.filePath),
      useFullDiff: !useFullDiff
    })
    setUseFullDiff(prev => !prev)
  }, [diffViewerState, header?.filePath, onGetFullDiff, useFullDiff])

  const setCollapsed = (val: boolean) => {
    setOpenItems(curr => {
      if (val) {
        // close
        return curr.filter(item => item !== header.text)
      } else {
        // open
        return curr.includes(header.text) ? curr : [...curr, header.text]
      }
    })
  }

  // On mount or if `autoExpand` becomes true, ensure this item is expanded
  useEffect(() => {
    if (autoExpand) {
      setOpenItems(curr => (curr.includes(header.text) ? curr : [...curr, header.text]))
    }
  }, [autoExpand, header.text])

  useEffect(() => {
    if (selectedCommits?.[0].value === defaultCommitFilter?.value) {
      setViewed(
        getFileViewedState(header?.filePath, header?.checksumAfter, header?.fileViews) === FileViewedState.VIEWED
      )
      setShowViewedCheckbox(true)
    }
  }, [setViewed, header?.fileViews, header?.filePath, header?.checksumAfter, selectedCommits, defaultCommitFilter])

  return (
    <StackedList.Root>
      <StackedList.Item disableHover isHeader className="cursor-default p-0 hover:bg-transparent">
        <Accordion
          type="multiple"
          className="w-full"
          value={openItems}
          onValueChange={val => setOpenItems(val as string[])}
        >
          <AccordionItem isLast value={header?.text ?? ''}>
            <AccordionTrigger leftChevron className="p-4 text-left">
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
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex w-full border-t">
                <div className="bg-transparent">
                  {startingLine ? (
                    <div className="bg-[--diff-hunk-lineNumber--]">
                      <div className="ml-16 w-full px-2 py-1 font-mono">{startingLine}</div>
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
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
  const [autoExpandFiles, setAutoExpandFiles] = useState<{ [fileText: string]: boolean }>({})

  // On mount (or commentId change), find which file (or files) contain that commentId and mark them to auto-expand
  useEffect(() => {
    if (!commentId) return
    const newMap: { [fileText: string]: boolean } = {}

    data.forEach(item => {
      const fileComments =
        comments?.filter((thread: CommentItem<TypesPullReqActivity>[]) =>
          thread.some(
            (comment: CommentItem<TypesPullReqActivity>) => comment.payload?.payload?.code_comment?.path === item.text
          )
        ) || []
      const found = fileComments.some(thread => thread.some(c => String(c.id) === commentId))
      if (found) {
        newMap[item.text] = true
      }
    })
    setAutoExpandFiles(newMap)
  }, [commentId, data, comments])

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
            autoExpand={!!autoExpandFiles[item.text]}
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
          />
        )
      })}
    </div>
  )
}
