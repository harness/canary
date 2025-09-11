import { FC, PropsWithChildren, useCallback } from 'react'

import { noop } from '@utils/viewUtils'

import { CommitSuggestionsDialog } from '@harnessio/ui/components'
import { PullRequestChangesPage, TypesCommit, TypesPullReqActivity } from '@harnessio/ui/views'

import { commitData, currentUser } from './pull-request-changes-data'
import { mockDiffs, pullRequestProviderStore } from './pull-request-provider-store'
import { pullRequestStore } from './pull-request-store'

interface PullRequestChangesProps extends PropsWithChildren<React.HTMLAttributes<HTMLElement>> {
  state: string
}

const PullRequestChanges: FC<PullRequestChangesProps> = ({ state }) => {
  const usePullRequestProviderStore = useCallback(
    () => ({
      ...pullRequestProviderStore,
      diffs: state === 'complex-1' ? mockDiffs : pullRequestProviderStore.diffs,
      setRepoMetadata: noop,
      setPullReqCommits: noop,
      setShowEditDescription: noop,
      setRuleViolationArr: noop,
      refetchActivities: noop,
      refetchCommits: noop,
      refetchPullReq: noop,
      retryOnErrorFunc: noop,
      dryMerge: noop,
      updateCommentStatus: () => Promise.resolve<TypesPullReqActivity | undefined>(undefined),
      setCommentsInfoData: noop,
      setCommentsLoading: noop,
      setResolvedCommentArr: noop,
      setPullReqMetadata: noop,
      setPullReqStats: noop,
      updateState: noop,
      setDiffs: noop,
      getFileViewedState: () => {
        return false
      }
    }),

    [state]
  )
  return (
    <>
      <CommitSuggestionsDialog
        isOpen={false}
        onClose={noop}
        onFormSubmit={() => Promise.resolve()}
        isSubmitting={false}
      />
      <PullRequestChangesPage
        principalProps={{}}
        handleUpload={noop}
        usePullRequestProviderStore={usePullRequestProviderStore}
        setDiffMode={noop}
        loadingReviewers={undefined}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        diffMode={3}
        reviewers={undefined}
        refetchReviewers={noop}
        submitReview={noop}
        currentUser={currentUser}
        pullReqMetadata={pullRequestStore.pullRequest}
        loadingRawDiff={false}
        handleSaveComment={Promise.resolve}
        pullReqCommits={commitData as unknown as TypesCommit[]}
        deleteComment={Promise.resolve}
        updateComment={Promise.resolve}
        defaultCommitFilter={{
          name: 'All Commits',
          count: 2,
          value: 'ALL'
        }}
        selectedCommits={[
          {
            name: 'All Commits',
            count: 2,
            value: 'ALL'
          }
        ]}
        setSelectedCommits={noop}
        markViewed={noop}
        unmarkViewed={noop}
        activities={pullRequestProviderStore?.pullReqActivities}
        commentId={undefined}
        onCopyClick={noop}
        onCommentSaveAndStatusChange={noop}
        onCommitSuggestion={noop}
        addSuggestionToBatch={noop}
        suggestionsBatch={[]}
        removeSuggestionFromBatch={noop}
        filenameToLanguage={noop}
        toggleConversationStatus={noop}
        commitSuggestionsBatchCount={0}
        onCommitSuggestionsBatch={noop}
        onGetFullDiff={() => Promise.resolve()}
        setCommentId={noop}
        diffPathQuery={undefined}
        setDiffPathQuery={noop}
        initiatedJumpToDiff={false}
        setInitiatedJumpToDiff={noop}
      />
    </>
  )
}

export default PullRequestChanges
