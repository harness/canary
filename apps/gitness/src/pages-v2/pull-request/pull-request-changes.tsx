import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { DiffModeEnum } from '@git-diff-view/react'
import copy from 'clipboard-copy'
import * as Diff2Html from 'diff2html'
import { atom, useAtom } from 'jotai'

import {
  commentCreatePullReq,
  EnumPullReqReviewDecision,
  rawDiff,
  reviewSubmitPullReq,
  TypesPullReqActivity,
  useDiffStatsQuery,
  useFileViewAddPullReqMutation,
  useFileViewDeletePullReqMutation,
  useFileViewListPullReqQuery,
  useGetBranchQuery,
  useListPrincipalsQuery,
  useListPullReqActivitiesQuery,
  useRawDiffQuery,
  useReviewerListPullReqQuery
} from '@harnessio/code-service-client'
import { useLocalStorage, UserPreference } from '@harnessio/ui/hooks'
import {
  CommitFilterItemProps,
  CreateCommentPullReqRequest,
  DiffFileEntry,
  FILE_VIEWED_OBSOLETE_SHA,
  PullRequestChangesPage
} from '@harnessio/views'

import CommitSuggestionsDialog from '../../components-v2/commit-suggestions-dialog'
import { useAppContext } from '../../framework/context/AppContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { useQueryState } from '../../framework/hooks/useQueryState'
import { PathParams } from '../../RouteDefinitions'
import { createCommitFilterFromSHA, filenameToLanguage, normalizeGitRef } from '../../utils/git-utils'
import { parseSpecificDiff } from './diff-utils'
import { usePRCommonInteractions } from './hooks/usePRCommonInteractions'
import { changedFileId, DIFF2HTML_CONFIG, normalizeGitFilePath } from './pull-request-utils'
import { usePullRequestProviderStore } from './stores/pull-request-provider-store'
import { PullReqReviewDecision } from './types'

export const changesInfoAtom = atom<{ path?: string; raw?: string; fileViews?: Map<string, string> }>({})

const sortSelectedCommits = (selectedCommits: string[], sortedCommits?: string[]) => {
  return selectedCommits
    .sort((commitA, commitB) => {
      const commitAIdx = sortedCommits?.indexOf(commitA)
      const commitBIdx = sortedCommits?.indexOf(commitB)
      if (commitBIdx && commitAIdx) {
        return commitBIdx + commitAIdx
      }
      return 0
    })
    .reverse()
}

