import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { DiffModeEnum } from '@git-diff-view/react'
import copy from 'clipboard-copy'
import * as Diff2Html from 'diff2html'
import { atom, useAtom } from 'jotai'
import { useQueryState } from 'nuqs'

import {
  commentCreatePullReq,
  commentDeletePullReq,
  commentUpdatePullReq,
  EnumPullReqReviewDecision,
  reviewSubmitPullReq,
  TypesPullReqActivity,
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
  DiffViewerExchangeState,
  FILE_VIEWED_OBSOLETE_SHA,
  PullRequestChangesPage
} from '@harnessio/ui/views'

import { useAppContext } from '../../framework/context/AppContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { parseSpecificDiff } from '../../pages/pull-request/diff-utils'
import { PullReqReviewDecision } from '../../pages/pull-request/types/types'
import { changedFileId, DIFF2HTML_CONFIG } from '../../pages/pull-request/utils'
import { PathParams } from '../../RouteDefinitions'
import { normalizeGitRef } from '../../utils/git-utils'
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
  const { pullReqMetadata, refetchPullReq, refetchActivities, diffs, setDiffs, pullReqCommits } =
    usePullRequestProviderStore()
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
  const [commentId] = useQueryState('commentId', { defaultValue: '' })
  const {
    data: { body: reviewers } = {},
    refetch: refetchReviewers,
    isFetching: loadingReviewers
  } = useReviewerListPullReqQuery({
    repo_ref: repoRef,
    pullreq_number: prId
  })

  const deleteComment = (id: number) => {
    commentDeletePullReq({ repo_ref: repoRef, pullreq_number: prId, pullreq_comment_id: id })
      .then(() => {
        refetchActivities()
      })
      .catch(error => {
        console.error('Failed to delete comment:', error)
      })
  }
  const updateComment = (id: number, comment: string) => {
    commentUpdatePullReq({ repo_ref: repoRef, pullreq_number: prId, pullreq_comment_id: id, body: { text: comment } })
      .then(() => {
        refetchActivities()
      })
      .catch(error => {
        console.error('Failed to update comment:', error)
      })
  }
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

  const { data: { body: rawDiff } = {}, isFetching: loadingRawDiff } = useRawDiffQuery(
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
      if (path && rawDiff && typeof rawDiff === 'string') {
        const fileViews = fileViewsData
          ?.filter(({ path: _path, sha }) => _path && sha)
          .reduce((map, { path: _path, sha, obsolete }) => {
            map.set(_path as string, (obsolete ? FILE_VIEWED_OBSOLETE_SHA : sha) as string)
            return map
          }, new Map<string, string>())

        setCachedDiff({
          path,
          raw: rawDiff,
          fileViews
        })
      }
    },
    [
      rawDiff,
      path,
      setCachedDiff,
      fileViewsData
      // readOnly
    ]
  )
  // Diffs are rendered in blocks that can be destroyed when they go off-screen. Hence their internal
  // states (such as collapse, view full diff) are reset when they are being re-rendered. To fix this,
  // we maintained a map from this component and pass to each diff to retain their latest states.
  // Map entry: <diff.filePath, DiffViewerExchangeState>
  const memorizedState = useMemo(() => new Map<string, DiffViewerExchangeState>(), [])

  // Parsing diff and construct data structure to pass into DiffViewer component
  useEffect(() => {
    if (
      loadingRawDiff ||
      cachedDiff.path !== path ||
      typeof cachedDiff.raw !== 'string'
      // || !cachedDiff.fileViews
    ) {
      return
    }
    if (cachedDiff.raw) {
      const _diffs = Diff2Html.parse(cachedDiff.raw, DIFF2HTML_CONFIG)
        .map(diff => {
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
        .sort((a, b) => (a.newName || a.oldName).localeCompare(b.newName || b.oldName, undefined, { numeric: true }))

      setDiffs(_diffs)
    } else {
      setDiffs([])
    }
  }, [
    // readOnly,
    path,
    cachedDiff,
    loadingRawDiff,
    memorizedState
  ])
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

  const handleSaveComment = (comment: string, parentId?: number, extra?: CreateCommentPullReqRequest) => {
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
    commentCreatePullReq({
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
    name: `All Commits (${pullReqCommits?.commits?.length || 0})`,
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

  return (
    <>
      <PullRequestChangesPage
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
      />
    </>
  )
}
