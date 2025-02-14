import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import copy from 'clipboard-copy'
import { isEmpty } from 'lodash-es'

import {
  EnumCheckStatus,
  EnumMergeMethod,
  EnumPullReqState,
  mergePullReqOp,
  OpenapiMergePullReq,
  OpenapiStatePullReqRequest,
  rebaseBranch,
  RebaseBranchRequestBody,
  reviewerAddPullReq,
  reviewerDeletePullReq,
  statePullReq,
  TypesPullReqActivity,
  TypesPullReqReviewer,
  useCodeownersPullReqQuery,
  useCreateBranchMutation,
  useDeletePullReqSourceBranchMutation,
  useGetBranchQuery,
  useListPrincipalsQuery,
  useListPullReqActivitiesQuery,
  useRestorePullReqSourceBranchMutation,
  useReviewerListPullReqQuery,
  useUpdatePullReqMutation
} from '@harnessio/code-service-client'
import { SkeletonList } from '@harnessio/ui/components'
import { PrincipalType } from '@harnessio/ui/types'
import { PullRequestConversationPage as PullRequestConversationView } from '@harnessio/ui/views'

import CommitSuggestionsDialog from '../../components-v2/commit-suggestions-dialog'
import { useAppContext } from '../../framework/context/AppContext'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useQueryState } from '../../framework/hooks/useQueryState'
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
import { usePrConversationLabels } from './hooks/use-pr-conversation-labels'
import { usePrFilters } from './hooks/use-pr-filters'
import { usePRCommonInteractions } from './hooks/usePRCommonInteractions'
import { extractInfoFromRuleViolationArr, processReviewDecision } from './pull-request-utils'
import { usePullRequestProviderStore } from './stores/pull-request-provider-store'

