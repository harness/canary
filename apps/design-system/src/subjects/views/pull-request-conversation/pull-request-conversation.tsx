import { FC, PropsWithChildren } from 'react'

import { noop, useTranslationStore } from '@utils/viewUtils'

import { CommitSuggestionsDialog, FilterOption, Spacer } from '@harnessio/ui/components'
import {
  CommitSuggestion,
  EnumCheckStatus,
  EnumPullReqReviewDecision,
  ILabelType,
  LabelAssignmentType,
  PullReqReviewDecision,
  PullRequestCommentBox,
  PullRequestFilters,
  PullRequestOverview,
  PullRequestPanel,
  PullRequestSideBar,
  SandboxLayout,
  TypesCodeOwnerEvaluation,
  TypesCodeOwnerEvaluationEntry,
  TypesPullReqActivity,
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
  const spaceId = ''
  const repoId = ''
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
  const checkboxBypass = false

  const showDeleteBranchButton = false
  const showRestoreBranchButton = false
  const errorMsg = ''
  const activityFilters: FilterOption[] = []
  const dateFilters: FilterOption[] = []
  const activityFilter = { label: '', value: '' }
  const dateOrderSort = { label: '', value: '' }

  const repoRef = ''
  const commentStatusPullReq = ''
  const currentUserData = { display_name: 'admin', uid: '' }

  const comment = ''

  const processReviewDecision = (): EnumPullReqReviewDecision | PullReqReviewDecision.outdated => {
    // Example implementation
    return 'approved'
  }
  const activities = state === 'complex-1' ? mockActivities : undefined

  const addReviewerError = { message: '' }
  const removeReviewerError = { message: '' }

  const searchReviewers = ''

  const labelsList: ILabelType[] = state === 'complex-1' ? mockLabelList : []
  const PRLabels = state === 'complex-1' ? mockPrLabels : { label_data: [] as LabelAssignmentType[] }
  const searchLabel = ''
  const pullReqMetadata = { source_sha: '' }
  const reviewers = state === 'complex-1' ? mockReviewers : undefined

  return (
    <>
      <CommitSuggestionsDialog
        isOpen={isCommitDialogOpen}
        onClose={noop}
        onFormSubmit={() => Promise.resolve()}
        isSubmitting={false}
      />
      <SandboxLayout.Columns columnWidths="1fr 220px">
        <SandboxLayout.Column>
          <SandboxLayout.Content className="pl-0 pt-0">
            {/* TODO: fix handleaction for comment section in panel */}
            <PullRequestPanel
              handleRebaseBranch={handleRebaseBranch}
              handlePrState={handlePrState}
              spaceId={spaceId || ''}
              repoId={repoId}
              changesInfo={{
                header: changesInfo?.title,
                content: changesInfo?.statusMessage,
                status: changesInfo?.statusIcon
              }}
              checksInfo={{
                header: pullReqChecksDecision.checkInfo.title,
                content: pullReqChecksDecision.summaryText,
                status: pullReqChecksDecision?.checkInfo.status as EnumCheckStatus
              }}
              commentsInfo={prPanelData?.commentsInfoData}
              ruleViolation={prPanelData.ruleViolation}
              checks={pullReqChecksDecision?.data?.checks}
              PRStateLoading={prPanelData?.PRStateLoading}
              // TODO: TypesPullReq is null for someone: vardan will look into why swagger is doing this
              pullReqMetadata={pullReqMetadata ? pullReqMetadata : undefined}
              // TODO: add dry merge check into pr context
              conflictingFiles={undefined}
              approvedEvaluations={approvedEvaluations}
              changeReqEvaluations={changeReqEvaluations}
              codeOwners={codeOwners}
              latestApprovalArr={latestApprovalArr}
              reqNoChangeReq={prPanelData?.atLeastOneReviewerRule}
              changeReqReviewer={changeReqReviewer}
              codeOwnerChangeReqEntries={undefined}
              reqCodeOwnerApproval={prPanelData?.reqCodeOwnerApproval}
              reqCodeOwnerLatestApproval={prPanelData?.reqCodeOwnerLatestApproval}
              codeOwnerPendingEntries={codeOwnerPendingEntries}
              codeOwnerApprovalEntries={undefined}
              latestCodeOwnerApprovalArr={undefined}
              minApproval={prPanelData?.minApproval}
              minReqLatestApproval={prPanelData?.minReqLatestApproval}
              actions={mockPullRequestActions}
              resolvedCommentArr={undefined}
              requiresCommentApproval={prPanelData?.requiresCommentApproval}
              ruleViolationArr={undefined}
              checkboxBypass={checkboxBypass}
              setCheckboxBypass={noop}
              onRestoreBranch={noop}
              onDeleteBranch={noop}
              showDeleteBranchButton={showDeleteBranchButton}
              showRestoreBranchButton={showRestoreBranchButton}
              headerMsg={errorMsg}
              commitSuggestionsBatchCount={suggestionsBatch?.length}
              onCommitSuggestions={noop}
            />
            <Spacer size={12} />
            <PullRequestFilters
              activityFilters={activityFilters}
              dateFilters={dateFilters}
              activityFilter={activityFilter}
              dateOrderSort={dateOrderSort}
              setActivityFilter={noop}
              setDateOrderSort={noop}
            />
            <Spacer size={6} />

            <PullRequestOverview
              handleUpdateDescription={noop}
              handleDeleteComment={noop}
              handleUpdateComment={noop}
              useTranslationStore={useTranslationStore}
              repoId={repoRef}
              refetchActivities={noop}
              commentStatusPullReq={commentStatusPullReq}
              data={activities?.map((item: TypesPullReqActivity) => {
                return {
                  author: item?.author,
                  created: item?.created,
                  deleted: item?.deleted,
                  edited: item?.edited,
                  id: item?.id,
                  kind: item?.kind,
                  mentions: item?.mentions,
                  metadata: item?.metadata,
                  order: item?.order,
                  parent_id: item?.parent_id,
                  payload: item as TypesPullReqActivity,
                  pullreq_id: item?.pullreq_id,
                  repo_id: item?.repo_id,
                  resolved: item?.resolved,
                  resolver: item?.resolver,
                  sub_order: item?.sub_order,
                  text: item?.text,
                  type: item?.type,
                  updated: item?.updated
                }
              })}
              pullReqMetadata={pullReqMetadata ? pullReqMetadata : undefined}
              activityFilter={activityFilter}
              dateOrderSort={dateOrderSort}
              handleSaveComment={noop}
              currentUser={{ display_name: currentUserData?.display_name, uid: currentUserData?.uid }}
              onCopyClick={noop}
              toggleConversationStatus={noop}
              onCommitSuggestion={noop}
              addSuggestionToBatch={noop}
              suggestionsBatch={suggestionsBatch}
              removeSuggestionFromBatch={noop}
              filenameToLanguage={noop}
              handleUpload={noop}
            />
            <Spacer size={9} />
            <PullRequestCommentBox
              comment={comment}
              setComment={noop}
              currentUser={currentUserData?.display_name}
              onSaveComment={noop}
              handleUpload={noop}
            />
            <Spacer size={9} />
          </SandboxLayout.Content>
        </SandboxLayout.Column>
        <SandboxLayout.Column>
          <SandboxLayout.Content className="px-0 pt-0">
            <PullRequestSideBar
              addReviewers={noop}
              usersList={undefined}
              // repoMetadata={undefined}
              currentUserId={currentUserData?.uid}
              pullRequestMetadata={{ source_sha: pullReqMetadata?.source_sha as string }}
              processReviewDecision={processReviewDecision}
              refetchReviewers={noop}
              handleDelete={noop}
              addReviewerError={addReviewerError.message}
              removeReviewerError={removeReviewerError.message}
              reviewers={reviewers}
              searchQuery={searchReviewers}
              setSearchQuery={noop}
              labelsList={labelsList}
              PRLabels={PRLabels?.label_data}
              searchLabelQuery={searchLabel}
              setSearchLabelQuery={noop}
              addLabel={noop}
              removeLabel={noop}
              useTranslationStore={useTranslationStore}
            />
          </SandboxLayout.Content>
        </SandboxLayout.Column>
      </SandboxLayout.Columns>
    </>
  )
}

export default PullRequestConversation
