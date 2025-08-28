import { FC, HTMLAttributes, PropsWithChildren, useCallback, useEffect, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'

import { isEqual } from 'lodash-es'

import {
  TypesPullReq,
  useFindRepositoryQuery,
  useGetPullReqQuery,
  useListCommitsQuery,
  useListPullReqActivitiesQuery
} from '@harnessio/code-service-client'
import { RepoRepositoryOutput } from '@harnessio/ui/views'

import { eventManager } from '../../framework/event/EventManager'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import useSpaceSSEWithPubSub from '../../framework/hooks/useSpaceSSEWithPubSub'
import useGetPullRequestTab, { PullRequestTab } from '../../hooks/useGetPullRequestTab'
import { PathParams } from '../../RouteDefinitions'
import { SSEEvent } from '../../types'
import { normalizeGitRef } from '../../utils/git-utils'
import { usePRChecksDecision } from './hooks/usePRChecksDecision'
import { extractSpecificViolations, getCommentsInfoData } from './pull-request-utils'
import { POLLING_INTERVAL, PR_RULES, usePullRequestProviderStore } from './stores/pull-request-provider-store'

const PullRequestDataProvider: FC<PropsWithChildren<HTMLAttributes<HTMLElement>>> = ({ children }) => {
  const spaceURL = useGetSpaceURLParam() ?? ''
  const repoRef = useGetRepoRef()
  const { pullRequestId, spaceId, repoId } = useParams<PathParams>()
  const pullRequestTab = useGetPullRequestTab({ spaceId, repoId, pullRequestId })
  const { data: { body: repoMetadata } = {} } = useFindRepositoryQuery(
    { repo_ref: repoRef },
    {
      onSuccess: data => {
        setRepoMetadata(data.body)
      }
    }
  )
  const store = usePullRequestProviderStore()
  const {
    pullReqMetadata,
    dryMerge,
    setCommentsInfoData,
    setCommentsLoading,
    prPanelData,
    setResolvedCommentArr,
    setPullReqMetadata,
    setRepoMetadata,
    setPullReqCommits,
    pullReqCommits,
    setRefreshNeeded,
    refreshNeeded
  } = store

  const {
    data: { body: pullReqData } = {},
    error: pullReqError,
    isFetching: pullReqLoading,
    refetch: refetchPullReq
  } = useGetPullReqQuery({
    repo_ref: repoRef,
    pullreq_number: Number(pullRequestId),
    queryParams: {}
  })

  const {
    data: { body: activities } = {},
    isFetching: activitiesLoading,
    error: activitiesError,
    refetch: refetchActivities
  } = useListPullReqActivitiesQuery({
    repo_ref: repoRef,
    pullreq_number: Number(pullRequestId),
    queryParams: {}
  })
  const {
    data: { body: commits } = {},
    error: commitsError,
    refetch: refetchCommits
  } = useListCommitsQuery({
    queryParams: {
      limit: 500,
      git_ref: normalizeGitRef(pullReqData?.source_sha),
      after: normalizeGitRef(pullReqData?.merge_base_sha)
    },
    repo_ref: repoRef
  })
  const pullReqChecksDecision = usePRChecksDecision({ repoMetadata, pullReqMetadata: pullReqData })
  const prevTabRef = useRef<PullRequestTab | undefined>(undefined)

  const handleEvent = useCallback(
    (data: TypesPullReq) => {
      if (data && String(data?.number) === pullRequestId) {
        // If we're in Changes tab, don't automatically refresh to avoid losing active comment edits

        refetchPullReq().then(response => {
          const newPRData = response?.data?.body
          if (
            // TODO : Remove the SHA comparison logic once the SSE is fixed to handle push events
            (prevTabRef.current === PullRequestTab.CHANGES || pullRequestTab === PullRequestTab.CHANGES) &&
            (pullReqMetadata?.source_sha !== newPRData?.source_sha ||
              pullReqMetadata?.merge_base_sha !== newPRData?.merge_base_sha)
          ) {
            setRefreshNeeded(true)
          }
        })
      }
    },
    [pullRequestId, refetchPullReq, pullRequestTab, setRefreshNeeded, pullReqMetadata]
  )

  useEffect(() => {
    prevTabRef.current = pullRequestTab || undefined
    if (pullRequestTab !== PullRequestTab.CHANGES) {
      setRefreshNeeded(false)
    }
  }, [pullRequestTab, setRefreshNeeded])

  // Use the singleton SSE connection manager for a persistent connection
  useSpaceSSEWithPubSub({
    space: spaceURL
  })

  // Subscribe to the specific event
  useEffect(() => {
    if (spaceURL && pullRequestId) {
      const unsubscribe = eventManager.subscribe(SSEEvent.PULLREQ_UPDATED, handleEvent)

      // Cleanup subscription when component unmounts or dependencies change
      return unsubscribe
    }
  }, [spaceURL, pullRequestId, handleEvent])

  // TODO : Remove the SHA comparison logic once the SSE is fixed to handle push events
  const shouldUpdatePullReqState = useMemo(() => {
    return (
      pullRequestTab !== PullRequestTab.CHANGES ||
      (pullReqMetadata?.source_sha === pullReqData?.source_sha &&
        pullReqMetadata?.merge_base_sha === pullReqData?.merge_base_sha) ||
      !refreshNeeded
    )
  }, [pullRequestTab, pullReqMetadata, pullReqData, refreshNeeded])

  useEffect(() => {
    if (!pullReqData || isEqual(pullReqMetadata, pullReqData)) return

    // Always update when PR number changes (indicating navigation to a different PR)
    const isDifferentPR = pullReqMetadata?.number !== pullReqData?.number
    if (shouldUpdatePullReqState || isDifferentPR) {
      setPullReqMetadata(pullReqData)
    }

    const mergeBaseChanged = pullReqMetadata?.merge_base_sha !== pullReqData?.merge_base_sha
    const sourceShaChanged = pullReqMetadata?.source_sha !== pullReqData?.source_sha

    if (mergeBaseChanged || sourceShaChanged) {
      refetchCommits()
    }
  }, [pullReqData, pullReqMetadata, setPullReqMetadata, refetchCommits, refreshNeeded, shouldUpdatePullReqState])

  useEffect(() => {
    const hasChanges =
      !isEqual(store.pullReqMetadata, pullReqData) ||
      !isEqual(store.pullReqCommits, commits) ||
      !isEqual(store.pullReqActivities, activities) ||
      !isEqual(store.pullReqChecksDecision, pullReqChecksDecision)

    // Always update when PR number changes (different PR) to ensure fresh data
    const isDifferentPR = store.pullReqMetadata?.number !== pullReqData?.number
    if (hasChanges || isDifferentPR) {
      setResolvedCommentArr(undefined)
      shouldUpdatePullReqState &&
        store.updateState({
          repoMetadata: repoMetadata as RepoRepositoryOutput,
          setPullReqMetadata,
          pullReqMetadata: pullReqData ? pullReqData : undefined,
          pullReqCommits: commits,
          pullReqActivities: activities,
          loading: pullReqLoading || activitiesLoading,
          error: pullReqError || activitiesError || commitsError,
          pullReqChecksDecision,
          refetchActivities,
          refetchCommits,
          refetchPullReq,
          retryOnErrorFunc: () => {
            if (pullReqError) {
              refetchPullReq()
            } else if (commitsError) {
              refetchCommits()
            } else {
              refetchActivities()
            }
          },
          prPanelData: {
            ...prPanelData,
            resolvedCommentArr: undefined,
            commentsInfoData: prPanelData?.commentsInfoData
          }
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    repoMetadata,
    pullReqData,
    commits,
    activities,
    pullReqLoading,
    activitiesLoading,
    pullReqError,
    activitiesError,
    commitsError,
    prPanelData,
    pullReqChecksDecision,
    refetchActivities,
    refetchCommits,
    refetchPullReq,
    setCommentsInfoData,
    setResolvedCommentArr,
    shouldUpdatePullReqState
  ])

  useEffect(() => {
    if (!pullReqMetadata?.source_sha || pullRequestTab !== PullRequestTab.CONVERSATION || !repoRef) return

    // Immediate call
    dryMerge()

    const intervalId = setInterval(dryMerge, POLLING_INTERVAL)

    return () => clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pullReqMetadata?.state, pullReqMetadata?.source_sha, repoMetadata?.path, pullRequestTab, repoRef])

  useEffect(() => {
    setCommentsInfoData(
      getCommentsInfoData({
        requiresCommentApproval: prPanelData.requiresCommentApproval,
        resolvedCommentArrParams: prPanelData.resolvedCommentArr?.params
      })
    )
    setCommentsLoading(false)
  }, [
    prPanelData.requiresCommentApproval,
    prPanelData.resolvedCommentArr?.params,
    setCommentsInfoData,
    setCommentsLoading
  ])

  useEffect(() => {
    if (commits && !isEqual(commits, pullReqCommits)) {
      setPullReqCommits(commits)
    }
  }, [commits, pullReqCommits, setPullReqCommits])

  useEffect(() => {
    const ruleViolationArr = prPanelData.ruleViolationArr

    const requireResCommentRule = extractSpecificViolations(ruleViolationArr, PR_RULES.REQUIRE_RESOLVE_ALL)
    setResolvedCommentArr(requireResCommentRule?.[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prPanelData.ruleViolationArr, pullReqMetadata, repoMetadata, prPanelData.ruleViolation])

  return <>{children}</>
}

export default PullRequestDataProvider
