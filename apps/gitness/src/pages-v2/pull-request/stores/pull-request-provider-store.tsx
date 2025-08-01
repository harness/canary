import { produce } from 'immer'
import { isEmpty, isEqual } from 'lodash-es'
import { create } from 'zustand'

import { commentStatusPullReq as apiCommentStatusPullReq, mergePullReqOp } from '@harnessio/code-service-client'
import { CodeCommentState, DiffStatistics, PullRequestDataState, PullRequestState } from '@harnessio/ui/views'

import { extractSpecificViolations, getCommentsInfoData } from '../pull-request-utils'

export const codeOwnersNotFoundMessage = 'CODEOWNERS file not found'
export const codeOwnersNotFoundMessage2 = `path "CODEOWNERS" not found`
export const codeOwnersNotFoundMessage3 = `failed to find node 'CODEOWNERS' in 'main': failed to get tree node: failed to ls file: path "CODEOWNERS" not found`
export const oldCommitRefetchRequired = 'A newer commit is available. Only the latest commit can be merged.'
export const prMergedRefetchRequired = 'Pull request already merged'
export const POLLING_INTERVAL = 10000

export enum PR_RULES {
  REQUIRE_RESOLVE_ALL = 'pullreq.comments.require_resolve_all',
  MERGE_BLOCK = 'pullreq.merge.block'
}

