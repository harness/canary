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
  useListPullReqActivitiesQuery,
  useRawDiffQuery,
  useReviewerListPullReqQuery
} from '@harnessio/code-service-client'
import {
  CommitFilterItemProps,
  CreateCommentPullReqRequest,
  DiffFileEntry,
  FILE_VIEWED_OBSOLETE_SHA,
  PullRequestChangesPage
} from '@harnessio/ui/views'

import CommitSuggestionsDialog from '../../components-v2/commit-suggestions-dialog'
import { useAppContext } from '../../framework/context/AppContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useQueryState } from '../../framework/hooks/useQueryState'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { parseSpecificDiff } from '../../pages/pull-request/diff-utils'
import { PullReqReviewDecision } from '../../pages/pull-request/types/types'
import { changedFileId, DIFF2HTML_CONFIG } from '../../pages/pull-request/utils'
import { PathParams } from '../../RouteDefinitions'
import { filenameToLanguage, normalizeGitRef } from '../../utils/git-utils'
import { usePRCommonInteractions } from './hooks/usePRCommonInteractions'
import { normalizeGitFilePath } from './pull-request-utils'
import { usePullRequestProviderStore } from './stores/pull-request-provider-store'

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
    setPullReqStats
  } = usePullRequestProviderStore()
  const { currentUser } = useAppContext()
  const repoRef = useGetRepoRef()
  const [commitRange, setCommitRange] = useState<string[]>()
  const allCommitsSHA = useMemo(
    () => pullReqCommits?.commits?.map(commit => commit.sha as string),
    [pullReqCommits?.commits]
  )
  const [diffMode, setDiffMode] = useState<DiffModeEnum>(DiffModeEnum.Split)
  const targetRef = useMemo(() => pullReqMetadata?.merge_base_sha, [pullReqMetadata?.merge_base_sha])
  const sourceRef = useMemo(() => pullReqMetadata?.source_sha, [pullReqMetadata?.source_sha])
  const { pullRequestId } = useParams<PathParams>()
  const prId = (pullRequestId && Number(pullRequestId)) || -1
  const [commentId] = useQueryState('commentId')
  const [scrolledToComment, setScrolledToComment] = useState(false)

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
    }).then(() => refetchFileViews())
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
          const diffString = parseSpecificDiff(cachedDiff.raw ?? '', diff.oldName, diff.newName)

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
        accumulated = [...accumulated, ...chunk]
        setDiffs(accumulated)

        currentIndex = endIndex
        if (currentIndex < parsed.length) {
          setTimeout(processNextChunk, 0)
        }
      }
      processNextChunk()
    } else {
      setDiffs([])
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
        // TODO Handle error (e.g., remove the temporary comment or show an error message)
        console.error('Failed to save comment:', error)
      })
  }

  const defaultCommitFilter: CommitFilterItemProps = {
    name: 'All Commits',
    count: pullReqCommits?.commits?.length || 0,
    value: 'ALL'
  }

  const [selectedCommits, setSelectedCommits] = useState<CommitFilterItemProps[]>([defaultCommitFilter])

  const onCopyClick = (commentId?: number) => {
    if (commentId) {
      const url = new URL(window.location.href)
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
    updateCommentStatus
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
        handleUpload={handleUpload}
        usePullRequestProviderStore={usePullRequestProviderStore}
        useTranslationStore={useTranslationStore}
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
        scrolledToComment={scrolledToComment}
        setScrolledToComment={setScrolledToComment}
      />
    </>
  )
}
