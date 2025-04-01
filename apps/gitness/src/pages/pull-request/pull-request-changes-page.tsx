import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { DiffModeEnum } from '@git-diff-view/react'
import * as Diff2Html from 'diff2html'
import { useAtom } from 'jotai'
import { compact, isEqual } from 'lodash-es'

import {
  EnumPullReqReviewDecision,
  reviewSubmitPullReq,
  useRawDiffQuery,
  useReviewerListPullReqQuery
} from '@harnessio/code-service-client'
import { SkeletonList, Spacer } from '@harnessio/ui/components'
import { PullRequestChanges } from '@harnessio/views'

import { useAppContext } from '../../framework/context/AppContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { PathParams } from '../../RouteDefinitions'
import { normalizeGitRef } from '../../utils/git-utils'
import { parseSpecificDiff } from './diff-utils'
import { PullRequestChangesFilter } from './pull-request-changes-filter'
import { usePullRequestDataStore } from './stores/pull-request-store'
import { changesInfoAtom, DiffFileEntry, DiffViewerExchangeState, PullReqReviewDecision } from './types/types'
import { changedFileId, DIFF2HTML_CONFIG, normalizeGitFilePath } from './utils'

function PullRequestChangesPage() {
  const { pullReqMetadata, refetchPullReq, refetchActivities } = usePullRequestDataStore(state => ({
    pullReqMetadata: state.pullReqMetadata,
    refetchPullReq: state.refetchPullReq,
    refetchActivities: state.refetchActivities
  }))
  const { currentUser } = useAppContext()
  const repoRef = useGetRepoRef()
  const commitSHA = '' // TODO: when you implement commit filter will need commitSHA
  const defaultCommitRange = compact(commitSHA?.split(/~1\.\.\.|\.\.\./g))
  const [
    commitRange
    //  setCommitRange  TODO: add commit view filter dropdown to manage different commits
  ] = useState(defaultCommitRange)
  const [diffMode, setDiffMode] = useState<DiffModeEnum>(DiffModeEnum.Split)
  const targetRef = useMemo(() => pullReqMetadata?.merge_base_sha, [pullReqMetadata?.merge_base_sha])
  const sourceRef = useMemo(() => pullReqMetadata?.source_sha, [pullReqMetadata?.source_sha])
  const [diffs, setDiffs] = useState<DiffFileEntry[]>()
  const { pullRequestId } = useParams<PathParams>()
  const prId = (pullRequestId && Number(pullRequestId)) || -1
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
  const diffApiPath = useMemo(
    () =>
      // show range of commits and user selected subrange
      commitRange.length > 0
        ? `${commitRange[0]}~1...${commitRange[commitRange.length - 1]}`
        : // show range of commits and user did not select a subrange
          `${normalizeGitRef(targetRef)}...${normalizeGitRef(sourceRef)}`,
    [commitRange, targetRef, sourceRef]
  )
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

  useEffect(
    function updateCacheWhenDiffDataArrives() {
      if (path && rawDiff && typeof rawDiff === 'string') {
        // const fileViews = readOnly
        //   ? new Map<string, string>()
        //   : fileViewsData
        //       ?.filter(({ path: _path, sha }) => _path && sha)
        //       .reduce((map, { path: _path, sha, obsolete }) => {
        //         map.set(_path as string, (obsolete ? FILE_VIEWED_OBSOLETE_SHA : sha) as string)
        //         return map
        //       }, new Map<string, string>())

        setCachedDiff({
          path,
          raw: rawDiff
          // fileViews
        })
      }
    },
    [
      rawDiff,
      path,
      setCachedDiff
      //  fileViewsData, readOnly
    ]
  )
  // Diffs are rendered in blocks that can be destroyed when they go off-screen. Hence their internal
  // states (such as collapse, view full diff) are reset when they are being re-rendered. To fix this,
  // we maintained a map from this component and pass to each diff to retain their latest states.
  // Map entry: <diff.filePath, DiffViewerExchangeState>
  const memorizedState = useMemo(() => new Map<string, DiffViewerExchangeState>(), [])

  //
  // Parsing diff and construct data structure to pass into DiffViewer component
  //
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

      setDiffs(oldDiffs => {
        if (isEqual(oldDiffs, _diffs)) return oldDiffs

        // Clear memorizedState when diffs are changed
        memorizedState.clear()
        return _diffs
      })
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

  const renderContent = () => {
    if (loadingRawDiff) {
      return <SkeletonList />
    }
    return (
      <PullRequestChanges
        data={
          diffs?.map(item => ({
            text: item.filePath,
            numAdditions: item.addedLines,
            numDeletions: item.deletedLines,
            data: item.raw,
            title: item.filePath,
            lang: item.filePath.split('.')[1]
          })) || []
        }
        diffMode={diffMode}
      />
    )
  }

  return (
    <>
      <PullRequestChangesFilter
        active={''}
        loading={loadingReviewers}
        currentUser={currentUser ?? {}}
        pullRequestMetadata={pullReqMetadata ? pullReqMetadata : undefined}
        reviewers={reviewers}
        submitReview={submitReview}
        refetchReviewers={refetchReviewers}
        diffMode={diffMode}
        setDiffMode={setDiffMode}
      />
      <Spacer aria-setsize={5} />

      {renderContent()}
    </>
  )
}
export { PullRequestChangesPage }