export default function PullRequestChanges() {
  const {
    pullReqMetadata,
    refetchPullReq,
    refetchActivities,
    diffs,
    setDiffs,
    pullReqCommits,
    updateCommentStatus,
    setPullReqStats,
    dryMerge,
    refreshNeeded,
    handleManualRefresh
  } = usePullRequestProviderStore()
  const { spaceId, repoId, pullRequestId, commitSHA } = useParams<PathParams>()
  const { currentUser } = useAppContext()
  const repoRef = useGetRepoRef()
  const [commitRange, setCommitRange] = useState<string[]>()
  const allCommitsSHA = useMemo(
    () => pullReqCommits?.commits?.map(commit => commit.sha as string),
    [pullReqCommits?.commits]
  )
  const [diffMode, setDiffMode] = useLocalStorage<DiffModeEnum>(UserPreference.DIFF_VIEW_STYLE, DiffModeEnum.Split)
  const targetRef = useMemo(() => pullReqMetadata?.merge_base_sha, [pullReqMetadata?.merge_base_sha])
  const sourceRef = useMemo(() => pullReqMetadata?.source_sha, [pullReqMetadata?.source_sha])
  const prId = (pullRequestId && Number(pullRequestId)) || -1
  const [commentId, setCommentIdQuery] = useQueryState('commentId')
  const [diffPathQuery, setDiffPathQuery] = useQueryState('path')
  const [initiatedJumpToDiff, setInitiatedJumpToDiff] = useState(false)
  const [searchPrincipalsQuery, setSearchPrincipalsQuery] = useState('')
  const [isApproving, setIsApproving] = useState(false)
  const isMfe = useIsMFE()

  const {
    scope: { accountId }
  } = useMFEContext()

  const {
    data: { body: principals } = {},
    isLoading: isPrincipalsLoading,
    error: principalsError
  } = useListPrincipalsQuery({
    // @ts-expect-error : BE issue - not implemnted
    queryParams: { page: 1, limit: 100, type: 'user', query: searchPrincipalsQuery, accountIdentifier: accountId }
  })

  const {
    data: { body: reviewers } = {},
    refetch: refetchReviewers,
    isFetching: loadingReviewers
  } = useReviewerListPullReqQuery({
    repo_ref: repoRef,
    pullreq_number: prId
  })

  const submitReview = useCallback(
    (decision: PullReqReviewDecision) => {
      setIsApproving(true)
      reviewSubmitPullReq({
        repo_ref: repoRef,
        pullreq_number: prId,
        body: { decision: decision as EnumPullReqReviewDecision, commit_sha: pullReqMetadata?.source_sha }
      })
        .then(() => {
          // showSuccess(getString(decision === 'approved' ? 'pr.reviewSubmitted' : 'pr.requestSubmitted'))
          refetchPullReq()
          refetchReviewers()
          refetchActivities()
        })
        .catch((exception: string) => {
          console.warn(exception)
          refetchReviewers()
        })
        .finally(() => {
          setIsApproving(false)
        })
    },
    [refetchActivities, refetchPullReq, pullReqMetadata?.source_sha, refetchReviewers, repoRef, prId]
  )
  const diffApiPath = useMemo(() => {
    // show range of commits and user selected subrange
    return commitRange?.length
      ? `${commitRange[0]}~1...${commitRange[commitRange.length - 1]}`
      : `${normalizeGitRef(targetRef)}...${normalizeGitRef(sourceRef)}`
  }, [commitRange, targetRef, sourceRef])
  const [cachedDiff, setCachedDiff] = useAtom(changesInfoAtom)
  const path = useMemo(() => `/api/v1/repos/${repoRef}/+/${diffApiPath}`, [repoRef, diffApiPath])

  const { data: { body: rawDiffData } = {}, isFetching: loadingRawDiff } = useRawDiffQuery(
    {
      repo_ref: repoRef,
      range: diffApiPath.replace('/diff', ''),
      queryParams: {},
      headers: { Accept: 'text/plain' }
    },
    {
      enabled: targetRef !== undefined && sourceRef !== undefined && cachedDiff.path !== path
    }
  )

  const { data: { body: fileViewsData } = {}, refetch: refetchFileViews } = useFileViewListPullReqQuery({
    repo_ref: repoRef,
    pullreq_number: prId
  })

  const { mutateAsync: markViewed } = useFileViewAddPullReqMutation({
    repo_ref: repoRef,
    pullreq_number: prId
  })

  const { data: { body: PRDiffStats } = {} } = useDiffStatsQuery(
    { queryParams: {}, repo_ref: repoRef, range: diffApiPath },
    { enabled: !!repoRef && !!diffApiPath }
  )

  const { error: sourceBranchError } = useGetBranchQuery(
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

  const currentRefForDiff = useMemo(() => {
    if (sourceBranchError) {
      return pullReqMetadata?.source_sha
    }

    if (!sourceBranchError && pullReqMetadata?.source_branch) {
      return pullReqMetadata.source_branch
    } else if (!sourceBranchError && sourceRef) {
      return sourceRef
    } else return commitSHA
  }, [sourceBranchError, pullReqMetadata?.source_branch, pullReqMetadata?.source_sha, sourceRef, commitSHA])

  useEffect(() => {
    if (PRDiffStats) {
      setPullReqStats(PRDiffStats)
    }
  }, [PRDiffStats])

  const onGetFullDiff = async (path?: string) => {
    if (!path) return
    return rawDiff({
      repo_ref: repoRef,
      range: diffApiPath.replace('/diff', ''),
      queryParams: {
        // @ts-expect-error : BE issue - path should be string and include_patch is a missing param
        path: path,
        include_patch: true,
        range: 1
      },
      headers: { Accept: 'text/plain' }
    })
      .then(res => {
        if (path && res.body && typeof res.body === 'string') {
          return res.body as string
        }
      })
      .catch(error => console.warn(error))
  }

  const handleMarkViewed = (filePath: string, checksumAfter: string) => {
    if (diffs) {
      const newDiffs = diffs.map(diff => {
        if (diff.fileViews) {
          const newFileViews = new Map(diff.fileViews)
          newFileViews.set(filePath, checksumAfter ?? 'unknown')
          return { ...diff, fileViews: newFileViews }
        }
        return diff
      })
      setDiffs(newDiffs)
    }
    markViewed({
      body: {
        commit_sha: pullReqMetadata?.source_sha,
        path: filePath
      }
    }).catch(error => {
      console.error('Failed to mark viewed:', error)
      refetchFileViews()
    })
  }

  const { mutateAsync: unmarkViewed } = useFileViewDeletePullReqMutation({
    repo_ref: repoRef,
    pullreq_number: prId
  })

  const handleUnmarkViewed = (filePath: string) => {
    if (diffs) {
      const newDiffs = diffs.map(diff => {
        if (diff.fileViews) {
          const newFileViews = new Map(diff.fileViews)
          newFileViews.delete(filePath)
          return { ...diff, fileViews: newFileViews }
        }
        return diff
      })
      setDiffs(newDiffs)
    }
    unmarkViewed({
      file_path: filePath
    }).then(() => refetchFileViews())
  }

  useEffect(() => {
    if (prId && !fileViewsData && !cachedDiff.fileViews) {
      refetchFileViews()
    }
  }, [prId, fileViewsData, refetchFileViews, cachedDiff.fileViews])

  useEffect(
    function updateCacheWhenDiffDataArrives() {
      if (path && rawDiffData && typeof rawDiffData === 'string') {
        const fileViews = fileViewsData
          ?.filter(({ path: _path, sha }) => _path && sha)
          .reduce((map, { path: _path, sha, obsolete }) => {
            map.set(_path as string, (obsolete ? FILE_VIEWED_OBSOLETE_SHA : sha) as string)
            return map
          }, new Map<string, string>())

        setCachedDiff({
          path,
          raw: rawDiffData,
          fileViews
        })
      }
    },
    [
      rawDiffData,
      path,
      setCachedDiff,
      fileViewsData
      // readOnly
    ]
  )

  // Parsing diff and construct data structure to pass into DiffViewer component
  useEffect(() => {
    if (loadingRawDiff || cachedDiff.path !== path || typeof cachedDiff.raw !== 'string') {
      return
    }

    let processTimeoutId: NodeJS.Timeout | null = null

    if (cachedDiff.raw) {
      const parsed = Diff2Html.parse(cachedDiff.raw, DIFF2HTML_CONFIG)
      let currentIndex = 0
      let accumulated: DiffFileEntry[] = []

      // slice out ~50 items for chunk - transform & push them into 'accumulated' and schedule remaining chunks in next tick
      // for diffs with more than 200 files this is taking longer to parse and blocks main thread
      const processNextChunk = () => {
        const CHUNK_SIZE = 50
        const endIndex = Math.min(currentIndex + CHUNK_SIZE, parsed.length)

        const chunk = parsed.slice(currentIndex, endIndex).map(diff => {
          diff.oldName = normalizeGitFilePath(diff.oldName)
          diff.newName = normalizeGitFilePath(diff.newName)

          const fileId = changedFileId([diff.oldName, diff.newName])
          const containerId = `container-${fileId}`
          const contentId = `content-${fileId}`
          const filePath = diff.isDeleted ? diff.oldName : diff.newName
          const diffString = parseSpecificDiff(
            cachedDiff.raw ?? '',
            diff.oldName,
            diff.newName,
            diff.checksumBefore,
            diff.checksumAfter
          )

          return {
            ...diff,
            containerId,
            contentId,
            fileId,
            filePath,
            fileViews: cachedDiff.fileViews,
            raw: diffString
          }
        })

        // Filter out deleted files from renames (keep only the renamed version)
        const filteredChunk = chunk.filter(diff => {
          // For renamed files, only show the non-deleted version
          if (diff.isRename) {
            return !diff.isDeleted
          }
          // For all other files, show them as they are
          return true
        })

        accumulated = [...accumulated, ...filteredChunk]
        setDiffs(accumulated)

        currentIndex = endIndex
        if (currentIndex < parsed.length) {
          processTimeoutId = setTimeout(processNextChunk, 0)
        } else {
          processTimeoutId = null
        }
      }
      processNextChunk()
    } else {
      setDiffs([])
    }

    // Cleanup function to clear any pending timeouts
    return () => {
      if (processTimeoutId) {
        clearTimeout(processTimeoutId)
        processTimeoutId = null
      }
    }
  }, [loadingRawDiff, path, cachedDiff])

  const { data: { body: activityData } = {} } = useListPullReqActivitiesQuery({
    repo_ref: repoRef,
    pullreq_number: prId,
    queryParams: {}
  })
  const [activities, setActivities] = useState(activityData)

  useEffect(() => {
    setActivities(
      activityData?.map((item: TypesPullReqActivity) => {
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
      })
    )
  }, [activityData])

  const handleSaveComment = async (comment: string, parentId?: number, extra?: CreateCommentPullReqRequest) => {
    const reqBody = parentId
      ? {
          text: comment,
          parent_id: parentId
        }
      : {
          text: comment,
          line_end: extra?.line_end,
          line_end_new: extra?.line_end_new,
          line_start: extra?.line_start,
          line_start_new: extra?.line_start_new,
          path: extra?.path,
          source_commit_sha: sourceRef,
          target_commit_sha: targetRef
        }
    return commentCreatePullReq({
      repo_ref: repoRef,
      pullreq_number: prId,
      body: reqBody
    })
      .then(() => {
        refetchActivities()
      })
      .catch(error => {
        console.warn('Failed to save comment:', error)
        throw error
      })
  }

  const defaultCommitFilter: CommitFilterItemProps = useMemo(
    () => ({
      name: 'All Commits',
      count: pullReqCommits?.commits?.length || 0,
      value: 'ALL'
    }),
    [pullReqCommits?.commits?.length]
  )

  const [selectedCommits, setSelectedCommits] = useState<CommitFilterItemProps[]>(() => {
    if (commitSHA && pullReqCommits?.commits) {
      return createCommitFilterFromSHA(commitSHA, pullReqCommits.commits, defaultCommitFilter)
    }
    return [defaultCommitFilter]
  })

  useEffect(() => {
    if (commitSHA && pullReqCommits?.commits) {
      setSelectedCommits(createCommitFilterFromSHA(commitSHA, pullReqCommits.commits, defaultCommitFilter))
    } else if (!commitSHA) {
      // Reset to default when no commitSHA in URL
      setSelectedCommits([defaultCommitFilter])
    }
  }, [commitSHA, pullReqCommits?.commits, defaultCommitFilter])

  // copying link to a comment
  const onCopyClick = (commentId?: number) => {
    if (commentId) {
      const url = new URL(window.location.href)
      // should purely have commentId
      url.searchParams.delete('path')
      url.searchParams.set('commentId', commentId.toString())
      copy(url.toString())
    }
  }

  useEffect(() => {
    const commitSHA: string[] = []
    selectedCommits.map(commit => {
      if (commit.value !== defaultCommitFilter.value) {
        commitSHA.push(commit.value)
      }
    })
    const newCommitRange = sortSelectedCommits(commitSHA, allCommitsSHA)
    setCommitRange(newCommitRange)
  }, [selectedCommits])

  const {
    updateComment,
    deleteComment,
    onCommitSuggestion,
    onCommitSuggestionSuccess,
    addSuggestionToBatch,
    removeSuggestionFromBatch,
    onCommitSuggestionsBatch,
    isCommitDialogOpen,
    setIsCommitDialogOpen,
    suggestionsBatch,
    suggestionToCommit,
    onCommentSaveAndStatusChange,
    toggleConversationStatus,
    handleUpload
  } = usePRCommonInteractions({
    repoRef,
    prId,
    refetchActivities,
    updateCommentStatus,
    dryMerge
  })

  return (
    <>
      <CommitSuggestionsDialog
        open={isCommitDialogOpen}
        onClose={() => setIsCommitDialogOpen(false)}
        onSuccess={onCommitSuggestionSuccess}
        suggestions={suggestionsBatch?.length ? suggestionsBatch : suggestionToCommit ? [suggestionToCommit] : null}
        prId={prId}
      />
      <PullRequestChangesPage
        principalProps={{
          principals,
          searchPrincipalsQuery,
          setSearchPrincipalsQuery,
          isPrincipalsLoading,
          principalsError
        }}
        handleUpload={handleUpload}
        usePullRequestProviderStore={usePullRequestProviderStore}
        setDiffMode={setDiffMode}
        loadingReviewers={loadingReviewers}
        diffMode={diffMode}
        reviewers={reviewers}
        refetchReviewers={refetchReviewers}
        submitReview={submitReview}
        currentUser={currentUser}
        pullReqMetadata={pullReqMetadata}
        loadingRawDiff={loadingRawDiff}
        handleSaveComment={handleSaveComment}
        pullReqCommits={pullReqCommits?.commits || []}
        deleteComment={deleteComment}
        updateComment={updateComment}
        defaultCommitFilter={defaultCommitFilter}
        selectedCommits={selectedCommits}
        setSelectedCommits={setSelectedCommits}
        markViewed={handleMarkViewed}
        unmarkViewed={handleUnmarkViewed}
        activities={activities}
        commentId={commentId}
        setCommentId={(commentId?: string) => setCommentIdQuery(commentId!)}
        diffPathQuery={diffPathQuery}
        setDiffPathQuery={(filepath?: string) => setDiffPathQuery(filepath!)}
        onCopyClick={onCopyClick}
        onCommentSaveAndStatusChange={onCommentSaveAndStatusChange}
        onCommitSuggestion={onCommitSuggestion}
        addSuggestionToBatch={addSuggestionToBatch}
        suggestionsBatch={suggestionsBatch}
        removeSuggestionFromBatch={removeSuggestionFromBatch}
        filenameToLanguage={filenameToLanguage}
        toggleConversationStatus={toggleConversationStatus}
        commitSuggestionsBatchCount={suggestionsBatch?.length}
        onCommitSuggestionsBatch={onCommitSuggestionsBatch}
        onGetFullDiff={onGetFullDiff}
        toRepoFileDetails={({ path }: { path: string }) => {
          const encodedPath = encodeURI(encodeURI(path))
          return isMfe ? `/repos/${repoId}/${encodedPath}` : `/${spaceId}/repos/${repoId}/${encodedPath}`
        }}
        isApproving={isApproving}
        currentRefForDiff={currentRefForDiff}
        initiatedJumpToDiff={initiatedJumpToDiff}
        setInitiatedJumpToDiff={setInitiatedJumpToDiff}
        refreshNeeded={refreshNeeded}
        handleManualRefresh={handleManualRefresh}
      />
    </>
  )
}
