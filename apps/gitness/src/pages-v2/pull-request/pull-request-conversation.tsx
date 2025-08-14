import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import copy from 'clipboard-copy'
import { isEmpty } from 'lodash-es'

import {
  EnumCheckStatus,
  EnumMergeMethod,
  EnumPullReqState,
  mergePullReqOp,
  OpenapiMergePullReq,
  OpenapiStatePullReqRequest,
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
  useRebaseBranchMutation,
  useRestorePullReqSourceBranchMutation,
  useRevertPullReqOpMutation,
  useReviewerListPullReqQuery,
  useUpdatePullReqMutation
} from '@harnessio/code-service-client'
import { Skeleton } from '@harnessio/ui/components'
import {
  CodeOwnersData,
  DefaultReviewersDataProps,
  LatestCodeOwnerApprovalArrType,
  PRCommentFilterType,
  PRPanelData,
  PullRequestConversationPage as PullRequestConversationView,
  PullRequestPanelProps,
  TypesPullReq
} from '@harnessio/ui/views'

import CommitSuggestionsDialog from '../../components-v2/commit-suggestions-dialog'
import { useAppContext } from '../../framework/context/AppContext'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { useQueryState } from '../../framework/hooks/useQueryState'
import { PathParams } from '../../RouteDefinitions'
import { filenameToLanguage } from '../../utils/git-utils'
import { usePrConversationLabels } from './hooks/use-pr-conversation-labels'
import { usePrFilters } from './hooks/use-pr-filters'
import { usePRCommonInteractions } from './hooks/usePRCommonInteractions'
import {
  capitalizeFirstLetter,
  checkIfOutdatedSha,
  defaultReviewerResponseWithDecision,
  extractInfoForPRPanelChanges,
  extractInfoFromRuleViolationArr,
  findChangeReqDecisions,
  findWaitingDecisions,
  getUnifiedDefaultReviewersState,
  processReviewDecision
} from './pull-request-utils'
import { usePullRequestProviderStore } from './stores/pull-request-provider-store'
import { CodeOwnerReqDecision } from './types'

const getMockPullRequestActions = (
  handlePrState: (data: string) => void,
  handleMerge: (data: EnumMergeMethod) => void,
  pullReqMetadata?: TypesPullReq,
  prPanelData?: PRPanelData,
  isMerging?: boolean,
  setSelectedMergeMethod?: (method: EnumMergeMethod) => void
) => {
  return [
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
                setSelectedMergeMethod?.('squash')
                handleMerge('squash')
              },
              loading: isMerging,
              disabled: !prPanelData?.allowedMethods?.includes('squash')
            },
            {
              id: '1',
              title: 'Merge pull request',
              description: 'All commits from this branch will be added to the base branch via a merge commit.',
              action: () => {
                setSelectedMergeMethod?.('merge')
                handleMerge('merge')
              },
              loading: isMerging,
              disabled: !prPanelData?.allowedMethods?.includes('merge')
            },
            {
              id: '2',
              title: 'Rebase and merge',
              description: 'All commits from this branch will be rebased and added to the base branch.',
              action: () => {
                setSelectedMergeMethod?.('rebase')
                handleMerge('rebase')
              },
              loading: isMerging,
              disabled: !prPanelData?.allowedMethods?.includes('rebase')
            },
            {
              id: '3',
              title: 'Fast-forward merge',
              description:
                'All commits from this branch will be added to the base branch without a merge commit. Rebase may be required.',
              action: () => {
                setSelectedMergeMethod?.('fast-forward')
                handleMerge('fast-forward')
              },
              loading: isMerging,
              disabled: !prPanelData?.allowedMethods?.includes('fast-forward')
            }
          ])
  ]
}

const onCopyClick = (commentId?: number, isNotCodeComment = false) => {
  if (!commentId) return

  const url = new URL(window.location.href)

  if (isNotCodeComment) url.pathname = url.pathname.replace('/conversation', '/changes')

  url.searchParams.set('commentId', commentId.toString())
  copy(url.toString())
}