export const usePullRequestProviderStore = create<PullRequestDataState>((set, get) => ({
  repoMetadata: undefined,
  setRepoMetadata: metadata =>
    set(
      produce(draft => {
        draft.repoMetadata = metadata
      })
    ),
  pullReqMetadata: undefined,
  pullReqStats: undefined,
  pullReqCommits: undefined,
  pullReqActivities: undefined,
  loading: false,
  error: null,
  pullReqChecksDecision: {
    overallStatus: undefined,
    count: {
      error: 0,
      failure: 0,
      pending: 0,
      running: 0,
      success: 0,
      skipped: 0,
      killed: 0
    },
    error: null,
    data: undefined,
    color: '',
    background: '',
    message: '',
    summaryText: '',
    checkInfo: {
      title: '',
      content: '',
      color: '',
      status: ''
    }
  },

  showEditDescription: false,
  diffStats: {
    additions: 0,
    commits: 0,
    deletions: 0,
    files_changed: 0
  },
  setShowEditDescription: show =>
    set(
      produce(draft => {
        draft.showEditDescription = show
      })
    ),
  setRuleViolationArr: arr =>
    set(
      produce(draft => {
        draft.prPanelData.ruleViolationArr = arr
      })
    ),
  refetchActivities: () => {},
  refetchCommits: () => {},
  refetchPullReq: () => {},
  retryOnErrorFunc: () => {},
  dryMerge: () => {
    const { repoMetadata, pullReqMetadata, refetchPullReq, prPanelData: currentPrPanelData } = get()

    const isClosed = pullReqMetadata?.state === PullRequestState.CLOSED

    if (!isClosed && repoMetadata?.path !== undefined && pullReqMetadata?.state !== PullRequestState.MERGED) {
      mergePullReqOp({
        repo_ref: `${repoMetadata?.path}/+`,
        pullreq_number: Number(pullReqMetadata?.number),
        body: { bypass_rules: true, dry_run: true, source_sha: pullReqMetadata?.source_sha }
      })
        .then(({ body: res }) => {
          const requiresCommentApproval = res?.requires_comment_resolution ?? false
          const ruleViolationArr = res?.rule_violations ? { data: { rule_violations: res.rule_violations } } : undefined
          const resolvedCommentArr = extractSpecificViolations(ruleViolationArr, PR_RULES.REQUIRE_RESOLVE_ALL)?.[0]
          const mergeBlockedViaRule = !isEmpty(extractSpecificViolations(ruleViolationArr, 'pullreq.merge.blocked'))

          const newPrPanelData = {
            requiresCommentApproval,
            ruleViolationArr,
            resolvedCommentArr,
            mergeBlockedViaRule,
            ruleViolation: !!res?.rule_violations?.length,
            atLeastOneReviewerRule: res?.requires_no_change_requests ?? false,
            reqCodeOwnerApproval: res?.requires_code_owners_approval ?? false,
            minApproval: res?.minimum_required_approvals_count ?? 0,
            reqCodeOwnerLatestApproval: res?.requires_code_owners_approval_latest ?? false,
            minReqLatestApproval: res?.minimum_required_approvals_count_latest ?? 0,
            conflictingFiles: res?.conflict_files,
            allowedMethods: res?.allowed_methods,
            PRStateLoading: false,
            commentsLoading: false,
            commentsInfoData: getCommentsInfoData({
              requiresCommentApproval,
              resolvedCommentArrParams: resolvedCommentArr?.params
            }),
            defaultReviewersApprovals: res?.default_reviewer_aprovals
          }

          // We are adding data object comparison,
          // as previously the store values would change every time, even if the data was the same.
          const isDataChanged = !isEqual(newPrPanelData, currentPrPanelData)

          if (!isDataChanged) return

          set(
            produce(draft => {
              draft.prPanelData = newPrPanelData
            })
          )
        })
        .catch(err => {
          set(
            produce(draft => {
              if (err.status === 422) {
                draft.prPanelData = {
                  ruleViolation: true,
                  ruleViolationArr: err,
                  requiresCommentApproval: err.requires_comment_resolution ?? false,
                  atLeastOneReviewerRule: err.requires_no_change_requests ?? false,
                  reqCodeOwnerApproval: err.requires_code_owners_approval ?? false,
                  minApproval: err.minimum_required_approvals_count ?? 0,
                  reqCodeOwnerLatestApproval: err.requires_code_owners_approval_latest ?? false,
                  minReqLatestApproval: err.minimum_required_approvals_count_latest ?? 0,
                  conflictingFiles: err.conflict_files,
                  allowedMethods: err.allowed_methods,
                  PRStateLoading: false,
                  commentsLoading: false,
                  commentsInfoData: {
                    header: '',
                    content: undefined,
                    status: ''
                  }
                }
              } else if (err.status === 400) {
                refetchPullReq()
              } else if (
                [codeOwnersNotFoundMessage, codeOwnersNotFoundMessage2, codeOwnersNotFoundMessage3].includes(
                  err.message
                ) ||
                err.status === 423 // resource locked (merge / dry-run already ongoing)
              ) {
                return
              }
            })
          )
        })
        .finally(() => {
          set(
            produce(draft => {
              draft.prPanelData.PRStateLoading = false
            })
          )
        })
    } else if (
      pullReqMetadata?.state === PullRequestState.MERGED ||
      pullReqMetadata?.state === PullRequestState.CLOSED
    ) {
      set(
        produce(draft => {
          draft.prPanelData.PRStateLoading = false
        })
      )
    }
  },
  diffs: [],
  setDiffs: (info: { path?: string; raw?: string; fileViews?: Map<string, string> }) =>
    set(
      produce(draft => {
        draft.diffs = info
      })
    ),
  prPanelData: {
    conflictingFiles: undefined,
    requiresCommentApproval: false,
    atLeastOneReviewerRule: false,
    reqCodeOwnerApproval: false,
    minApproval: 0,
    reqCodeOwnerLatestApproval: false,
    minReqLatestApproval: 0,
    resolvedCommentArr: undefined,
    PRStateLoading: true,
    ruleViolation: false,
    allowedMethods: undefined,
    commentsLoading: false,
    commentsInfoData: {
      header: '',
      content: undefined,
      status: ''
    },
    ruleViolationArr: undefined,
    mergeBlockedViaRule: false
  },
  updateCommentStatus: async (
    repoRef: string,
    pullReqNumber: number,
    commentId: number,
    status: string,
    refetchActivities: () => void
  ) => {
    const payload = { status: status.toLowerCase() as CodeCommentState }
    try {
      const data = await apiCommentStatusPullReq({
        repo_ref: repoRef,
        pullreq_number: pullReqNumber,
        pullreq_comment_id: commentId,
        body: payload
      })
      refetchActivities()
      return data
    } catch (error) {
      console.warn(error)
      return undefined
    }
  },
  setCommentsInfoData: info =>
    set(
      produce(draft => {
        draft.prPanelData.commentsInfoData = info
      })
    ),
  setResolvedCommentArr: resolvedCommentArr =>
    set(
      produce(draft => {
        draft.prPanelData.resolvedCommentArr = resolvedCommentArr
      })
    ),
  setCommentsLoading: loading =>
    set(
      produce(draft => {
        draft.prPanelData.commentsLoading = loading
      })
    ),
  setPullReqMetadata: metadata =>
    set(
      produce(draft => {
        draft.pullReqMetadata = metadata
      })
    ),
  setPullReqCommits: commits =>
    set(
      produce(draft => {
        draft.pullReqCommits = commits
      })
    ),
  setPullReqStats: stats =>
    set(
      produce(draft => {
        draft.pullReqStats = stats
      })
    ),
  updateState: newState =>
    set(
      produce(draft => {
        Object.assign(draft, newState)
      })
    ),
  setDiffStats: (diffStats: DiffStatistics) =>
    set(
      produce(draft => {
        draft.diffStats = diffStats
      })
    )
}))
