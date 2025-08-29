import { memo, RefObject, useCallback, useEffect, useRef, useState } from 'react'

import { TypesUser } from '@/types'
import {
  CommentItem,
  CommitFilterItemProps,
  CommitSuggestion,
  FileViewedState,
  getFileViewedState,
  HandleUploadType,
  jumpToFile,
  PrincipalPropsType,
  TypesPullReq,
  TypesPullReqActivity
} from '@/views'
import { DiffModeEnum } from '@git-diff-view/react'
import {
  HeaderProps,
  PR_ACCORDION_STICKY_TOP,
  PullRequestAccordion
} from '@views/repo/pull-request/components/pull-request-accordian'
import { innerBlockName, outterBlockName } from '@views/repo/pull-request/utils'

interface DataProps {
  data: HeaderProps[]
  diffBlocks: HeaderProps[][]
  diffsContainerRef: RefObject<HTMLDivElement>
  diffMode: DiffModeEnum
  currentUser?: TypesUser
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
  toRepoFileDetails?: ({ path }: { path: string }) => string
  pullReqMetadata?: TypesPullReq
  principalProps: PrincipalPropsType
  currentRefForDiff?: string
  fullFileContentsMap?: Map<string, string>
  loadFullFileContents?: (filePaths: string[]) => Promise<void>
  diffPathQuery?: string
  initiatedJumpToDiff: boolean
  setInitiatedJumpToDiff: (initiatedJumpToDiff: boolean) => void
}

export const getFileComments = (diffItem: HeaderProps, comments: CommentItem<TypesPullReqActivity>[][]) => {
  return (
    comments?.filter((thread: CommentItem<TypesPullReqActivity>[]) =>
      thread.some((comment: CommentItem<TypesPullReqActivity>) => {
        const commentPath = comment.payload?.payload?.code_comment?.path
        if (!commentPath) return false
        // Handle renamed files: check both old and new paths
        if (diffItem.isRename && diffItem.oldName && diffItem.newName) {
          return commentPath === diffItem.oldName || commentPath === diffItem.newName
        }
        // For non-renamed files
        return commentPath === diffItem.text
      })
    ) || []
  )
}

