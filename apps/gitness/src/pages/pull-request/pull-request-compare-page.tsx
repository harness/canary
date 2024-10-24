import { useEffect, useMemo, useState } from 'react'
import { SandboxPullRequestCompare, SkeletonList } from '@harnessio/playground'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CreateRepositoryErrorResponse,
  useCreatePullReqMutation,
  OpenapiCreatePullReqRequest,
  CreatePullReqOkResponse,
  RepoBranch,
  useListBranchesQuery,
  useFindRepositoryQuery,
  useListCommitsQuery,
  TypesCommit,
  useRawDiffQuery,
  mergeCheck,
  useDiffStatsQuery
} from '@harnessio/code-service-client'
import { PathParams } from '../../RouteDefinitions'
import { changesInfoAtom, DiffFileEntry, DiffViewerExchangeState, FormFields } from './types/types'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { normalizeGitRef } from '../../utils/git-utils'
import { useAtom } from 'jotai'
import { compact, isEqual } from 'lodash-es'
import { parseSpecificDiff } from './diff-utils'
import { changedFileId, DIFF2HTML_CONFIG, normalizeGitFilePath } from './utils'
import * as Diff2Html from 'diff2html'

export const CreatePullRequest = () => {
  const createPullRequestMutation = useCreatePullReqMutation({})
  const { repoId, spaceId, diffRefs } = useParams<PathParams>()
  const [isBranchSelected, setIsBranchSelected] = useState<boolean>(diffRefs ? true : false) // State to track branch selection

  // console.log(diffRefs)
  const diffTargetBranch = diffRefs?.split('...')[0] || ''
  const diffSourceBranch = diffRefs?.split('...')[1] || ''
  // console.log(diffTargetBranch, diffSourceBranch)

  const navigate = useNavigate()
  const [apiError, setApiError] = useState<string | null>(null)
  const repoRef = useGetRepoRef()
  const [selectedTargetBranch, setSelectedTargetBranch] = useState<string>(diffTargetBranch ? diffTargetBranch : 'main')
  const [selectedSourceBranch, setSelectedSourceBranch] = useState<string>(diffSourceBranch ? diffSourceBranch : 'main')
  const commitSHA = '' // TODO: when you implement commit filter will need commitSHA
  const defaultCommitRange = compact(commitSHA?.split(/~1\.\.\.|\.\.\./g))
  const [
    commitRange
    //  setCommitRange  TODO: add commit view filter dropdown to manage different commits
  ] = useState(defaultCommitRange)
  const targetRef = useMemo(() => selectedTargetBranch, [selectedTargetBranch, diffRefs])
  const sourceRef = useMemo(() => selectedSourceBranch, [selectedSourceBranch, diffRefs])
  const [cachedDiff, setCachedDiff] = useAtom(changesInfoAtom)
  const [mergeability, setMergeabilty] = useState<boolean>()
  const diffApiPath = useMemo(
    () =>
      // show range of commits and user selected subrange
      commitRange.length > 0
        ? `${commitRange[0]}~1...${commitRange[commitRange.length - 1]}`
        : // show range of commits and user did not select a subrange
          `${normalizeGitRef(targetRef)}...${normalizeGitRef(sourceRef)}`,
    [commitRange, targetRef, sourceRef]
  )
  const path = useMemo(() => `/api/v1/repos/${repoRef}/+/${diffApiPath}`, [repoRef, diffApiPath])

  const [diffs, setDiffs] = useState<DiffFileEntry[]>()
  const { data: rawDiff, isFetching: loadingRawDiff } = useRawDiffQuery(
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
        setCachedDiff({
          path,
          raw: rawDiff
        })
      }
    },
    [rawDiff, path, setCachedDiff]
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
    if (loadingRawDiff || cachedDiff.path !== path || typeof cachedDiff.raw !== 'string') {
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
  const { data: repoMetadata } = useFindRepositoryQuery({ repo_ref: repoRef })
  const handleSubmit = (data: FormFields, isDraft: boolean) => {
    const pullRequestBody: OpenapiCreatePullReqRequest = {
      description: data.description,
      is_draft: isDraft,
      target_branch: selectedTargetBranch || repoMetadata?.default_branch,
      source_branch: selectedSourceBranch,
      title: data.title
    }

    createPullRequestMutation.mutate(
      {
        queryParams: {},
        body: pullRequestBody,
        repo_ref: repoRef
      },
      {
        onSuccess: (data: CreatePullReqOkResponse) => {
          setApiError(null)
          navigate(`/${spaceId}/repos/${repoId}/pull-requests/${data?.number}`)
        },
        onError: (error: CreateRepositoryErrorResponse) => {
          const message = error.message || 'An unknown error occurred.'
          setApiError(message)
        }
      }
    )
  }

  const onSubmit = (data: FormFields) => {
    handleSubmit(data, false)
  }

  const onDraftSubmit = (data: FormFields) => {
    handleSubmit(data, true)
  }

  const onCancel = () => {
    navigate(`/${spaceId}/repos`)
  }
  const { data: branches, isFetching: isFetchingBranches } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: { page: 0, limit: 10 }
  })

  const selectTargetBranch = (branch: string) => {
    setSelectedTargetBranch(branch)
  }
  const selectSourceBranch = (branch: string) => {
    setSelectedSourceBranch(branch)
  }
  useEffect(() => {
    // useMergeCheckMutation
    mergeCheck({ queryParams: {}, repo_ref: repoRef, range: diffApiPath })
      .then(value => {
        setMergeabilty(value?.mergeable)
      })
      .catch(() => {
        console.log('eerr')
        setMergeabilty(false)
      })
  }, [repoRef, diffApiPath])

  const { data: diffStats } = useDiffStatsQuery(
    { queryParams: {}, repo_ref: repoRef, range: diffApiPath },
    { enabled: !!repoRef && !!diffApiPath }
  )

  const { data: commitData } = useListCommitsQuery({
    repo_ref: repoRef,

    queryParams: {
      page: 0,
      limit: 10,
      after: normalizeGitRef(selectedTargetBranch),
      git_ref: normalizeGitRef(selectedSourceBranch),
      include_stats: true
    }
  })
  const renderContent = () => {
    if (isFetchingBranches) return <SkeletonList />

    return (
      <SandboxPullRequestCompare
        isBranchSelected={isBranchSelected}
        setIsBranchSelected={setIsBranchSelected}
        onFormSubmit={onSubmit}
        onFormCancel={onCancel}
        apiError={apiError}
        isLoading={createPullRequestMutation.isLoading}
        isSuccess={createPullRequestMutation.isSuccess}
        onFormDraftSubmit={onDraftSubmit}
        mergeability={mergeability}
        selectTargetBranch={(branch: string) => selectTargetBranch(branch)}
        selectSourceBranch={(branch: string) => selectSourceBranch(branch)}
        branchList={
          branches
            ? branches?.map((item: RepoBranch) => ({
                name: item.name || ''
              }))
            : []
        }
        commitData={// @ts-expect-error remove "@ts-expect-error" once CodeServiceClient Response for useListCommitsQuery is fixed
        commitData?.commits?.map((item: TypesCommit) => ({
          sha: item.sha,
          parent_shas: item.parent_shas,
          title: item.title,
          message: item.message,
          author: item.author,
          committer: item.committer
        }))}
        targetBranch={selectedTargetBranch}
        sourceBranch={selectedSourceBranch}
        diffData={
          diffs?.map(item => ({
            text: item.filePath,
            data: item.raw,
            title: item.filePath,
            lang: item.filePath.split('.')[1]
          })) || []
        }
        diffStats={
          diffStats
            ? {
                deletions: diffStats.deletions,
                additions: diffStats.additions,
                files_changed: diffStats.files_changed,
                commits: diffStats.commits
              }
            : {}
        }
      />
    )
  }
  return <>{renderContent()}</>
}
