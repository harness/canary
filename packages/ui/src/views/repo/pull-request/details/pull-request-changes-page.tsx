import { FC, useMemo, useRef, useState } from 'react'

import { Layout, Skeleton } from '@/components'
import { TypesUser } from '@/types'
import { DiffModeEnum } from '@git-diff-view/react'
import { cn } from '@utils/cn'
import {
  activityToCommentItem,
  FILE_VIEWED_OBSOLETE_SHA,
  HandleUploadType,
  SandboxLayout,
  TypesCommit
} from '@views/index'
import { orderBy } from 'lodash-es'

import { DraggableSidebarDivider, SIDEBAR_MIN_WIDTH } from '../../components/draggable-sidebar-divider'
import { PullRequestDiffSidebar } from '../components/pull-request-diff-sidebar'
import { CommitSuggestion, PullReqReviewDecision, TypesPullReq } from '../pull-request.types'
import { PullRequestChanges } from './components/changes/pull-request-changes'
import { CommitFilterItemProps, PullRequestChangesFilter } from './components/changes/pull-request-changes-filter'
import {
  orderSortDate,
  PrincipalPropsType,
  PullRequestDataState,
  ReviewerListPullReqOkResponse,
  TypesPullReqActivity
} from './pull-request-details-types'

interface RepoPullRequestChangesPageProps {
  usePullRequestProviderStore: () => PullRequestDataState
  currentUser?: TypesUser
  pullReqMetadata?: TypesPullReq
  reviewers?: ReviewerListPullReqOkResponse
  submitReview?: (decision: PullReqReviewDecision) => void
  refetchReviewers?: () => void
  loading?: boolean
  isApproving?: boolean
  diffMode: DiffModeEnum
  setDiffMode: (value: DiffModeEnum) => void
  loadingReviewers?: boolean
  loadingRawDiff?: boolean
  handleSaveComment: (comment: string, parentId?: number) => Promise<void>
  activities?: TypesPullReqActivity[]
  pullReqCommits?: TypesCommit[]
  deleteComment: (id: number) => Promise<void>
  updateComment: (id: number, comment: string) => Promise<void>
  defaultCommitFilter: CommitFilterItemProps
  selectedCommits: CommitFilterItemProps[]
  setSelectedCommits: React.Dispatch<React.SetStateAction<CommitFilterItemProps[]>>
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
  commitSuggestionsBatchCount: number
  onCommitSuggestionsBatch: () => void
  handleUpload?: HandleUploadType
  onGetFullDiff: (path?: string) => Promise<string | void>
  scrolledToComment?: boolean
  setScrolledToComment?: (val: boolean) => void
  jumpToDiff?: string
  setJumpToDiff: (fileName: string) => void
  toRepoFileDetails?: ({ path }: { path: string }) => string
  currentRefForDiff?: string
  principalProps: PrincipalPropsType
}
const PullRequestChangesPage: FC<RepoPullRequestChangesPageProps> = ({
  loadingReviewers: _loadingReviewers,
  usePullRequestProviderStore,
  diffMode,
  reviewers,
  refetchReviewers,
  submitReview,
  currentUser,
  setDiffMode,
  isApproving,
  pullReqMetadata,
  loadingRawDiff,
  handleSaveComment,
  activities,
  pullReqCommits,
  deleteComment,
  updateComment,
  defaultCommitFilter,
  selectedCommits,
  setSelectedCommits,
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
  commitSuggestionsBatchCount,
  onCommitSuggestionsBatch,
  handleUpload,
  onGetFullDiff,
  scrolledToComment,
  setScrolledToComment,
  jumpToDiff,
  setJumpToDiff,
  toRepoFileDetails,
  principalProps,
  currentRefForDiff
}) => {
  const { diffs, pullReqStats } = usePullRequestProviderStore()
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_MIN_WIDTH)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showExplorer, setShowExplorer] = useState(true)

  // Convert activities to comment threads
  const activityBlocks = useMemo(() => {
    const parentActivities = orderBy(
      activities?.filter(activity => !activity.payload?.parent_id) || [],
      'created',
      orderSortDate.ASC
    ).map(_comment => [_comment])

    parentActivities.forEach(parentActivity => {
      const childActivities = activities?.filter(activity => activity.payload?.parent_id === parentActivity[0].id)
      childActivities?.forEach(childComment => {
        parentActivity.push(childComment)
      })
    })

    return parentActivities.map(thread => thread.map(activityToCommentItem))
  }, [activities])

  const viewedFileCount =
    diffs?.reduce((count, currentDiff) => {
      const isInFileViewsAndNotObsolete =
        currentDiff.fileViews?.has(currentDiff.filePath) &&
        currentDiff.fileViews?.get(currentDiff.filePath) !== FILE_VIEWED_OBSOLETE_SHA

      return count + (isInFileViewsAndNotObsolete ? 1 : 0)
    }, 0) ?? 0

  const renderContent = () => {
    if (loadingRawDiff) {
      return <Skeleton.List />
    }
    return (
      <PullRequestChanges
        handleUpload={handleUpload}
        principalProps={principalProps}
        data={
          diffs?.map(item => ({
            text: item.isRename ? `${item.oldName} → ${item.newName}` : item.filePath,
            addedLines: item.addedLines,
            deletedLines: item.deletedLines,
            data: item.raw,
            title: item.filePath,
            lang: item.filePath.split('.')[1],
            fileViews: item.fileViews,
            checksumAfter: item.checksumAfter,
            filePath: item.filePath,
            diffData: item,
            isDeleted: !!item.isDeleted,
            unchangedPercentage: item.unchangedPercentage,
            isBinary: item.isBinary,
            isRename: !!item.isRename,
            oldName: item.oldName,
            newName: item.newName
          })) || []
        }
        diffMode={diffMode}
        currentUser={currentUser?.display_name}
        comments={activityBlocks}
        handleSaveComment={handleSaveComment}
        deleteComment={deleteComment}
        updateComment={updateComment}
        defaultCommitFilter={defaultCommitFilter}
        selectedCommits={selectedCommits}
        markViewed={markViewed}
        unmarkViewed={unmarkViewed}
        commentId={commentId}
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
        jumpToDiff={jumpToDiff}
        setJumpToDiff={setJumpToDiff}
        toRepoFileDetails={toRepoFileDetails}
        pullReqMetadata={pullReqMetadata}
        currentRefForDiff={currentRefForDiff}
      />
    )
  }

  return (
    <Layout.Flex className="flex-1" ref={containerRef}>
      {showExplorer && (
        <Layout.Flex className="-mb-7">
          <PullRequestDiffSidebar
            sidebarWidth={sidebarWidth}
            filePaths={diffs?.map(diff => diff.filePath) || []}
            setJumpToDiff={setJumpToDiff}
            diffsData={
              diffs?.map(item => ({
                addedLines: item.addedLines,
                deletedLines: item.deletedLines,
                lang: item.filePath.split('.')[1],
                filePath: item.filePath,
                isDeleted: !!item.isDeleted,
                unchangedPercentage: item.unchangedPercentage || 0
              })) || []
            }
          />
          <DraggableSidebarDivider width={sidebarWidth} setWidth={setSidebarWidth} containerRef={containerRef} />
        </Layout.Flex>
      )}
      <SandboxLayout.Main>
        <SandboxLayout.Content className={cn('flex flex-col p-0', showExplorer ? 'pl-cn-lg' : '')}>
          <PullRequestChangesFilter
            active={''}
            isApproving={isApproving}
            currentUser={currentUser ?? {}}
            pullRequestMetadata={pullReqMetadata ? pullReqMetadata : undefined}
            reviewers={reviewers}
            submitReview={submitReview}
            refetchReviewers={refetchReviewers}
            diffMode={diffMode}
            setDiffMode={setDiffMode}
            pullReqCommits={pullReqCommits}
            defaultCommitFilter={defaultCommitFilter}
            selectedCommits={selectedCommits}
            setSelectedCommits={setSelectedCommits}
            viewedFiles={viewedFileCount}
            pullReqStats={pullReqStats}
            onCommitSuggestionsBatch={onCommitSuggestionsBatch}
            commitSuggestionsBatchCount={commitSuggestionsBatchCount}
            showExplorer={showExplorer}
            setShowExplorer={setShowExplorer}
            diffData={diffs?.map(diff => ({
              filePath: diff.filePath,
              addedLines: diff.addedLines,
              deletedLines: diff.deletedLines
            }))}
            setJumpToDiff={setJumpToDiff}
          />
          {renderContent()}
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    </Layout.Flex>
  )
}

export { PullRequestChangesPage }
PullRequestChangesPage.displayName = 'PullRequestChangesPage'