export default function PullRequestConversationPage() {
  const routes = useRoutes()
  const {
    pullReqMetadata,
    repoMetadata,
    refetchPullReq,
    refetchActivities,
    setRuleViolationArr,
    prPanelData,
    pullReqChecksDecision,
    updateCommentStatus,
    dryMerge,
    pullReqCommits
  } = usePullRequestProviderStore(state => ({
    dryMerge: state.dryMerge,
    pullReqMetadata: state.pullReqMetadata,
    refetchPullReq: state.refetchPullReq,
    refetchActivities: state.refetchActivities,
    setRuleViolationArr: state.setRuleViolationArr,
    prPanelData: state.prPanelData,
    pullReqChecksDecision: state.pullReqChecksDecision,
    updateCommentStatus: state.updateCommentStatus,
    pullReqCommits: state.pullReqCommits,
    repoMetadata: state.repoMetadata
  }))

  const { currentUser: currentUserData } = useAppContext()

  const [checkboxBypass, setCheckboxBypass] = useState(false)
  const [searchPrincipalsQuery, setSearchPrincipalsQuery] = useState('')
  const [addReviewerError, setAddReviewerError] = useState('')
  const [removeReviewerError, setRemoveReviewerError] = useState('')
  const [changesLoading, setChangesLoading] = useState(true)
  const [showDeleteBranchButton, setShowDeleteBranchButton] = useState(false)
  const [showRestoreBranchButton, setShowRestoreBranchButton] = useState(false)
  const [rebaseErrorMessage, setRebaseErrorMessage] = useState<string | null>(null)
  const [mergeErrorMessage, setMergeErrorMessage] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [comment, setComment] = useState<string>('')
  const [isScrolledToComment, setIsScrolledToComment] = useState(false)

  const [commentId] = useQueryState('commentId')
  const { spaceId, repoId } = useParams<PathParams>()
  const {
    scope: { accountId }
  } = useMFEContext()
  const repoRef = useGetRepoRef()
  const { pullRequestId } = useParams<PathParams>()

  const prId = (pullRequestId && Number(pullRequestId)) || -1

  const filtersData = usePrFilters()

  const navigate = useNavigate()

  const {
    data: { body: principals } = {},
    isLoading: isPrincipalsLoading,
    error: principalsError
  } = useListPrincipalsQuery({
    // @ts-expect-error : BE issue - not implemnted
    queryParams: { page: 1, limit: 100, type: 'user', query: searchPrincipalsQuery, accountIdentifier: accountId }
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
  const {
    searchLabel,
    changeSearchLabel,
    isLabelsLoading,
    assignableLabels,
    handleAddLabel,
    handleRemoveLabel,
    appliedLabels
  } = usePrConversationLabels({
    repoRef,
    prId,
    refetchData: refetchActivities
  })

  const { mutateAsync: restoreBranch } = useRestorePullReqSourceBranchMutation({})

  const onRestoreBranch = useCallback(() => {
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
  }, [restoreBranch, repoRef, prId, refetchActivities])

  const {
    data: { body: sourceBranch } = {},
    error: branchError,
    refetch: refetchBranch
  } = useGetBranchQuery(
    {
      repo_ref: repoRef,
      branch_name: pullReqMetadata?.source_branch || '',
      queryParams: { include_checks: true, include_rules: true }
    },
    {
      // Don't cache the result to ensure we always get fresh data
      cacheTime: 0,
      staleTime: 0
    }
  )

  const { mutateAsync: deleteBranch } = useDeletePullReqSourceBranchMutation({
    repo_ref: repoRef,
    pullreq_number: prId,
    queryParams: { dry_run_rules: true }
  })

  const { mutateAsync: revertPR } = useRevertPullReqOpMutation(
    {
      repo_ref: repoRef,
      pullreq_number: prId
    },
    {
      onSuccess: res => {
        navigate(
          routes.toPullRequestCompare({
            spaceId,
            repoId,
            diffRefs: `${pullReqMetadata?.target_branch || repoMetadata?.default_branch}...${res.body.branch}`
          })
        )
      },
      onError: error => {
        const revertBranchExistsRegex = /Branch\s+"([^"]+)"\s+already exists\./
        const match = error.message?.match(revertBranchExistsRegex)
        if (match) {
          const branchName = match[1]
          navigate(
            routes.toPullRequestCompare({
              spaceId,
              repoId,
              diffRefs: `${pullReqMetadata?.target_branch || repoMetadata?.default_branch}...${branchName}`
            })
          )
        } else {
          setErrorMsg(error.message || 'An error occurred while reverting the pull request.')
        }
      }
    }
  )

  const { mutateAsync: createBranch } = useCreateBranchMutation({})

  const { mutateAsync: updateTitle } = useUpdatePullReqMutation({
    repo_ref: repoRef,
    pullreq_number: Number(pullRequestId)
  })

  const handleUpdateDescription = useCallback(
    (title: string, description: string) => {
      return updateTitle({ body: { title, description } })
        .then(() => {
          refetchPullReq()
        })
        .catch(err => {
          throw err
        })
    },
    [updateTitle, refetchPullReq]
  )

  const onDeleteBranch = useCallback(() => {
    const onSuccessDeleteCommon = () => {
      setShowDeleteBranchButton(false)
      setShowRestoreBranchButton(true)
    }

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
            onSuccessDeleteCommon()
          }
        } else {
          onSuccessDeleteCommon()
        }

        setErrorMsg('')
        refetchActivities()
      })
      .catch(err => {
        setErrorMsg(err.message)
      })
  }, [deleteBranch, repoRef, prId, refetchBranch, refetchActivities])

  const onRevertPR = () => {
    revertPR({ body: {} }).catch(error => setErrorMsg(error.message))
  }

  useEffect(() => {
    if (sourceBranch && !branchError && (pullReqMetadata?.merged || pullReqMetadata?.closed)) {
      setShowDeleteBranchButton(true)
      setShowRestoreBranchButton(false)
      return
    }

    if ((branchError || !sourceBranch) && (pullReqMetadata?.merged || pullReqMetadata?.closed)) {
      setShowDeleteBranchButton(false)
      setShowRestoreBranchButton(true)
      return
    }

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

        setShowRestoreBranchButton(checkIfBypassAllowed)
        return
      }

      setShowRestoreBranchButton(true)
    })
  }, [branchError, sourceBranch, pullReqMetadata?.merged, pullReqMetadata?.closed])

  const [activities, setActivities] = useState<TypesPullReqActivity[] | undefined>(activityData)

  const { approvedEvaluations, changeReqEvaluations, latestApprovalArr, changeReqReviewer } = useMemo(() => {
    if (!reviewers)
      return {
        approvedEvaluations: [],
        changeReqEvaluations: [],
        latestApprovalArr: [],
        changeReqReviewer: 'Reviewer'
      }

    const { approvedEvaluations, changeReqEvaluations } = reviewers.reduce<{
      approvedEvaluations: TypesPullReqReviewer[]
      changeReqEvaluations: TypesPullReqReviewer[]
    }>(
      (acc, item) => {
        if (item.review_decision === 'approved') {
          acc.approvedEvaluations.push(item)
        } else if (item.review_decision === 'changereq') {
          acc.changeReqEvaluations.push(item)
        }

        return acc
      },
      { approvedEvaluations: [], changeReqEvaluations: [] }
    )

    const latestApprovalArr = approvedEvaluations?.filter(
      approved => !checkIfOutdatedSha(approved.sha, pullReqMetadata?.source_sha)
    )

    const changeReqReviewer = !isEmpty(changeReqEvaluations)
      ? capitalizeFirstLetter(
          changeReqEvaluations[0].reviewer?.display_name || changeReqEvaluations[0].reviewer?.uid || ''
        )
      : 'Reviewer'

    return {
      approvedEvaluations,
      changeReqEvaluations,
      latestApprovalArr,
      changeReqReviewer
    }
  }, [reviewers, pullReqMetadata?.source_sha])

  const codeOwnersData: CodeOwnersData = useMemo(() => {
    const data = codeOwners?.evaluation_entries
    const codeOwnerApprovalEntries = findChangeReqDecisions(data, CodeOwnerReqDecision.APPROVED)

    // TODO: This code was written by @Lee. It needs to be refactored.
    const latestCodeOwnerApprovalArr = codeOwnerApprovalEntries?.reduce<LatestCodeOwnerApprovalArrType[]>(
      (acc, entry) => {
        // Filter the owner_evaluations for 'changereq' decisions
        const entryEvaluation = entry?.owner_evaluations.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (evaluation: any) => !checkIfOutdatedSha(evaluation?.review_sha, pullReqMetadata?.source_sha)
        )

        // If there are any 'changereq' decisions, return the entry along with them
        if (entryEvaluation && !!entryEvaluation?.length) acc.push({ entryEvaluation })

        return acc
      },
      []
    )

    return {
      codeOwners: codeOwners,
      codeOwnerChangeReqEntries: findChangeReqDecisions(data, CodeOwnerReqDecision.CHANGEREQ),
      codeOwnerPendingEntries: findWaitingDecisions(
        data,
        pullReqMetadata?.source_sha ?? '',
        prPanelData?.reqCodeOwnerLatestApproval
      ),
      codeOwnerApprovalEntries,
      latestCodeOwnerApprovalArr,
      reqCodeOwnerApproval: prPanelData?.reqCodeOwnerApproval,
      reqCodeOwnerLatestApproval: prPanelData?.reqCodeOwnerLatestApproval
    }
  }, [
    codeOwners,
    pullReqMetadata?.source_sha,
    prPanelData?.reqCodeOwnerApproval,
    prPanelData?.reqCodeOwnerLatestApproval
  ])

  useEffect(() => {
    refetchCodeOwners()
  }, [pullReqMetadata, pullReqMetadata?.title, pullReqMetadata?.state, pullReqMetadata?.source_sha, refetchCodeOwners])

  useEffect(() => {
    setActivities(activityData)
  }, [activityData])

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

  const defaultReviewersData: DefaultReviewersDataProps = useMemo(() => {
    const updatedDefaultApprovals = reviewers
      ? defaultReviewerResponseWithDecision(reviewers, prPanelData?.defaultReviewersApprovals)
      : prPanelData?.defaultReviewersApprovals

    return {
      ...getUnifiedDefaultReviewersState(updatedDefaultApprovals),
      updatedDefaultApprovals,
      defaultReviewersApprovals: prPanelData?.defaultReviewersApprovals
    }
  }, [reviewers, prPanelData?.defaultReviewersApprovals])

  const changesInfo = useMemo(() => {
    return extractInfoForPRPanelChanges({
      approvedEvaluations,
      reqNoChangeReq: prPanelData?.atLeastOneReviewerRule,
      minApproval: prPanelData?.minApproval,
      minReqLatestApproval: prPanelData?.minReqLatestApproval,
      latestApprovalArr,
      changeReqReviewer,
      changeReqEvaluations,
      codeOwnersData,
      defaultReviewersData,
      mergeBlockedViaRule: prPanelData?.mergeBlockedViaRule
    })
  }, [
    prPanelData?.atLeastOneReviewerRule,
    prPanelData?.minApproval,
    prPanelData?.minReqLatestApproval,
    prPanelData?.mergeBlockedViaRule,
    approvedEvaluations,
    latestApprovalArr,
    changeReqReviewer,
    changeReqEvaluations,
    codeOwnersData,
    defaultReviewersData
  ])

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

  const handleAddReviewer = useCallback(
    (id?: number) => {
      reviewerAddPullReq({
        repo_ref: repoRef,
        pullreq_number: prId,
        body: { reviewer_id: id }
      })
        .then(() => refetchReviewers())
        .catch(error => setAddReviewerError(error.message))
    },
    [repoRef, prId, refetchReviewers]
  )

  const handleDeleteReviewer = (id: number) => {
    reviewerDeletePullReq({ repo_ref: repoRef, pullreq_number: prId, pullreq_reviewer_id: id })
      .then(() => refetchReviewers())
      .catch(error => setRemoveReviewerError(error.message))
  }

  const handleRefetchData = useCallback(() => {
    refetchCodeOwners()
    refetchPullReq()
    refetchActivities()
  }, [refetchCodeOwners, refetchPullReq, refetchActivities])

  const [mergeTitle, setMergeTitle] = useState(pullReqMetadata?.title || '')
  const [mergeMessage, setMergeMessage] = useState('')
  const [isMerging, setIsMerging] = useState(false)
  const { mutateAsync: performRebase, isLoading: isRebasing } = useRebaseBranchMutation(
    { repo_ref: repoRef },
    {
      onSuccess: () => {
        handleRefetchData()
        setRuleViolationArr(undefined)
      },
      onError: (error: any) => {
        setRebaseErrorMessage(error.message || 'Failed to rebase branch. Please try again.')
      }
    }
  )
  const [selectedMergeMethod, setSelectedMergeMethod] = useState<EnumMergeMethod | null>(null)

  // Update merge title based on selected merge method
  useEffect(() => {
    if (selectedMergeMethod && pullReqMetadata && repoMetadata) {
      if (selectedMergeMethod === 'squash') {
        setMergeTitle(`${pullReqMetadata.title} (#${pullReqMetadata.number})`)
      } else if (selectedMergeMethod === 'merge') {
        setMergeTitle(
          `Merge branch ${pullReqMetadata.source_branch} of ${repoMetadata.path} (#${pullReqMetadata.number})`
        )
      }
    }
  }, [selectedMergeMethod, pullReqMetadata, repoMetadata])

  const handleMergeMethodSelect = useCallback((method: string) => {
    setSelectedMergeMethod(method as EnumMergeMethod)
  }, [])

  const handleMerge = useCallback(
    (method: EnumMergeMethod) => {
      setIsMerging(true)
      const payload: OpenapiMergePullReq = {
        method: method,
        source_sha: pullReqMetadata?.source_sha,
        bypass_rules: checkboxBypass,
        dry_run: false
      }

      if (method === 'merge' || method === 'squash') {
        payload.title = mergeTitle
        payload.message = mergeMessage
      }

      mergePullReqOp({ body: payload, repo_ref: repoRef, pullreq_number: prId })
        .then((_res: any) => {
          handleRefetchData()
          setRuleViolationArr(undefined)
          refetchBranch()
          // if (res.body.branch_deleted) {
          //   setShowDeleteBranchButton(false)
          //   setShowRestoreBranchButton(true)
          // } else {
          //   setShowDeleteBranchButton(true)
          //   setShowRestoreBranchButton(false)
          // }
        })
        .catch((error: any) => {
          setMergeErrorMessage(error.message)
        })
        .finally(() => {
          setIsMerging(false)
        })
    },
    [
      pullReqMetadata?.source_sha,
      checkboxBypass,
      repoRef,
      prId,
      handleRefetchData,
      setRuleViolationArr,
      mergeTitle,
      mergeMessage
    ]
  )

  const handlePrState = useCallback(
    (state: string) => {
      const payload: OpenapiStatePullReqRequest = { state: state as EnumPullReqState }

      if (state === 'draft') {
        payload.is_draft = true
        payload.state = 'open'
      }

      statePullReq({ body: payload, repo_ref: repoRef, pullreq_number: prId }).then(() => {
        handleRefetchData()
        setRuleViolationArr(undefined)
      })
    },
    [handleRefetchData, setRuleViolationArr, repoRef, prId]
  )

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
    dryMerge
  })

  const handleRebaseBranch = useCallback(async () => {
    const payload: RebaseBranchRequestBody = {
      ...(pullReqMetadata?.target_branch
        ? {
            base_branch: pullReqMetadata.target_branch
          }
        : {}),
      bypass_rules: true,
      dry_run_rules: false,
      ...(pullReqMetadata?.source_branch
        ? {
            head_branch: pullReqMetadata.source_branch
          }
        : {}),
      ...(pullReqMetadata?.source_sha
        ? {
            head_commit_sha: pullReqMetadata.source_sha
          }
        : {})
    }

    await performRebase({ body: payload })
  }, [pullReqMetadata, performRebase])

  const handleViewUnresolvedComments = useCallback(() => {
    const shadowRoot = document.activeElement?.shadowRoot as ShadowRoot

    filtersData.setActivityFilter({
      label: 'Unresolved comments',
      value: PRCommentFilterType.UNRESOLVED_COMMENTS
    })
    const unresolvedComments = activities?.filter(
      activity => !activity.resolved && (activity.type === 'comment' || activity.code_comment)
    )
    if (unresolvedComments && unresolvedComments.length > 0) {
      const firstUnresolvedCommentId = unresolvedComments[0].id
      const firstUnresolvedCommentDiv = shadowRoot?.getElementById
        ? shadowRoot.getElementById(`comment-${firstUnresolvedCommentId}`)
        : document.getElementById(`comment-${firstUnresolvedCommentId}`)
      if (firstUnresolvedCommentDiv) {
        firstUnresolvedCommentDiv.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [filtersData, activities])

  /**
   * Memoize overviewProps
   */
  const overviewProps = useMemo(
    () => ({
      toCommitDetails: ({ sha }: { sha: string }) => routes.toRepoCommitDetails({ spaceId, repoId, commitSHA: sha }),
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
      toCode: ({ sha }: { sha: string }) => `${routes.toRepoFiles({ spaceId, repoId })}/${sha}`,
      spaceId,
      repoId
    }),
    [
      routes,
      handleUpdateDescription,
      deleteComment,
      updateComment,
      activities,
      pullReqMetadata,
      filtersData,
      handleSaveComment,
      currentUserData,
      toggleConversationStatus,
      onCommitSuggestion,
      addSuggestionToBatch,
      suggestionsBatch,
      removeSuggestionFromBatch,
      handleUpload,
      spaceId,
      repoId
    ]
  )

  /**
   * Memoize panelProps
   */
  const panelProps: PullRequestPanelProps = useMemo(() => {
    return {
      handleRebaseBranch,
      handlePrState,
      handleViewUnresolvedComments,
      changesInfo: {
        header: changesInfo.title,
        content: changesInfo.statusMessage,
        status: changesInfo.statusIcon
      },
      checks: pullReqChecksDecision?.data?.checks ?? [],
      checksInfo: {
        header: pullReqChecksDecision.checkInfo.title,
        content: pullReqChecksDecision.summaryText,
        status: pullReqChecksDecision?.checkInfo.status as EnumCheckStatus
      },
      prPanelData,
      pullReqCommits,
      error: mergeErrorMessage,
      // TODO: TypesPullReq is null for someone: vardan will look into why swagger is doing this
      pullReqMetadata,
      // TODO: add dry merge check into pr context
      approvedEvaluations,
      changeReqEvaluations,
      codeOwners,
      latestApprovalArr,
      changeReqReviewer,
      defaultReviewersData,
      codeOwnersData,
      actions: getMockPullRequestActions(
        handlePrState,
        handleMerge,
        pullReqMetadata,
        prPanelData,
        isMerging,
        setSelectedMergeMethod
      ),
      checkboxBypass,
      setCheckboxBypass,
      onRestoreBranch,
      onDeleteBranch,
      onRevertPR,
      showDeleteBranchButton,
      showRestoreBranchButton,
      headerMsg: errorMsg,
      commitSuggestionsBatchCount: suggestionsBatch?.length || 0,
      onCommitSuggestions: onCommitSuggestionsBatch,
      toPRCheck: ({ pipelineId, executionId }: { pipelineId: string; executionId: string }) =>
        routes.toExecution({ spaceId, repoId, pipelineId, executionId }),
      spaceId,
      repoId,
      mergeTitle,
      mergeMessage,
      setMergeTitle,
      setMergeMessage,
      isMerging,
      isRebasing,
      onMergeMethodSelect: handleMergeMethodSelect
    }
  }, [
    handleRebaseBranch,
    handlePrState,
    changesInfo.title,
    changesInfo.statusMessage,
    changesInfo.statusIcon,
    pullReqChecksDecision?.data?.checks,
    pullReqChecksDecision.checkInfo.title,
    pullReqChecksDecision.checkInfo.status,
    pullReqChecksDecision.summaryText,
    prPanelData,
    pullReqCommits,
    mergeErrorMessage,
    pullReqMetadata,
    approvedEvaluations,
    changeReqEvaluations,
    codeOwners,
    latestApprovalArr,
    changeReqReviewer,
    defaultReviewersData,
    codeOwnersData,
    handleMerge,
    checkboxBypass,
    onRestoreBranch,
    onDeleteBranch,
    onRevertPR,
    showDeleteBranchButton,
    showRestoreBranchButton,
    errorMsg,
    suggestionsBatch?.length,
    onCommitSuggestionsBatch,
    spaceId,
    repoId,
    mergeTitle,
    mergeMessage,
    routes,
    isMerging,
    isRebasing,
    setSelectedMergeMethod,
    handleMergeMethodSelect,
    handleViewUnresolvedComments
  ])

  if (prPanelData?.PRStateLoading || (changesLoading && !!pullReqMetadata?.closed)) {
    return <Skeleton.List />
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
        panelProps={panelProps}
        overviewProps={overviewProps}
        principalProps={{
          principals,
          searchPrincipalsQuery,
          setSearchPrincipalsQuery,
          isPrincipalsLoading,
          principalsError
        }}
        // TODO: create useMemo of commentBoxProps
        commentBoxProps={{
          comment,
          setComment,
          currentUser: currentUserData?.display_name,
          onSaveComment: handleSaveComment,
          handleUpload
        }}
        // TODO: create useMemo of sideBarProps
        sideBarProps={{
          addReviewers: handleAddReviewer,
          isLabelsLoading,
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
          assignableLabels: assignableLabels,
          PRLabels: appliedLabels,
          searchLabelQuery: searchLabel,
          setSearchLabelQuery: changeSearchLabel,
          addLabel: handleAddLabel,
          removeLabel: handleRemoveLabel,
          editLabelsProps: { to: routes.toRepoLabels({ spaceId, repoId }) }
        }}
      />
    </>
  )
}
PullRequestConversationPage.displayName = 'PullRequestConversationPage'