function PullRequestChangesInternal({
  data,
  diffBlocks,
  diffsContainerRef,
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
  toRepoFileDetails,
  pullReqMetadata,
  principalProps,
  currentRefForDiff,
  diffPathQuery,
  initiatedJumpToDiff,
  setInitiatedJumpToDiff,
  fullFileContentsMap,
  loadFullFileContents
}: DataProps) {
  const [openItems, setOpenItems] = useState<string[]>([])
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const preloadFilesForDiffs = useCallback(
    (items: HeaderProps[]) => {
      if (!loadFullFileContents) return

      const pathsToLoad = items
        .map(item => item.filePath)
        .filter(Boolean)
        .filter(path => !fullFileContentsMap?.has(path)) // Skip files we already have

      if (pathsToLoad.length > 0) {
        loadFullFileContents(pathsToLoad)
      }
    },
    [loadFullFileContents, fullFileContentsMap]
  )

  // Handle inner file visibility to prioritize loading
  const handleFileVisibilityChange = useCallback(
    (isVisible: boolean, filePath: string) => {
      if (isVisible && filePath) {
        const diffItem = data.find(item => item.filePath === filePath)
        if (diffItem) {
          preloadFilesForDiffs([diffItem])
        }
      }
    },
    [data, preloadFilesForDiffs]
  )
  const [hasInitializedOpenItems, setHasInitializedOpenItems] = useState(false)

  // Scroll position cache scoped to current PR
  const diffScrollCacheRef = useRef(new Map<string, number>())

  // Infinite scroll state
  const INITIAL_LOAD_COUNT = 30
  const LOAD_MORE_COUNT = 20
  const [visibleFileCount, setVisibleFileCount] = useState(INITIAL_LOAD_COUNT)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const jumpToDiff = useCallback(
    (fileText: string, delay: number = 0) => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      const collapsedFile = data.find(item => item.text === fileText)
      if (collapsedFile) {
        const currentIndex = data.findIndex(item => item.filePath === collapsedFile.filePath)
        if (currentIndex !== -1) {
          const diffItem = data[currentIndex]
          if (diffItem) {
            // Check if accordion content has scrolled behind the sticky header
            const accordionContent = diffsContainerRef?.current?.querySelector(
              `[data-diff-content="${diffItem.filePath}"]`
            ) as HTMLElement | null
            const contentRect = accordionContent?.getBoundingClientRect()
            const hasContentScrolledBehindHeader = contentRect && contentRect?.top < PR_ACCORDION_STICKY_TOP
            // Only jump if content has actually scrolled behind the sticky header (at PR_ACCORDION_STICKY_TOP)
            if (hasContentScrolledBehindHeader) {
              scrollTimeoutRef.current = setTimeout(() => {
                jumpToFile(
                  fileText,
                  diffBlocks,
                  undefined,
                  diffsContainerRef,
                  (targetCount: number) => {
                    setVisibleFileCount(Math.max(targetCount, visibleFileCount))
                  },
                  openItems,
                  diffScrollCacheRef.current
                )
                scrollTimeoutRef.current = null
              }, delay)
            }
          }
        }
      }
    },
    [data, diffBlocks, diffsContainerRef, openItems, visibleFileCount]
  )

  useEffect(() => {
    if (data.length > 0 && !hasInitializedOpenItems) {
      const itemsToOpen: string[] = []
      data.map(diffItem => {
        const fileComments = getFileComments(diffItem, comments)
        const diffHasComment = fileComments.some(thread => thread.some(comment => String(comment.id) === commentId))
        if (commentId && diffHasComment && !initiatedJumpToDiff) {
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
      setHasInitializedOpenItems(true)
    }
  }, [data, commentId, comments, setOpenItems, hasInitializedOpenItems])

  const isOpen = useCallback(
    (fileText: string) => {
      return openItems.includes(fileText)
    },
    [openItems]
  )
  const toggleOpen = useCallback(
    (fileText: string) => {
      const wasOpen = openItems.includes(fileText)
      setOpenItems(curr => (curr.includes(fileText) ? curr.filter(t => t !== fileText) : [...curr, fileText]))

      // Only check if sticky position needs to be maintained when collapsing (not when opening)
      if (wasOpen) {
        jumpToDiff(fileText)
      }
    },
    [setOpenItems, jumpToDiff, openItems]
  )

  const collapseAfterMarkingViewed = useCallback(
    (fileText: string, val: boolean) => {
      setOpenItems(items => {
        if (val) {
          return items.filter(item => item !== fileText)
        } else {
          return items.includes(fileText) ? items : [...items, fileText]
        }
      })
      // if collapsing check if sticky position of header needs to be maintained by jumping to diff
      if (val) jumpToDiff(fileText)
    },
    [setOpenItems, jumpToDiff]
  )

  // if diffPath or commentId provided in url search params, jump to diff
  useEffect(() => {
    if (!data.length || initiatedJumpToDiff) return
    if (diffPathQuery) {
      const diffItem = data.find(item => item.filePath === diffPathQuery)
      if (diffItem) {
        jumpToFile(
          diffItem.filePath,
          diffBlocks,
          undefined,
          diffsContainerRef,
          (targetCount: number) => {
            setVisibleFileCount(Math.max(targetCount, visibleFileCount))
          },
          openItems,
          diffScrollCacheRef.current
        )
        setInitiatedJumpToDiff(true)
      }
    } else if (commentId) {
      const diffItem = data.find(item => {
        const fileComments = getFileComments(item, comments)
        return fileComments.some(thread => thread.some(comment => String(comment.id) === commentId))
      })
      if (diffItem) {
        jumpToFile(
          diffItem.filePath,
          diffBlocks,
          commentId,
          diffsContainerRef,
          (targetCount: number) => {
            setVisibleFileCount(Math.max(targetCount, visibleFileCount))
          },
          openItems,
          diffScrollCacheRef.current
        )
        setInitiatedJumpToDiff(true)
      }
    }
  }, [commentId, diffPathQuery, data, initiatedJumpToDiff])

  // Infinite scroll intersection observer
  useEffect(() => {
    const loadMoreElement = loadMoreRef.current
    if (!loadMoreElement) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoadingMore) {
          const totalFiles = data?.length || 0
          if (visibleFileCount < totalFiles) {
            setIsLoadingMore(true)
            // RAF to prevent blocking
            requestAnimationFrame(() => {
              setVisibleFileCount(prev => Math.min(prev + LOAD_MORE_COUNT, totalFiles))
              setIsLoadingMore(false)
            })
          }
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(loadMoreElement)
    return () => observer.disconnect()
  }, [visibleFileCount, isLoadingMore, data?.length])

  return (
    <div className="flex flex-col" ref={diffsContainerRef}>
      {diffBlocks?.map((diffsBlock, blockIndex) => {
        return (
          <div key={blockIndex} data-block={outterBlockName(blockIndex)}>
            {diffsBlock.slice(0, visibleFileCount).map((item, index) => {
              // Only render files up to visibleFileCount for infinite scroll
              const globalIndex = diffBlocks.flat().indexOf(item)
              if (globalIndex >= visibleFileCount) return null

              // Filter activityBlocks that are relevant for this file
              const fileComments =
                comments?.filter((thread: CommentItem<TypesPullReqActivity>[]) =>
                  thread.some((comment: CommentItem<TypesPullReqActivity>) => {
                    const commentPath = comment.payload?.payload?.code_comment?.path
                    if (!commentPath) return false
                    // Handle renamed files: both old and new paths
                    if (item.isRename && item.oldName && item.newName) {
                      return commentPath === item.oldName || commentPath === item.newName
                    }
                    // For non-renamed files
                    return commentPath === item.text
                  })
                ) || []

              return (
                <div className="pt-cn-xs" key={item.filePath}>
                  <div key={item.filePath} data-block={innerBlockName(item.filePath)}>
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
                      openItems={openItems}
                      isOpen={isOpen(item.text)}
                      onToggle={() => toggleOpen(item.text)}
                      setCollapsed={val => collapseAfterMarkingViewed(item.text, val)}
                      toRepoFileDetails={toRepoFileDetails}
                      sourceBranch={pullReqMetadata?.source_branch}
                      currentRefForDiff={currentRefForDiff}
                      fullFileContent={fullFileContentsMap?.get(item.filePath)}
                      commentLayout="compact"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}

      {/* Infinite scroll trigger element */}
      {(data?.length || 0) > visibleFileCount && (
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center text-cn-7">
          {isLoadingMore ? 'Loading more diffs...' : 'Scroll to load more'}
        </div>
      )}
    </div>
  )
}

export const PullRequestChanges = memo(PullRequestChangesInternal)
PullRequestChanges.displayName = 'PullRequestChanges'
