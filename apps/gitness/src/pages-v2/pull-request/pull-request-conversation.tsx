import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import copy from 'clipboard-copy'
import { isEmpty } from 'lodash-es'
import { useQueryState } from 'nuqs'

import {
  commentStatusPullReq,
  EnumCheckStatus,
  EnumMergeMethod,
  mergePullReqOp,
  OpenapiMergePullReq,
  reviewerAddPullReq,
  reviewerDeletePullReq,
  TypesPullReqActivity,
  TypesPullReqReviewer,
  useAssignLabelMutation,
  useCodeownersPullReqQuery,
  useCreateBranchMutation,
  useDeletePullReqSourceBranchMutation,
  useGetBranchQuery,
  useListLabelsQuery,
  useListPrincipalsQuery,
  useListPullReqActivitiesQuery,
  useListRepoLabelsQuery,
  useRestorePullReqSourceBranchMutation,
  useReviewerListPullReqQuery,
  useUnassignLabelMutation
} from '@harnessio/code-service-client'
import { SkeletonList, Spacer } from '@harnessio/ui/components'
import {
  PullRequestCommentBox,
  PullRequestFilters,
  PullRequestOverview,
  PullRequestPanel,
  PullRequestSideBar,
  SandboxLayout
} from '@harnessio/ui/views'

import CommitSuggestionsDialog from '../../components-v2/commit-suggestions-dialog'
import { useAppContext } from '../../framework/context/AppContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import {
  capitalizeFirstLetter,
  checkIfOutdatedSha,
  extractInfoForCodeOwnerContent,
  findChangeReqDecisions,
  findWaitingDecisions
} from '../../pages/pull-request/utils'
import { PathParams } from '../../RouteDefinitions'
import { CodeOwnerReqDecision } from '../../types'
import { filenameToLanguage } from '../../utils/git-utils'
import { useActivityFilters } from './hooks/useActivityFilters'
import { useDateFilters } from './hooks/useDataFilters'
import { usePRCommonInteractions } from './hooks/usePRCommonInteractions'
import { extractInfoFromRuleViolationArr, processReviewDecision } from './pull-request-utils'
import { usePullRequestProviderStore } from './stores/pull-request-provider-store'

