import { FC, PropsWithChildren } from 'react'

import { usePrFilters } from '@subjects/views/pull-request-conversation/hooks/use-pr-filters'
import { noop, useTranslationStore } from '@utils/viewUtils'

import { CommitSuggestionsDialog } from '@harnessio/ui/components'
import {
  CommitSuggestion,
  EnumCheckStatus,
  EnumPullReqReviewDecision,
  ILabelType,
  LabelAssignmentType,
  PullReqReviewDecision,
  PullRequestConversationPage,
  TypesCodeOwnerEvaluation,
  TypesCodeOwnerEvaluationEntry,
  TypesPullReqReviewer
} from '@harnessio/ui/views'

import {
  changesInfoData,
  mockActivities,
  mockLabelList,
  mockPrLabels,
  mockPullRequestActions,
  mockReviewers,
  pendingChangesInfoData,
  prPanelInfo,
  pullReqChecksDecisionSucceeded
} from './pull-request-panelData'

interface PullRequestConversationProps extends PropsWithChildren<React.HTMLAttributes<HTMLElement>> {
  state: string
}

const PullRequestConversation: FC<PullRequestConversationProps> = ({ state }) => {
  const isCommitDialogOpen = false

  const suggestionsBatch: CommitSuggestion[] = []

  const handleRebaseBranch = () => {}
  const handlePrState = () => {}
  const changesInfo = state === 'complex-1' ? pendingChangesInfoData : changesInfoData
  const pullReqChecksDecision =
    state === 'complex-1'
      ? pullReqChecksDecisionSucceeded
      : { checkInfo: { title: '', status: '' }, summaryText: '', data: { checks: [] } }
  const prPanelData = prPanelInfo
  const approvedEvaluations: TypesPullReqReviewer[] = []
  const changeReqEvaluations: TypesPullReqReviewer[] = []
  const codeOwners: TypesCodeOwnerEvaluation = {} as TypesCodeOwnerEvaluation
  const latestApprovalArr: TypesPullReqReviewer[] = []
  const changeReqReviewer = ''
  const codeOwnerPendingEntries: TypesCodeOwnerEvaluationEntry[] = []

  const showDeleteBranchButton = false
  const showRestoreBranchButton = false
  const errorMsg = ''

  const currentUserData = { display_name: 'admin', uid: '' }

  const comment = ''

  const processReviewDecision = (): EnumPullReqReviewDecision | PullReqReviewDecision.outdated => {
    // Example implementation
    return 'approved'
  }
  const activities = state === 'complex-1' ? mockActivities : undefined

  const searchReviewers = ''

  const labelsList: ILabelType[] = state === 'complex-1' ? mockLabelList : []
  const PRLabels = state === 'complex-1' ? mockPrLabels : { label_data: [] as LabelAssignmentType[] }
  const searchLabel = ''
  const pullReqMetadata = { source_sha: '' }
  const reviewers = state === 'complex-1' ? mockReviewers : undefined

  const filtersData = usePrFilters()

  return (
    <>
      <CommitSuggestionsDialog
        isOpen={isCommitDialogOpen}
        onClose={noop}
        onFormSubmit={() => Promise.resolve()}
        isSubmitting={false}
      />
      <PullRequestConversationPage
        rebaseErrorMessage={null}
        filtersProps={filtersData}
        useTranslationStore={useTranslationStore}
        panelProps={{
          handleRebaseBranch,
          handlePrState,
          changesInfo: {
            header: changesInfo.title,
            content: changesInfo.statusMessage,
            status: changesInfo.statusIcon
          },
          checksInfo: {
            header: pullReqChecksDecision.checkInfo.title,
            content: pullReqChecksDecision.summaryText,
            status: pullReqChecksDecision?.checkInfo.status as EnumCheckStatus
          },
          prPanelData,
          checks: pullReqChecksDecision?.data?.checks,
          // TODO: TypesPullReq is null for someone: vardan will look into why swagger is doing this
          pullReqMetadata,
          // TODO: add dry merge check into pr context
          approvedEvaluations,
          changeReqEvaluations,
          codeOwners,
          latestApprovalArr,
          changeReqReviewer,
          codeOwnerPendingEntries,
          actions: mockPullRequestActions,
          checkboxBypass: false,
          setCheckboxBypass: noop,
          onRestoreBranch: noop,
          onDeleteBranch: noop,
          showDeleteBranchButton,
          showRestoreBranchButton,
          headerMsg: errorMsg,
          commitSuggestionsBatchCount: suggestionsBatch?.length,
          onCommitSuggestions: noop,
          toPRCheck: _ => '',
          spaceId: '',
          repoId: ''
        }}
        overviewProps={{
          toCommitDetails: _ => '',
          handleUpdateDescription: noop,
          handleDeleteComment: noop,
          handleUpdateComment: noop,
          data: activities,
          pullReqMetadata,
          activityFilter: filtersData.activityFilter,
          dateOrderSort: filtersData.dateOrderSort,
          handleSaveComment: noop,
          currentUser: {
            display_name: currentUserData?.display_name,
            uid: currentUserData?.uid
          },
          onCopyClick: noop,
          toggleConversationStatus: noop,
          onCommitSuggestion: noop,
          addSuggestionToBatch: noop,
          suggestionsBatch: [],
          removeSuggestionFromBatch: noop,
          filenameToLanguage: noop,
          handleUpload: noop
        }}
        commentBoxProps={{
          comment,
          setComment: noop,
          currentUser: currentUserData?.display_name,
          onSaveComment: noop,
          handleUpload: noop
        }}
        sideBarProps={{
          addReviewers: noop,
          usersList: undefined,
          currentUserId: currentUserData?.uid,
          pullRequestMetadata: { source_sha: pullReqMetadata?.source_sha || '' },
          processReviewDecision,
          refetchReviewers: noop,
          handleDelete: noop,
          addReviewerError: '',
          removeReviewerError: '',
          reviewers,
          searchQuery: searchReviewers,
          setSearchQuery: noop,
          labelsList,
          PRLabels: PRLabels?.label_data,
          searchLabelQuery: searchLabel,
          setSearchLabelQuery: noop,
          addLabel: noop,
          removeLabel: noop,
          editLabelsProps: { to: '' }
        }}
      />
    </>
  )
}

export default PullRequestConversation