export default function PullRequestConversationPage() {
  const routes = useRoutes()
  const {
    pullReqMetadata,
    refetchPullReq,
    refetchActivities,
    setRuleViolationArr,
    prPanelData,
    pullReqChecksDecision,
    updateCommentStatus,
    dryMerge
  } = usePullRequestProviderStore(state => ({
    dryMerge: state.dryMerge,
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
  const [searchReviewers, setSearchReviewers] = useState('')
  const [addReviewerError, setAddReviewerError] = useState('')
  const [removeReviewerError, setRemoveReviewerError] = useState('')

  const [changesLoading, setChangesLoading] = useState(true)
  const [showDeleteBranchButton, setShowDeleteBranchButton] = useState(false)
  const [showRestoreBranchButton, setShowRestoreBranchButton] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const { spaceId, repoId } = useParams<PathParams>()
  const [comment, setComment] = useState<string>('')
  const [commentId] = useQueryState('commentId')
  const [isScrolledToComment, setIsScrolledToComment] = useState(false)

  const repoRef = useGetRepoRef()
  const { pullRequestId } = useParams<PathParams>()
  const prId = (pullRequestId && Number(pullRequestId)) || -1
  // const [loadState, setLoadState] = useState('data-loaded')

  const filtersData = usePrFilters()

  const { data: { body: principals } = {} } = useListPrincipalsQuery({
    // @ts-expect-error : BE issue - not implemnted
    queryParams: { page: 1, limit: 100, type: 'user', query: searchReviewers }
  })

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

  /**
   * get all label-related data
   */
  const { searchLabel, changeSearchLabel, labels, labelsValues, handleAddLabel, handleRemoveLabel, appliedLabels } =
    usePrConversationLabels({
      repoRef,
      prId,
      refetchData: refetchActivities
    })

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
          refetchActivities()
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
  const { mutateAsync: updateTitle } = useUpdatePullReqMutation({
    repo_ref: repoRef,
    pullreq_number: Number(pullRequestId)
  })

  const handleUpdateDescription = (title: string, description: string) => {
    updateTitle({ body: { title, description } }).catch(err => {
      setErrorMsg(err.message)
    })
    refetchPullReq()
  }

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
        refetchActivities()
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

  const [activities, setActivities] = useState<TypesPullReqActivity[] | undefined>(activityData)
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

  useEffect(() => {
    setActivities(activityData)
  }, [activityData])

  const onCopyClick = (commentId?: number, isNotCodeComment = false) => {
    if (commentId) {
      const url = new URL(window.location.href)
      if (isNotCodeComment) {
        url.pathname = url.pathname.replace('/conversation', '/changes')
      }
      url.searchParams.set('commentId', commentId.toString())
      copy(url.toString())
    }
  }
  useEffect(() => {
    if (!commentId || isScrolledToComment || prPanelData.PRStateLoading || activityData?.length === 0) return
    // Slight timeout so the UI has time to expand/hydrate
    const timeoutId = setTimeout(() => {
      const elem = document.getElementById(`comment-${commentId}`)
      if (!elem) return
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setIsScrolledToComment(true)
    }, 500)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [commentId, isScrolledToComment, prPanelData.PRStateLoading, activityData])

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

  const handlePrState = (state: string) => {
    const payload: OpenapiStatePullReqRequest = {
      ...(state === 'draft' && { is_draft: true }),
      state: state === 'draft' ? 'open' : (state as EnumPullReqState)
    }
    statePullReq({ body: payload, repo_ref: repoRef, pullreq_number: prId }).then(() => {
      onPRStateChanged()
      setRuleViolationArr(undefined)
    })
  }

  const handleRebaseBranch = () => {
    const payload: RebaseBranchRequestBody = {
      base_branch: pullReqMetadata?.target_branch,
      bypass_rules: true,
      dry_run_rules: false,
      head_branch: pullReqMetadata?.source_branch,
      head_commit_sha: pullReqMetadata?.source_sha
    }

    rebaseBranch({ body: payload, repo_ref: repoRef }).then(
      () => {
        onPRStateChanged()
        setRuleViolationArr(undefined)
      },
      error => {
        setRebaseErrorMessage(error.message)
      }
    )
  }

  const mockPullRequestActions = [
    ...(pullReqMetadata?.closed
      ? [
          {
            id: '0',
            title: 'Open for review',
            description: 'Open this pull request for review.',
            action: () => {
              handlePrState('open')
            }
          }
        ]
      : pullReqMetadata?.is_draft
        ? [
            {
              id: '0',
              title: 'Ready for review',
              description: 'Open this pull request for review.',
              action: () => {
                handlePrState('open')
              }
            },
            {
              id: '1',
              title: 'Close pull request',
              description: 'Close this pull request. You can still re-open the request after closing.',
              action: () => {
                handlePrState('closed')
              }
            }
          ]
        : [
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
            },
            {
              id: '3',
              title: 'Fast-forward merge',
              description:
                'All commits from this branch will be added to the base branch without a merge commit. Rebase may be required.',
              action: () => {
                handleMerge('fast-forward')
              }
            }
          ])
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
    toggleConversationStatus,
    handleUpload
  } = usePRCommonInteractions({
    repoRef,
    prId,
    refetchActivities,
    updateCommentStatus,
    currentUserName: currentUserData?.display_name,
    setActivities, // pass setActivities if you want ephemeral logic
    dryMerge
  })

  const [rebaseErrorMessage, setRebaseErrorMessage] = useState<string | null>(null)

  if (prPanelData?.PRStateLoading || (changesLoading && !!pullReqMetadata?.closed)) {
    return <SkeletonList />
  }

  return (
    <>
      <CommitSuggestionsDialog
        open={isCommitDialogOpen}
        onClose={() => setIsCommitDialogOpen(false)}
        onSuccess={onCommitSuggestionSuccess}
        suggestions={suggestionsBatch?.length ? suggestionsBatch : suggestionToCommit ? [suggestionToCommit] : null}
        prId={prId}
      />
      <PullRequestConversationView
        rebaseErrorMessage={rebaseErrorMessage}
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
          codeOwnerChangeReqEntries,
          codeOwnerPendingEntries,
          codeOwnerApprovalEntries,
          latestCodeOwnerApprovalArr,
          actions: mockPullRequestActions,
          checkboxBypass,
          setCheckboxBypass,
          onRestoreBranch,
          onDeleteBranch,
          showDeleteBranchButton,
          showRestoreBranchButton,
          headerMsg: errorMsg,
          commitSuggestionsBatchCount: suggestionsBatch?.length,
          onCommitSuggestions: onCommitSuggestionsBatch,
          toPRCheck: ({ pipelineId, executionId }) => routes.toExecution({ spaceId, repoId, pipelineId, executionId }),
          spaceId,
          repoId
        }}
        overviewProps={{
          toCommitDetails: ({ sha }) => routes.toRepoCommitDetails({ spaceId, repoId, commitSHA: sha }),
          handleUpdateDescription,
          handleDeleteComment: deleteComment,
          handleUpdateComment: updateComment,
          data: activities,
          pullReqMetadata,
          activityFilter: filtersData.activityFilter,
          dateOrderSort: filtersData.dateOrderSort,
          handleSaveComment,
          currentUser: {
            display_name: currentUserData?.display_name,
            uid: currentUserData?.uid
          },
          onCopyClick,
          toggleConversationStatus,
          onCommitSuggestion,
          addSuggestionToBatch,
          suggestionsBatch,
          removeSuggestionFromBatch,
          filenameToLanguage,
          handleUpload,
          toCode: ({ sha }: { sha: string }) => `${routes.toRepoFiles({ spaceId, repoId })}/${sha}`
        }}
        commentBoxProps={{
          comment,
          setComment,
          currentUser: currentUserData?.display_name,
          onSaveComment: handleSaveComment,
          handleUpload
        }}
        sideBarProps={{
          addReviewers: handleAddReviewer,
          usersList: principals as PrincipalType[],
          currentUserId: currentUserData?.uid,
          pullRequestMetadata: { source_sha: pullReqMetadata?.source_sha || '' },
          processReviewDecision,
          refetchReviewers,
          handleDelete: handleDeleteReviewer,
          addReviewerError,
          removeReviewerError,
          reviewers: reviewers?.map((val: TypesPullReqReviewer) => ({
            reviewer: {
              display_name: val.reviewer?.display_name || '',
              id: val.reviewer?.id || 0
            },
            review_decision: val.review_decision,
            sha: val.sha
          })),
          searchQuery: searchReviewers,
          setSearchQuery: setSearchReviewers,
          labelsList: labels,
          labelsValues,
          PRLabels: appliedLabels,
          searchLabelQuery: searchLabel,
          setSearchLabelQuery: changeSearchLabel,
          addLabel: handleAddLabel,
          removeLabel: handleRemoveLabel
        }}
      />
    </>
  )
}
