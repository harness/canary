import { FC, useMemo } from 'react'

import { SkeletonList, Spacer } from '@/components'
import { TypesUser } from '@/types'
import { DiffModeEnum } from '@git-diff-view/react'
import { activityToCommentItem, HandleUploadType, TypesCommit } from '@views/index'
import { TranslationStore } from '@views/repo/repo-list/types'
import { orderBy } from 'lodash-es'

import { CommitSuggestion, PullReqReviewDecision, TypesPullReq } from '../pull-request.types'
import { PullRequestChanges } from './components/changes/pull-request-changes'
import { CommitFilterItemProps, PullRequestChangesFilter } from './components/changes/pull-request-changes-filter'
import {
  orderSortDate,
  PullRequestDataState,
  ReviewerListPullReqOkResponse,
  TypesPullReqActivity
} from './pull-request-details-types'

interface RepoPullRequestChangesPageProps {
  useTranslationStore: () => TranslationStore
  usePullRequestProviderStore: () => PullRequestDataState
  currentUser?: TypesUser
  pullReqMetadata?: TypesPullReq
  reviewers?: ReviewerListPullReqOkResponse
  submitReview?: (decision: PullReqReviewDecision) => void
  refetchReviewers?: () => void
  loading?: boolean
  diffMode: DiffModeEnum
  setDiffMode: (value: DiffModeEnum) => void
  loadingReviewers?: boolean
  loadingRawDiff?: boolean
  handleSaveComment: (comment: string, parentId?: number) => void
  activities?: TypesPullReqActivity[]
  pullReqCommits?: TypesCommit[]
  deleteComment: (id: number) => void
  updateComment: (id: number, comment: string) => void
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
}
const PullRequestChangesPage: FC<RepoPullRequestChangesPageProps> = ({
  useTranslationStore,
  loadingReviewers,
  usePullRequestProviderStore,
  diffMode,
  reviewers,
  refetchReviewers,
  submitReview,
  currentUser,
  setDiffMode,
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
  setJumpToDiff
}) => {
  const { diffs, pullReqStats } = usePullRequestProviderStore()

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

  const renderContent = () => {
    if (loadingRawDiff) {
      return <SkeletonList />
    }
    return (
      <PullRequestChanges
        handleUpload={handleUpload}
        data={
          diffs?.map(item => ({
            text: item.filePath,
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
            isBinary: item.isBinary
          })) || []
        }
        useTranslationStore={useTranslationStore}
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
      />
    )
  }

  return (
    <>
      <PullRequestChangesFilter
        active={''}
        useTranslationStore={useTranslationStore}
        loading={loadingReviewers}
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
        viewedFiles={diffs?.[0]?.fileViews?.size || 0}
        pullReqStats={pullReqStats}
        onCommitSuggestionsBatch={onCommitSuggestionsBatch}
        commitSuggestionsBatchCount={commitSuggestionsBatchCount}
        diffData={diffs?.map(diff => ({
          filePath: diff.filePath,
          addedLines: diff.addedLines,
          deletedLines: diff.deletedLines
        }))}
        setJumpToDiff={setJumpToDiff}
      />
      <Spacer aria-setsize={5} />

      {renderContent()}
    </>
  )
}

export { PullRequestChangesPage }