export default function PullRequestConversationPage() {
  const {
    pullReqMetadata,
    refetchPullReq,
    refetchActivities,
    setRuleViolationArr,
    prPanelData,
    pullReqChecksDecision,
    updateCommentStatus
  } = usePullRequestProviderStore(state => ({
    pullReqMetadata: state.pullReqMetadata,
    refetchPullReq: state.refetchPullReq,
    refetchActivities: state.refetchActivities,
    setRuleViolationArr: state.setRuleViolationArr,
    prPanelData: state.prPanelData,
    pullReqChecksDecision: state.pullReqChecksDecision,
    updateCommentStatus: state.updateCommentStatus
  }))
  const { currentUser: currentUserData } = useAppContext()
  const [checkboxBypass, setCheckboxBypass] = useState(false)
  const { spaceId, repoId } = useParams<PathParams>()
  const { data: { body: principals } = {} } = useListPrincipalsQuery({
    // @ts-expect-error : BE issue - not implemnted
    queryParams: { page: 1, limit: 100, type: 'user' }
  })
  const [comment, setComment] = useState<string>('')

  const repoRef = useGetRepoRef()
  const { pullRequestId } = useParams<PathParams>()
  const prId = (pullRequestId && Number(pullRequestId)) || -1
  // const [loadState, setLoadState] = useState('data-loaded')
  const dateFilters = useDateFilters()
  const [dateOrderSort, setDateOrderSort] = useState<{ label: string; value: string }>(dateFilters[0])
  const activityFilters = useActivityFilters()
  const [activityFilter, setActivityFilter] = useState<{ label: string; value: string }>(activityFilters[0])
  const { data: { body: reviewers } = {}, refetch: refetchReviewers } = useReviewerListPullReqQuery({
    repo_ref: repoRef,
    pullreq_number: prId
  })
  const { data: { body: codeOwners } = {}, refetch: refetchCodeOwners } = useCodeownersPullReqQuery({
    repo_ref: repoRef,
    pullreq_number: prId
  })
  const { data: { body: activityData } = {} } = useListPullReqActivitiesQuery({
    repo_ref: repoRef,
    pullreq_number: prId,
    queryParams: {}
  })

  const [searchReviewers, setSearchReviewers] = useQueryState('reviewer', { defaultValue: '' })
  const [addReviewerError, setAddReviewerError] = useState('')
  const [removeReviewerError, setRemoveReviewerError] = useState('')
  const [searchLabel, setSearchLabel] = useQueryState('label', { defaultValue: '' })
  const [changesLoading, setChangesLoading] = useState(true)
  const [showDeleteBranchButton, setShowDeleteBranchButton] = useState(false)
  const [showRestoreBranchButton, setShowRestoreBranchButton] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { data: { body: labelsList } = {} } = useListRepoLabelsQuery({
    repo_ref: repoRef,
    queryParams: { inherited: true, query: searchLabel }
  })

  const { data: { body: PRLabels } = {}, refetch: refetchPRLabels } = useListLabelsQuery({
    repo_ref: repoRef,
    pullreq_number: prId,
    queryParams: {}
  })

  const { mutate: addLabel, error: addLabelError } = useAssignLabelMutation(
    {
      repo_ref: repoRef,
      pullreq_number: prId
    },
    {
      onSuccess: () => {
        refetchPRLabels()
      }
    }
  )

  const { mutate: removeLabel, error: removeLabelError } = useUnassignLabelMutation(
    {
      repo_ref: repoRef,
      pullreq_number: prId
    },
    {
      onSuccess: () => {
        refetchPRLabels()
      }
    }
  )

  const handleAddLabel = (id?: number) => {
    if (!id) return
    addLabel({
      body: {
        label_id: id
      }
    })
  }

  const handleRemoveLabel = (id: number) => {
    removeLabel({
      label_id: id
    })
  }

  const { mutateAsync: restoreBranch } = useRestorePullReqSourceBranchMutation({})
  const onRestoreBranch = () => {
    restoreBranch({
      repo_ref: repoRef,
      pullreq_number: prId,
      body: { bypass_rules: false }
    })
      .then(res => {
        if (res.body.name) {
          setErrorMsg('')
          setShowRestoreBranchButton(false)
          setShowDeleteBranchButton(true)
        }
      })
      .catch(err => {
        setErrorMsg(err.message)
      })
  }
  const {
    data: { body: sourceBranch } = {},
    error: branchError,
    refetch: refetchBranch
  } = useGetBranchQuery({
    repo_ref: repoRef,
    branch_name: pullReqMetadata?.source_branch || '',
    queryParams: { include_checks: true, include_rules: true }
  })
  const { mutateAsync: deleteBranch } = useDeletePullReqSourceBranchMutation({
    repo_ref: repoRef,
    pullreq_number: prId,
    queryParams: { dry_run_rules: true }
  })
  const { mutateAsync: createBranch } = useCreateBranchMutation({})

  const onDeleteBranch = () => {
    deleteBranch({
      repo_ref: repoRef,
      pullreq_number: prId,
      queryParams: { bypass_rules: true, dry_run_rules: false }
    })
      .then(res => {
        refetchBranch()
        if (res?.body?.rule_violations) {
          const { checkIfBypassAllowed } = extractInfoFromRuleViolationArr(res.body?.rule_violations)
          if (checkIfBypassAllowed) {
            setShowDeleteBranchButton(true)
          } else {
            setShowDeleteBranchButton(false)
            setShowRestoreBranchButton(true)
          }
        }
        setShowRestoreBranchButton(true)
        setErrorMsg('')
      })
      .catch(err => {
        setErrorMsg(err.message)
      })
  }

  useEffect(() => {
    if (sourceBranch && (pullReqMetadata?.merged || pullReqMetadata?.closed)) {
      setShowDeleteBranchButton(true)
    }
  }, [sourceBranch, pullReqMetadata?.merged, pullReqMetadata?.closed])

  useEffect(() => {
    if (branchError) {
      if (pullReqMetadata?.merged || pullReqMetadata?.closed) {
        setShowRestoreBranchButton(true)
      } else {
        setShowDeleteBranchButton(false)
        createBranch({
          repo_ref: repoRef,
          body: {
            name: pullReqMetadata?.source_branch || '',
            target: pullReqMetadata?.source_sha,
            bypass_rules: true,
            dry_run_rules: true
          }
        }).then(res => {
          if (res?.body?.rule_violations) {
            const { checkIfBypassAllowed } = extractInfoFromRuleViolationArr(res.body?.rule_violations)
            if (checkIfBypassAllowed) {
              setShowRestoreBranchButton(true)
            } else {
              setShowRestoreBranchButton(false)
            }
          } else {
            setShowRestoreBranchButton(true)
          }
        })
      }
    }
  }, [branchError])

  const [activities, setActivities] = useState(activityData)
  const approvedEvaluations = reviewers?.filter(evaluation => evaluation.review_decision === 'approved')
  const latestApprovalArr = approvedEvaluations?.filter(
    approved => !checkIfOutdatedSha(approved.sha, pullReqMetadata?.source_sha as string)
  )
  const changeReqEvaluations = reviewers?.filter(evaluation => evaluation.review_decision === 'changereq')
  const changeReqReviewer =
    changeReqEvaluations && !isEmpty(changeReqEvaluations)
      ? capitalizeFirstLetter(
          changeReqEvaluations[0].reviewer?.display_name || changeReqEvaluations[0].reviewer?.uid || ''
        )
      : 'Reviewer'
  const codeOwnerChangeReqEntries = findChangeReqDecisions(
    codeOwners?.evaluation_entries,
    CodeOwnerReqDecision.CHANGEREQ
  )
  const codeOwnerPendingEntries = findWaitingDecisions(codeOwners?.evaluation_entries)
  const codeOwnerApprovalEntries = findChangeReqDecisions(codeOwners?.evaluation_entries, CodeOwnerReqDecision.APPROVED)
  const latestCodeOwnerApprovalArr = codeOwnerApprovalEntries
    ?.map(entry => {
      // Filter the owner_evaluations for 'changereq' decisions
      const entryEvaluation = entry?.owner_evaluations.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (evaluation: any) => !checkIfOutdatedSha(evaluation?.review_sha, pullReqMetadata?.source_sha as string)
      )
      // If there are any 'changereq' decisions, return the entry along with them
      if (entryEvaluation && entryEvaluation?.length > 0) {
        return { entryEvaluation }
      }
    }) // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((entry: any) => entry !== null && entry !== undefined) // Filter out the null entries

  useEffect(() => {
    refetchCodeOwners()
  }, [pullReqMetadata, pullReqMetadata?.title, pullReqMetadata?.state, pullReqMetadata?.source_sha, refetchCodeOwners])

  // If you need to update activities when activityData changes, use useEffect
  useEffect(() => {
    setActivities(activityData)
  }, [activityData])

  const onCopyClick = (commentId?: number) => {
    if (commentId) {
      const url = new URL(window.location.href)
      url.pathname = url.pathname.replace('/conversation', '/changes')
      url.searchParams.set('commentId', commentId.toString())
      copy(url.toString())
    }
  }

  const changesInfo = extractInfoForCodeOwnerContent({
    approvedEvaluations,
    reqNoChangeReq: prPanelData?.atLeastOneReviewerRule,
    reqCodeOwnerApproval: prPanelData?.reqCodeOwnerApproval,
    minApproval: prPanelData?.minApproval,
    reqCodeOwnerLatestApproval: prPanelData?.reqCodeOwnerLatestApproval,
    minReqLatestApproval: prPanelData?.minReqLatestApproval,
    codeOwnerChangeReqEntries,
    codeOwnerPendingEntries,
    latestCodeOwnerApprovalArr,
    latestApprovalArr,
    codeOwnerApprovalEntries,
    changeReqReviewer,
    changeReqEvaluations
  })

  useEffect(() => {
    if (
      !prPanelData?.PRStateLoading &&
      changesInfo?.title !== '' &&
      changesInfo?.statusMessage !== '' &&
      changesInfo?.statusIcon !== ''
    ) {
      setChangesLoading(false)
    } else if (pullReqMetadata?.merged) {
      setChangesLoading(false)
    }
  }, [
    changesInfo?.title,
    changesInfo?.statusMessage,
    changesInfo?.statusIcon,
    prPanelData?.PRStateLoading,
    pullReqMetadata?.merged
  ])

  const handleAddReviewer = (id?: number) => {
    reviewerAddPullReq({ repo_ref: repoRef, pullreq_number: prId, body: { reviewer_id: id } })
      .then(() => {
        refetchReviewers()
      })
      .catch(error => setAddReviewerError(error.message))
  }
  const handleDeleteReviewer = (id: number) => {
    reviewerDeletePullReq({ repo_ref: repoRef, pullreq_number: prId, pullreq_reviewer_id: id })
      .then(() => {
        refetchReviewers()
      })
      .catch(error => setRemoveReviewerError(error.message))
  }
  const onPRStateChanged = useCallback(() => {
    refetchCodeOwners()
    refetchPullReq()
    refetchActivities()
  }, [refetchCodeOwners, repoRef, handleAddReviewer, handleDeleteReviewer]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleMerge = (method: string) => {
    const payload: OpenapiMergePullReq = {
      method: method as EnumMergeMethod,
      source_sha: pullReqMetadata?.source_sha,
      bypass_rules: checkboxBypass,
      dry_run: false
      // message: data.commitMessage
    }
    mergePullReqOp({ body: payload, repo_ref: repoRef, pullreq_number: prId }).then(() => {
      onPRStateChanged()
      setRuleViolationArr(undefined)
    })
    //todo: add catch t o show errors
    // .catch(exception => showError(getErrorMessage(exception)))
  }
  const mockPullRequestActions = [
    {
      id: '0',
      title: 'Squash and merge',
      description: 'All commits from this branch will be combined into one commit in the base branch.',
      action: () => {
        handleMerge('squash')
      }
    },
    {
      id: '1',
      title: 'Merge pull request',
      description: 'All commits from this branch will be added to the base branch via a merge commit.',
      action: () => {
        handleMerge('merge')
      }
    },
    {
      id: '2',
      title: 'Rebase and merge',
      description: 'All commits from this branch will be rebased and added to the base branch.',
      action: () => {
        handleMerge('rebase')
      }
    }
  ]

  const {
    handleSaveComment,
    updateComment,
    deleteComment,
    onCommitSuggestion,
    onCommitSuggestionSuccess,
    addSuggestionToBatch,
    removeSuggestionFromBatch,
    isCommitDialogOpen,
    setIsCommitDialogOpen,
    onCommitSuggestionsBatch,
    suggestionsBatch,
    suggestionToCommit,
    onCommentSaveAndStatusChange,
    toggleConversationStatus
  } = usePRCommonInteractions({
    repoRef,
    prId,
    refetchActivities,
    updateCommentStatus,
    currentUserName: currentUserData?.display_name,
    setActivities // pass setActivities if you want ephemeral logic
  })

  if (prPanelData?.PRStateLoading || changesLoading) {
    return <SkeletonList />
  }

  // TODO: we only need to plug in one component from @harnessio/ui/views
  // for the PullRequestConversationView example and pass it the required props
  return (
    <>
      <CommitSuggestionsDialog
        open={isCommitDialogOpen}
        onClose={() => setIsCommitDialogOpen(false)}
        onSuccess={onCommitSuggestionSuccess}
        suggestions={suggestionsBatch?.length ? suggestionsBatch : suggestionToCommit ? [suggestionToCommit] : null}
        prId={prId}
      />
      <SandboxLayout.Columns columnWidths="1fr 220px">
        <SandboxLayout.Column>
          <SandboxLayout.Content className="pl-0 pt-0">
            {/* TODO: fix handleaction for comment section in panel */}
            <PullRequestPanel
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
              conflictingFiles={prPanelData?.conflictingFiles}
              approvedEvaluations={approvedEvaluations}
              changeReqEvaluations={changeReqEvaluations}
              codeOwners={codeOwners}
              latestApprovalArr={latestApprovalArr}
              reqNoChangeReq={prPanelData?.atLeastOneReviewerRule}
              changeReqReviewer={changeReqReviewer}
              codeOwnerChangeReqEntries={codeOwnerChangeReqEntries}
              reqCodeOwnerApproval={prPanelData?.reqCodeOwnerApproval}
              reqCodeOwnerLatestApproval={prPanelData?.reqCodeOwnerLatestApproval}
              codeOwnerPendingEntries={codeOwnerPendingEntries}
              codeOwnerApprovalEntries={codeOwnerApprovalEntries}
              latestCodeOwnerApprovalArr={latestCodeOwnerApprovalArr}
              minApproval={prPanelData?.minApproval}
              minReqLatestApproval={prPanelData?.minReqLatestApproval}
              actions={mockPullRequestActions}
              resolvedCommentArr={prPanelData?.resolvedCommentArr}
              requiresCommentApproval={prPanelData?.requiresCommentApproval}
              ruleViolationArr={prPanelData?.ruleViolationArr}
              checkboxBypass={checkboxBypass}
              setCheckboxBypass={setCheckboxBypass}
              onRestoreBranch={onRestoreBranch}
              onDeleteBranch={onDeleteBranch}
              showDeleteBranchButton={showDeleteBranchButton}
              showRestoreBranchButton={showRestoreBranchButton}
              headerMsg={errorMsg}
              commitSuggestionsBatchCount={suggestionsBatch?.length}
              onCommitSuggestions={onCommitSuggestionsBatch}
            />
            <Spacer size={12} />
            <PullRequestFilters
              activityFilters={activityFilters}
              dateFilters={dateFilters}
              activityFilter={activityFilter}
              dateOrderSort={dateOrderSort}
              setActivityFilter={setActivityFilter}
              setDateOrderSort={setDateOrderSort}
            />
            <Spacer size={6} />

            <PullRequestOverview
              handleDeleteComment={deleteComment}
              handleUpdateComment={updateComment}
              useTranslationStore={useTranslationStore}
              repoId={repoRef}
              refetchActivities={refetchActivities}
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
              handleSaveComment={handleSaveComment}
              currentUser={{ display_name: currentUserData?.display_name, uid: currentUserData?.uid }}
              onCopyClick={onCopyClick}
              onCommentSaveAndStatusChange={onCommentSaveAndStatusChange}
              toggleConversationStatus={toggleConversationStatus}
              onCommitSuggestion={onCommitSuggestion}
              addSuggestionToBatch={addSuggestionToBatch}
              suggestionsBatch={suggestionsBatch}
              removeSuggestionFromBatch={removeSuggestionFromBatch}
              filenameToLanguage={filenameToLanguage}
            />
            <Spacer size={9} />
            <PullRequestCommentBox
              comment={comment}
              setComment={setComment}
              currentUser={currentUserData?.display_name}
              onSaveComment={handleSaveComment}
            />
            <Spacer size={9} />
          </SandboxLayout.Content>
        </SandboxLayout.Column>
        <SandboxLayout.Column>
          <SandboxLayout.Content className="px-0 pt-0">
            <PullRequestSideBar
              addReviewers={handleAddReviewer}
              usersList={principals?.map(user => ({ id: user.id, display_name: user.display_name, uid: user.uid }))}
              // repoMetadata={undefined}
              currentUserId={currentUserData?.uid}
              pullRequestMetadata={{ source_sha: pullReqMetadata?.source_sha as string }}
              processReviewDecision={processReviewDecision}
              refetchReviewers={refetchReviewers}
              handleDelete={handleDeleteReviewer}
              addReviewerError={addReviewerError}
              removeReviewerError={removeReviewerError}
              reviewers={reviewers?.map((val: TypesPullReqReviewer) => ({
                reviewer: { display_name: val.reviewer?.display_name, id: val.reviewer?.id },
                review_decision: val.review_decision,
                sha: val.sha
              }))}
              searchQuery={searchReviewers}
              setSearchQuery={setSearchReviewers}
              labelsList={labelsList?.map(label => {
                return {
                  id: label.id,
                  key: label.key,
                  color: label.color
                }
              })}
              PRLabels={PRLabels?.label_data?.map(label => {
                return {
                  id: label.id,
                  key: label.key,
                  color: label.color
                }
              })}
              searchLabelQuery={searchLabel}
              setSearchLabelQuery={setSearchLabel}
              addLabel={handleAddLabel}
              removeLabel={handleRemoveLabel}
              addLabelError={addLabelError?.message}
              removeLabelError={removeLabelError?.message}
              useTranslationStore={useTranslationStore}
            />
          </SandboxLayout.Content>
        </SandboxLayout.Column>
      </SandboxLayout.Columns>
    </>
  )
}
