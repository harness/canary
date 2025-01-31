import { FC, PropsWithChildren, useCallback } from 'react'

import { noop, useTranslationsStore } from '@utils/viewUtils'

import { CommitSuggestionsDialog } from '@harnessio/ui/components'
import { PullRequestChangesPage, TypesCommit, TypesPullReqActivity } from '@harnessio/ui/views'

import { commitData, currentUser } from './pull-request-changes-data'
import { mockDiffs, pullRequestProviderStore } from './pull-request-provider-store'
import { pullRequestStore } from './pull-request-store'

interface PullRequestChangesProps extends PropsWithChildren<React.HTMLAttributes<HTMLElement>> {
  state: string
}

const PullRequestChanges: FC<PullRequestChangesProps> = ({ state }) => {
  const isCommitDialogOpen = false

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
        isOpen={isCommitDialogOpen}
        onClose={noop}
        onFormSubmit={() => Promise.resolve()}
        isSubmitting={false}
      />
      <PullRequestChangesPage
        handleUpload={noop}
        usePullRequestProviderStore={usePullRequestProviderStore}
        useTranslationStore={useTranslationsStore}
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
        handleSaveComment={noop}
        pullReqCommits={commitData as unknown as TypesCommit[]}
        deleteComment={noop}
        updateComment={noop}
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
        scrolledToComment={undefined}
        setScrolledToComment={noop}
      />
    </>
  )
}

export default PullRequestChanges
