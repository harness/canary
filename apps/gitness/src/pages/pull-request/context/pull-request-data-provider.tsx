import React, { createContext, useContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { isEqual } from 'lodash-es'
import { useAtom, atom } from 'jotai'
import {
  ChecksPullReqOkResponse,
  mergePullReqOp,
  RepoRepositoryOutput,
  TypesListCommitResponse,
  TypesMergeResponse,
  TypesPullReq,
  TypesPullReqActivity,
  TypesPullReqStats,
  TypesRuleViolations,
  useFindRepositoryQuery,
  useGetPullReqQuery,
  useListCommitsQuery,
  useListPullReqActivitiesQuery
} from '@harnessio/code-service-client'
import { normalizeGitRef } from '../../../utils/git-utils'
import { useGetSpaceURLParam } from '../../../framework/hooks/useGetSpaceParam'
import { useGetRepoRef } from '../../../framework/hooks/useGetRepoPath'
import { useParams } from 'react-router-dom'
import { PathParams } from '../../../RouteDefinitions'
import useSpaceSSE, { SSEEvents } from '../../../framework/hooks/useSpaceSSE'
import { usePRChecksDecision } from '../hooks/usePRChecksDecision'
import { ExecutionState } from '../../../types'
import { PullRequestState } from '../types/types'
import { extractSpecificViolations } from '../utils'
export const codeOwnersNotFoundMessage = 'CODEOWNERS file not found'
export const codeOwnersNotFoundMessage2 = `path "CODEOWNERS" not found`
export const codeOwnersNotFoundMessage3 = `failed to find node 'CODEOWNERS' in 'main': failed to get tree node: failed to ls file: path "CODEOWNERS" not found`
export const oldCommitRefetchRequired = 'A newer commit is available. Only the latest commit can be merged.'
export const prMergedRefetchRequired = 'Pull request already merged'
export const POLLING_INTERVAL = 10000

interface PullReqChecksDecisionProps {
  overallStatus: ExecutionState | undefined
  count: {
    error: number
    failure: number
    pending: number
    running: number
    success: number
    skipped: number
    killed: number
  }
  error: unknown
  data: ChecksPullReqOkResponse | undefined
  color: string
  background: string
  message: string
  summaryText: string
  checkInfo: {
    title: string
    content: string
    color: string
    status: string
  }
}

interface PullRequestDataContextProps {
  refetchPullReq: () => void
  refetchActivities: () => void
  pullReqMetadata: TypesPullReq | undefined
  repoMetadata: RepoRepositoryOutput | undefined
  // Add other necessary properties here
  loading: boolean

  setRuleViolationArr: (arr: { data: { rule_violations: TypesRuleViolations[] } } | undefined) => void
  pullReqChecksDecision: PullReqChecksDecisionProps
  prPanelData: {
    conflictingFiles: string[] | undefined
    requiresCommentApproval: boolean
    atLeastOneReviewerRule: boolean
    reqCodeOwnerApproval: boolean
    minApproval: number
    reqCodeOwnerLatestApproval: boolean
    minReqLatestApproval: number
    resolvedCommentArr?: { params: number[] }
    PRStateLoading: boolean
    ruleViolation: boolean
    commentsInfoData: { header: string; content?: string | undefined; status: string }
    ruleViolationArr:
      | {
          data: {
            rule_violations: TypesRuleViolations[]
          }
        }
      | undefined
  }
}

const PullRequestDataContext = createContext<PullRequestDataContextProps | undefined>(undefined)

export const usePullRequestData = () => {
  const context = useContext(PullRequestDataContext)
  if (!context) {
    throw new Error('usePullRequestData must be used within a PullRequestDataProvider')
  }
  return context
}

interface PullRequestDataProviderProps {
  children: ReactNode
}

const PullRequestDataProvider: React.FC<PullRequestDataProviderProps> = ({ children }) => {
  const space = useGetSpaceURLParam() ?? ''
  const repoRef = useGetRepoRef()
  const { data: repoMetadata } = useFindRepositoryQuery({ repo_ref: repoRef })
  const { pullRequestId } = useParams<PathParams>()

  //   const {
  //     // repoMetadata,
  //     // error: repoError,
  //     // loading: repoLoading,
  //     // refetch: refetchRepo,
  //     // pullRequestId,
  //     pullRequestSection = PullRequestSection.CONVERSATION,
  //     commitSHA
  //   } = useGetRepositoryMetadata()

  const {
    data: pullReqData,
    error: pullReqError,
    isFetching: pullReqLoading,
    refetch: refetchPullReq
  } = useGetPullReqQuery({
    repo_ref: repoRef,
    pullreq_number: Number(pullRequestId)
  })

  const [showEditDescription, setShowEditDescription] = useState(false)

  useSpaceSSE({
    space,
    events: useMemo(() => [SSEEvents.PULLREQ_UPDATED], []),
    onEvent: useCallback(
      (data: TypesPullReq) => {
        if (data && String(data?.number) === pullRequestId) {
          refetchPullReq()
        }
      },
      [pullRequestId, refetchPullReq]
    )
  })

  const [pullReqMetadata, setPullReqMetadata] = useAtom(pullReqAtom)
  const [pullReqStats, setPullReqStats] = useAtom(pullReqStatsAtom)
  const isClosed = pullReqMetadata?.state === PullRequestState.CLOSED
  const [conflictingFiles, setConflictingFiles] = useState<string[]>()
  const [ruleViolation, setRuleViolation] = useState(false)
  const [ruleViolationArr, setRuleViolationArr] = useState<{ data: { rule_violations: TypesRuleViolations[] } }>()
  const [requiresCommentApproval, setRequiresCommentApproval] = useState(false)
  const [atLeastOneReviewerRule, setAtLeastOneReviewerRule] = useState(false)
  const [reqCodeOwnerApproval, setReqCodeOwnerApproval] = useState(false)
  const [minApproval, setMinApproval] = useState(0)
  const [reqCodeOwnerLatestApproval, setReqCodeOwnerLatestApproval] = useState(false)
  const [minReqLatestApproval, setMinReqLatestApproval] = useState(0)

  const [resolvedCommentArr, setResolvedCommentArr] = useState<{ params: number[] }>()
  const [PRStateLoading, setPRStateLoading] = useState(isClosed ? false : true)
  const [commentsInfoData, setCommentsInfoData] = useState<{ header: string; content?: string; status: string }>({
    header: '',
    content: '',
    status: ''
  })
  const pullReqChecksDecision = usePRChecksDecision({
    repoMetadata,
    pullReqMetadata
  })

  const {
    data: activities,
    isFetching: activitiesLoading,
    error: activitiesError,
    refetch: refetchActivities
  } = useListPullReqActivitiesQuery({
    repo_ref: repoRef,
    pullreq_number: Number(pullRequestId),
    queryParams: {}
  })

  const [pullReqActivities, setPullReqActivities] = useAtom(pullReqActivitiesAtom)
  const [pullReqCommits, setPullReqCommits] = useAtom(pullReqCommitsAtom)

  const loading = useMemo(
    () =>
      // repoLoading ||
      (pullReqLoading && !pullReqMetadata) || (activitiesLoading && !pullReqActivities),
    [
      // repoLoading,
      pullReqLoading,
      pullReqMetadata,
      activitiesLoading,
      pullReqActivities
    ]
  )
  useEffect(() => {
    const resolvedComments = requiresCommentApproval && !resolvedCommentArr?.params ? true : false

    if (resolvedComments) {
      setCommentsInfoData({ header: 'All comments are resolved', content: undefined, status: 'success' })
    } else {
      setCommentsInfoData({
        header: 'Unresolved comments',
        content: `There are ${resolvedCommentArr?.params} unresolved comments`,
        status: 'failed'
      })
    }
  }, [requiresCommentApproval, resolvedCommentArr?.params, setCommentsInfoData])

  useEffect(() => {
    if (activities) {
      setPullReqActivities(oldActivities => (isEqual(oldActivities, activities) ? oldActivities : activities))
      dryMerge()
    }
  }, [activities, setPullReqActivities])

  useEffect(() => {
    return () => {
      setPullReqMetadata(undefined)
      setPullReqActivities(undefined)
      setPullReqCommits(undefined)
      setPullReqStats(undefined)
    }
  }, [setPullReqMetadata, setPullReqActivities, setPullReqCommits, setPullReqStats])

  const {
    data: commits,
    error: commitsError,
    refetch: refetchCommits
  } = useListCommitsQuery({
    queryParams: {
      limit: COMMITS_LIMIT,
      git_ref: normalizeGitRef(pullReqData?.source_sha),
      after: normalizeGitRef(pullReqData?.merge_base_sha)
    },
    repo_ref: repoRef
  })

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (pullReqMetadata?.source_sha) {
        dryMerge()
      }
    }, POLLING_INTERVAL) // Poll every 20 seconds
    // Cleanup interval on component unmount
    return () => {
      clearInterval(intervalId)
    }
  }, [pullReqMetadata, pullRequestId, refetchPullReq])

  useEffect(() => {
    if (ruleViolationArr) {
      const requireResCommentRule = extractSpecificViolations(ruleViolationArr, 'pullreq.comments.require_resolve_all')
      if (requireResCommentRule) {
        setResolvedCommentArr(requireResCommentRule[0])
      }
    }
  }, [ruleViolationArr, pullReqMetadata, repoMetadata, ruleViolation])

  useEffect(() => {
    if (pullReqData && !isEqual(pullReqMetadata, pullReqData)) {
      if (
        !pullReqMetadata ||
        (pullReqMetadata &&
          (pullReqMetadata.merge_base_sha !== pullReqData.merge_base_sha ||
            pullReqMetadata.source_sha !== pullReqData.source_sha))
      ) {
        refetchCommits()
      }

      setPullReqMetadata(pullReqData)

      if (!isEqual(pullReqStats, pullReqData.stats)) {
        setPullReqStats(pullReqData.stats)
        refetchActivities()
      }
    }
  }, [
    pullReqData,
    pullReqMetadata,
    setPullReqMetadata,
    setPullReqStats,
    pullReqStats,
    refetchActivities,
    refetchCommits
  ])
  useEffect(() => {
    if (commits && !isEqual(commits, pullReqCommits)) {
      // @ts-expect-error remove "@ts-expect-error" once CodeServiceClient Response for useListCommitsQuery is fixed
      setPullReqCommits(commits?.commits)
    }
  }, [commits, pullReqCommits, setPullReqCommits])

  const dryMerge = () => {
    if (
      // isMounted.current &&
      !isClosed &&
      pullReqMetadata?.state !== PullRequestState.MERGED
    ) {
      // Use an internal flag to prevent flickering during the loading state of buttons
      // internalFlags.current.dryRun = true

      // ******
      // NOTE: Since this is in the data provider/context, i set all the necessary information from the rule violation
      // arr that i can use to determine the states in the pr panel and i can get this information from the hook
      // usePullRequestData
      // ****
      mergePullReqOp({
        repo_ref: `${repoMetadata?.path}/+`,
        pullreq_number: Number(pullRequestId),
        body: { bypass_rules: true, dry_run: true, source_sha: pullReqMetadata?.source_sha }
      })
        .then((res: TypesMergeResponse) => {
          // if (isMounted.current) {

          if (res?.rule_violations?.length && res?.rule_violations?.length > 0) {
            setRuleViolation(true)
            setRuleViolationArr({ data: { rule_violations: res?.rule_violations } })
            // TODO: fix allowed strats to work with this structure
            // setAllowedStrats(res.allowed_methods)
            setRequiresCommentApproval?.(res.requires_comment_resolution ?? false)
            setAtLeastOneReviewerRule?.(res.requires_no_change_requests ?? false)
            setReqCodeOwnerApproval?.(res.requires_code_owners_approval ?? false)
            setMinApproval?.(res.minimum_required_approvals_count ?? 0)
            setReqCodeOwnerLatestApproval?.(res.requires_code_owners_approval_latest ?? false)
            setMinReqLatestApproval?.(res.minimum_required_approvals_count_latest ?? 0)
            setConflictingFiles?.(res.conflict_files)
          } else {
            setRuleViolation(false)
            // TODO: fix allowed strats to work with this structure
            // setAllowedStrats(res.allowed_methods)
            setRequiresCommentApproval?.(res.requires_comment_resolution ?? false)
            setAtLeastOneReviewerRule?.(res.requires_no_change_requests ?? false)
            setReqCodeOwnerApproval?.(res.requires_code_owners_approval ?? false)
            setMinApproval?.(res.minimum_required_approvals_count ?? 0)
            setReqCodeOwnerLatestApproval?.(res.requires_code_owners_approval_latest ?? false)
            setMinReqLatestApproval?.(res.minimum_required_approvals_count_latest ?? 0)
            setConflictingFiles?.(res.conflict_files)
          }
        })
        .catch(err => {
          // if (isMounted.current) {
          if (err.status === 422) {
            setRuleViolation(true)
            setRuleViolationArr(err)
            // setAllowedStrats(err.allowed_methods)
            setRequiresCommentApproval?.(err.requires_comment_resolution)
            setAtLeastOneReviewerRule?.(err.requires_no_change_requests)
            setReqCodeOwnerApproval?.(err.requires_code_owners_approval)
            setMinApproval?.(err.minimum_required_approvals_count)
            setReqCodeOwnerLatestApproval?.(err.requires_code_owners_approval_latest)
            setMinReqLatestApproval?.(err.minimum_required_approvals_count_latest)
            setConflictingFiles?.(err.conflict_files)
          } else if (
            err.status === 400
            // &&
            // (getErrorMessage(err) === oldCommitRefetchRequired || getErrorMessage(err) === prMergedRefetchRequired)
          ) {
            refetchPullReq()
          } else if (
            // getErrorMessage(err) === codeOwnersNotFoundMessage ||
            // getErrorMessage(err) === codeOwnersNotFoundMessage2 ||
            // getErrorMessage(err) === codeOwnersNotFoundMessage3 ||
            err.status === 423 // resource locked (merge / dry-run already ongoing)
          ) {
            return
            // } else if (pullRequestSection !== PullRequestSection.CONVERSATION) {
            //   return
          } else {
            // showError(getErrorMessage(err))
          }
          // }
        })
        .finally(() => {
          // internalFlags.current.dryRun = false
          setPRStateLoading?.(false)
        })
    }
  }
  const retryOnErrorFunc = useMemo(() => {
    return () =>
      //   repoError
      //     ? refetchRepo()
      //     :
      pullReqError ? refetchPullReq() : commitsError ? refetchCommits() : refetchActivities()
  }, [
    // repoError, refetchRepo,
    pullReqError,
    refetchPullReq,
    refetchActivities,
    commitsError,
    refetchCommits
  ])

  const contextValue = {
    repoMetadata,
    // refetchRepo,
    loading,
    error:
      // repoError ||
      pullReqError || activitiesError || commitsError,
    pullReqChecksDecision,
    showEditDescription,
    setShowEditDescription,
    pullReqMetadata,
    pullReqStats,
    pullReqCommits,
    // pullRequestId,
    // pullRequestSection,
    // commitSHA,
    setRuleViolationArr,
    refetchActivities,
    refetchCommits,
    refetchPullReq,
    retryOnErrorFunc,
    prPanelData: {
      conflictingFiles,
      requiresCommentApproval,
      atLeastOneReviewerRule,
      reqCodeOwnerApproval,
      minApproval,
      reqCodeOwnerLatestApproval,
      minReqLatestApproval,
      resolvedCommentArr,
      PRStateLoading,
      ruleViolation,
      ruleViolationArr,
      commentsInfoData
    }
  }

  return <PullRequestDataContext.Provider value={contextValue}>{children}</PullRequestDataContext.Provider>
}

export const pullReqAtom = atom<TypesPullReq | undefined>(undefined)
const pullReqStatsAtom = atom<TypesPullReqStats | undefined>(undefined)
export const pullReqActivitiesAtom = atom<TypesPullReqActivity[] | undefined>(undefined)
const pullReqCommitsAtom = atom<TypesListCommitResponse | undefined>(undefined)

const COMMITS_LIMIT = 500

export default PullRequestDataProvider
