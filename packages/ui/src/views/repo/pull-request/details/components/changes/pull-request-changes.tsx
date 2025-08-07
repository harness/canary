import { memo, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  CommentItem,
  CommitFilterItemProps,
  CommitSuggestion,
  FileViewedState,
  getFileViewedState,
  HandleUploadType,
  InViewDiffRenderer,
  jumpToFile,
  PrincipalPropsType,
  TypesPullReq,
  TypesPullReqActivity
} from '@/views'
import { DiffModeEnum } from '@git-diff-view/react'
import { HeaderProps, PullRequestAccordion } from '@views/repo/pull-request/components/pull-request-accordian'
import {
  calculateDetectionMargin,
  IN_VIEWPORT_DETECTION_MARGIN,
  innerBlockName,
  outterBlockName,
  PULL_REQUEST_DIFF_RENDERING_BLOCK_SIZE,
  shouldRetainDiffChildren
} from '@views/repo/pull-request/utils'
import { chunk } from 'lodash-es'

interface DataProps {
  data: HeaderProps[]
  diffMode: DiffModeEnum
  currentUser?: string
  comments: CommentItem<TypesPullReqActivity>[][]
  handleSaveComment: (comment: string, parentId?: number) => Promise<void>
  deleteComment: (id: number) => Promise<void>
  updateComment: (id: number, comment: string) => Promise<void>
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

function PullRequestChangesInternal({
  data,
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
  setScrolledToComment,
  jumpToDiff,
  setJumpToDiff,
  toRepoFileDetails,
  pullReqMetadata,
  principalProps
}: DataProps) {
  const [openItems, setOpenItems] = useState<string[]>([])
  const diffBlocks = useMemo(() => chunk(data, PULL_REQUEST_DIFF_RENDERING_BLOCK_SIZE), [data])
  const diffsContainerRef = useRef<HTMLDivElement | null>(null)

  const getFileComments = (diffItem: HeaderProps) => {
    return (
      comments?.filter((thread: CommentItem<TypesPullReqActivity>[]) =>
        thread.some(
          (comment: CommentItem<TypesPullReqActivity>) => comment.payload?.payload?.code_comment?.path === diffItem.text
        )
      ) || []
    )
  }

  useEffect(() => {
    if (data.length > 0) {
      const itemsToOpen: string[] = []
      data.map(diffItem => {
        const fileComments = getFileComments(diffItem)
        const diffHasComment = fileComments.some(thread => thread.some(comment => String(comment.id) === commentId))
        if (commentId && diffHasComment) {
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
  }, [data, commentId, comments, setOpenItems])

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

  useEffect(() => {
    if (jumpToDiff) {
      jumpToFile(jumpToDiff, diffBlocks, setJumpToDiff, undefined, diffsContainerRef)
    }
    if (commentId) {
      data.map(diffItem => {
        const fileComments = getFileComments(diffItem)
        const diffHasComment = fileComments.some(thread => thread.some(comment => String(comment.id) === commentId))
        if (commentId && diffHasComment) {
          jumpToFile(diffItem.text, diffBlocks, setJumpToDiff, commentId, diffsContainerRef)
        }
      })
    }
  }, [jumpToDiff, diffBlocks, setJumpToDiff, commentId])

  return (
    <div className="flex flex-col" ref={diffsContainerRef}>
      {diffBlocks?.map((diffsBlock, blockIndex) => {
        return (
          <InViewDiffRenderer
            key={blockIndex}
            blockName={outterBlockName(blockIndex)}
            root={document as unknown as RefObject<Element>}
            shouldRetainChildren={shouldRetainDiffChildren}
            detectionMargin={calculateDetectionMargin(data?.length)}
          >
            {diffsBlock.map((item, index) => {
              // Filter activityBlocks that are relevant for this file
              const fileComments =
                comments?.filter((thread: CommentItem<TypesPullReqActivity>[]) =>
                  thread.some(
                    (comment: CommentItem<TypesPullReqActivity>) =>
                      comment.payload?.payload?.code_comment?.path === item.text
                  )
                ) || []

              return (
                <div className={`${blockIndex === 0 ? 'pt-2' : 'pt-4'}`} key={item.filePath}>
                  <InViewDiffRenderer
                    key={item.filePath}
                    blockName={innerBlockName(item.filePath)}
                    root={diffsContainerRef}
                    shouldRetainChildren={shouldRetainDiffChildren}
                    detectionMargin={IN_VIEWPORT_DETECTION_MARGIN}
                  >
                    <PullRequestAccordion
                      handleUpload={handleUpload}
                      principalProps={principalProps}
                      key={`${item.title}-${index}`}
                      header={item}
                      diffMode={diffMode}
                      currentUser={currentUser}
                      comments={fileComments}
                      handleSaveComment={handleSaveComment}
                      deleteComment={deleteComment}
                      updateComment={updateComment}
                      defaultCommitFilter={defaultCommitFilter}
                      selectedCommits={selectedCommits}
                      markViewed={markViewed}
                      unmarkViewed={unmarkViewed}
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
                      toRepoFileDetails={toRepoFileDetails}
                      sourceBranch={pullReqMetadata?.source_branch}
                    />
                  </InViewDiffRenderer>
                </div>
              )
            })}
          </InViewDiffRenderer>
        )
      })}
    </div>
  )
}

export const PullRequestChanges = memo(PullRequestChangesInternal)
PullRequestChanges.displayName = 'PullRequestChanges'
