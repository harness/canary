import { FC, useMemo } from 'react'

import { SearchFiles, SkeletonList, Spacer } from '@/components'
import { TypesUser } from '@/types'
import { SandboxLayout } from '@/views'
import { DiffModeEnum } from '@git-diff-view/react'
import { activityToCommentItem, HandleUploadType, TypesCommit } from '@views/index'
import { orderBy } from 'lodash-es'

import { CommitSuggestion, PullReqReviewDecision, TypesPullReq } from '../pull-request.types'
import { PullRequestChanges } from './components/changes/pull-request-changes'
import { PullRequestChangesExplorer } from './components/changes/pull-request-changes-explorer'
import { CommitFilterItemProps, PullRequestChangesFilter } from './components/changes/pull-request-changes-filter'
import {
  orderSortDate,
  PrincipalPropsType,
  PullRequestDataState,
  ReviewerListPullReqOkResponse,
  TypesPullReqActivity
} from './pull-request-details-types'

export function getFileNamesFromPaths(paths: string[]): string[] {
  return paths.map(filePath => {
    // normalize all backslashes to forward‑slashes
    const normalized = filePath.replace(/\\/g, '/')
    // split on slash, drop any empty segments (e.g. from leading/trailing slashes)
    const segments = normalized.split('/').filter(segment => segment.length > 0)
    // last segment is the file name (or empty string if input was just slashes)
    return segments.pop() || ''
  })
}

interface RepoPullRequestChangesPageProps {
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
  toRepoFileDetails?: ({ path }: { path: string }) => string
  principalProps: PrincipalPropsType
}
const PullRequestChangesPage: FC<RepoPullRequestChangesPageProps> = ({
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
  setJumpToDiff,
  toRepoFileDetails,
  principalProps
}) => {
  const { diffs, pullReqStats } = usePullRequestProviderStore()

  console.log(
    'diffspaths',
    diffs?.map(diff => diff.filePath)
  )

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
        principalProps={principalProps}
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
      />
    )
  }

  return (
    <SandboxLayout.Columns columnWidths="288px minmax(calc(100% - 288px), 1fr)">
      <SandboxLayout.Column>
        <SandboxLayout.Content className="pl-0 pr-8 pt-0">
          <div className="flex size-full flex-col gap-3">
            <SearchFiles
              navigateToFile={() => {}}
              filesList={getFileNamesFromPaths(diffs?.map(diff => diff.filePath) || [])}
            />
            <PullRequestChangesExplorer paths={diffs?.map(diff => diff.filePath) || []} />
          </div>
        </SandboxLayout.Content>
      </SandboxLayout.Column>
      <SandboxLayout.Column>
        <SandboxLayout.Content className="px-0 pt-0">
          <PullRequestChangesFilter
            active={''}
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
        </SandboxLayout.Content>
      </SandboxLayout.Column>
    </SandboxLayout.Columns>
  )
}

export { PullRequestChangesPage }
PullRequestChangesPage.displayName = 'PullRequestChangesPage'
