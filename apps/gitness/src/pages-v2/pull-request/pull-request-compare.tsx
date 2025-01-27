import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import * as Diff2Html from 'diff2html'
import { useAtom } from 'jotai'
import { compact, isEqual } from 'lodash-es'

import {
  CreateRepositoryErrorResponse,
  mergeCheck,
  OpenapiCreatePullReqRequest,
  useCreatePullReqMutation,
  useDiffStatsQuery,
  useFindRepositoryQuery,
  useGetPullReqByBranchesQuery,
  useListBranchesQuery,
  useListCommitsQuery,
  useListPrincipalsQuery,
  useListTagsQuery,
  useRawDiffQuery
} from '@harnessio/code-service-client'
import {
  BranchSelectorListItem,
  BranchSelectorTab,
  CommitSelectorListItem,
  CompareFormFields,
  PRReviewer,
  PRReviewUsers,
  PullReqReviewDecision,
  PullRequestComparePage
} from '@harnessio/ui/views'

import { useAppContext } from '../../framework/context/AppContext'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useQueryState } from '../../framework/hooks/useQueryState'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { parseSpecificDiff } from '../../pages/pull-request/diff-utils'
import { changesInfoAtom, DiffFileEntry, DiffViewerExchangeState } from '../../pages/pull-request/types/types'
import { changedFileId, DIFF2HTML_CONFIG, normalizeGitFilePath } from '../../pages/pull-request/utils'
import { PathParams } from '../../RouteDefinitions'
import { normalizeGitRef } from '../../utils/git-utils'
import { useRepoBranchesStore } from '../repo/stores/repo-branches-store'
import { useRepoCommitsStore } from '../repo/stores/repo-commits-store'
import { transformBranchList } from '../repo/transform-utils/branch-transform'

/**
 * TODO: This code was migrated from V2 and needs to be refactored.
 */
export const CreatePullRequest = () => {
  const routes = useRoutes()
  const createPullRequestMutation = useCreatePullReqMutation({})
  const { repoId, spaceId, diffRefs } = useParams<PathParams>()
  const [isBranchSelected, setIsBranchSelected] = useState<boolean>(diffRefs ? true : false) // State to track branch selection
  const { currentUser } = useAppContext()
  const [diffTargetBranch, diffSourceBranch] = diffRefs ? diffRefs.split('...') : [undefined, undefined]

  const navigate = useNavigate()
  const [apiError, setApiError] = useState<string | null>(null)
  const repoRef = useGetRepoRef()
  const [selectedTargetBranch, setSelectedTargetBranch] = useState<BranchSelectorListItem>(
    diffTargetBranch ? { name: diffTargetBranch, sha: '' } : { name: 'main', sha: '' }
  )
  const [selectedSourceBranch, setSelectedSourceBranch] = useState<BranchSelectorListItem>(
    diffSourceBranch ? { name: diffSourceBranch, sha: '' } : { name: 'main', sha: '' }
  )
  const [prBranchCombinationExists, setPrBranchCombinationExists] = useState<{
    number: number
    title: string
    description: string
  } | null>(null)
  const [reviewers, setReviewers] = useState<PRReviewer[]>([])
  const [reviewUsers, setReviewUsers] = useState<PRReviewUsers[]>()
  const [diffs, setDiffs] = useState<DiffFileEntry[]>()
  const commitSHA = '' // TODO: when you implement commit filter will need commitSHA
  const defaultCommitRange = compact(commitSHA?.split(/~1\.\.\.|\.\.\./g))
  const [
    commitRange
    //  setCommitRange  TODO: add commit view filter dropdown to manage different commits
  ] = useState(defaultCommitRange)
  const targetRef = useMemo(() => selectedTargetBranch.name, [selectedTargetBranch])
  const sourceRef = useMemo(() => selectedSourceBranch.name, [selectedSourceBranch])
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

  const [sourceQuery, setSourceQuery] = useState('')
  const [targetQuery, setTargetQuery] = useState('')
  const [searchReviewers, setSearchReviewers] = useState('')

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
  const { data: { body: principals } = {} } = useListPrincipalsQuery({
    // @ts-expect-error : BE issue - not implemnted
    queryParams: { page: 1, limit: 100, type: 'user', query: searchReviewers }
  })

  useEffect(() => {
    if (principals?.length) {
      setReviewUsers(principals?.map(user => ({ id: user.id, display_name: user.display_name, uid: user.uid })))
    }
  }, [principals])

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
  const { data: { body: repoMetadata } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })

  useEffect(() => {
    if (repoMetadata?.default_branch) {
      setSelectedTargetBranch({ name: diffTargetBranch || repoMetadata.default_branch, sha: '' })
      setSelectedSourceBranch({ name: diffSourceBranch || repoMetadata.default_branch, sha: '' })
    }
  }, [repoMetadata, diffTargetBranch, diffSourceBranch])

  const handleSubmit = (data: CompareFormFields, isDraft: boolean) => {
    const pullRequestBody: OpenapiCreatePullReqRequest = {
      description: data.description,
      is_draft: isDraft,
      target_branch: selectedTargetBranch.name || repoMetadata?.default_branch,
      source_branch: selectedSourceBranch.name,
      title: data.title,
      reviewer_ids: reviewers.map(reviewer => reviewer.reviewer.id)
    }

    createPullRequestMutation.mutate(
      {
        queryParams: {},
        body: pullRequestBody,
        repo_ref: repoRef
      },
      {
        // TODO: fix this to navigate to the new pull request after transferring a pull request page to ui
        onSuccess: data => {
          setApiError(null)
          if (data?.body?.number) {
            navigate(
              routes.toPullRequest({
                spaceId,
                repoId,
                pullRequestId: data?.body?.number.toString()
              })
            )
          }
        },
        onError: (error: CreateRepositoryErrorResponse) => {
          const message = error.message || 'An unknown error occurred.'
          setApiError(message)
        }
      }
    )
  }

  const onSubmit = (data: CompareFormFields) => {
    handleSubmit(data, false)
  }

  const onDraftSubmit = (data: CompareFormFields) => {
    handleSubmit(data, true)
  }

  const onCancel = () => {
    navigate(routes.toRepositories({ spaceId }))
  }
  const { data: { body: branches } = {} } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: {
      page: 0,
      sort: 'date',
      order: 'desc',
      limit: 10,
      query: sourceQuery || targetQuery || '',
      include_pullreqs: true
    }
  })

  useEffect(() => {
    // useMergeCheckMutation
    setApiError(null)
    mergeCheck({ queryParams: {}, repo_ref: repoRef, range: diffApiPath })
      .then(({ body: value }) => {
        setMergeabilty(value?.mergeable)
      })
      .catch(err => {
        if (err.message !== "head branch doesn't contain any new commits.") {
          setApiError('Error in merge check')
        } else {
          setApiError("head branch doesn't contain any new commits.")
        }
        setMergeabilty(false)
      })
  }, [repoRef, diffApiPath])

  const { data: { body: diffStats } = {} } = useDiffStatsQuery(
    { queryParams: {}, repo_ref: repoRef, range: diffApiPath },
    { enabled: !!repoRef && !!diffApiPath }
  )

  const { data: { body: pullReqData } = {} } = useGetPullReqByBranchesQuery({
    repo_ref: repoRef,
    source_branch: selectedSourceBranch.name || repoMetadata?.default_branch || '',
    target_branch: selectedTargetBranch.name,
    queryParams: {
      include_checks: true,
      include_rules: true
    }
  })

  useEffect(() => {
    if (pullReqData?.number && pullReqData.title && pullReqData.description) {
      setPrBranchCombinationExists({
        number: pullReqData.number,
        title: pullReqData.title,
        description: pullReqData.description
      })
    } else {
      setPrBranchCombinationExists(null)
    }
  }, [pullReqData])
  const [query, setQuery] = useQueryState('query')

  // TODO:handle pagination in compare commit tab
  const { data: { body: commitData, headers } = {} } = useListCommitsQuery({
    repo_ref: repoRef,

    queryParams: {
      // TODO: add query when commit list api has query abilities
      // query: query??'',
      page: 0,
      limit: 20,
      after: normalizeGitRef(selectedTargetBranch.name),
      git_ref: normalizeGitRef(selectedSourceBranch.name),
      include_stats: true
    }
  })
  const { setCommits, setSelectedCommit } = useRepoCommitsStore()

  useEffect(() => {
    if (commitData) {
      setCommits(commitData, headers)
    }
  }, [commitData, headers, setCommits])

  const branchList: BranchSelectorListItem[] = useMemo(() => {
    if (!branches) return []

    return branches.map(item => ({
      name: item?.name || '',
      sha: item?.sha || '',
      default: item?.name === repoMetadata?.default_branch
    }))
  }, [branches, repoMetadata?.default_branch])

  const { data: tags } = useListTagsQuery({
    repo_ref: repoRef,
    queryParams: {
      include_commit: false,
      sort: 'date',
      order: 'asc',
      limit: 20,
      page: 1,
      query: sourceQuery || targetQuery || ''
    }
  })

  const tagsList: BranchSelectorListItem[] = useMemo(() => {
    if (!tags?.body) return []

    return tags.body.map(item => ({
      name: item?.name || '',
      sha: item?.sha || '',
      default: false
    }))
  }, [tags])

  const selectCommit = useCallback(
    (commitName: CommitSelectorListItem) => {
      const commit = commitData?.commits?.find(item => item.title === commitName.title)
      if (commit?.title && commit?.sha) {
        setSelectedCommit({ title: commit.title, sha: commit.sha || '' })
      }
    },
    [commitData, setSelectedCommit]
  )

  const selectBranchorTag = useCallback(
    (branchTagName: BranchSelectorListItem, type: BranchSelectorTab, sourceBranch: boolean) => {
      if (type === BranchSelectorTab.BRANCHES) {
        const branch = branchList.find(branch => branch.name === branchTagName.name)
        if (branch) {
          if (sourceBranch) {
            setSelectedSourceBranch(branch)
          } else {
            setSelectedTargetBranch(branch)
          }
        }
      } else if (type === BranchSelectorTab.TAGS) {
        const tag = tagsList.find(tag => tag.name === branchTagName.name)
        if (tag) {
          if (sourceBranch) {
            setSelectedSourceBranch(tag)
          } else {
            setSelectedTargetBranch(tag)
          }
        }
      }
      if (sourceBranch) {
        setSourceQuery('')
      } else {
        setTargetQuery('')
      }
    },
    [branchList, tagsList, setSelectedSourceBranch, setSelectedTargetBranch]
  )

  const { setTagList, setBranchList, setSpaceIdAndRepoId } = useRepoBranchesStore()

  useEffect(() => {
    if (tagsList.length) {
      setTagList(tagsList)
    }
  }, [tagsList])

  useEffect(() => {
    if (branchList.length) {
      setBranchList(transformBranchList(branchList, repoMetadata?.default_branch))
    }
  }, [tagsList, branchList, repoMetadata?.default_branch])

  useEffect(() => {
    setSpaceIdAndRepoId(spaceId || '', repoId || '')
  }, [spaceId, repoId])

  const handleAddReviewer = (id?: number) => {
    if (!id) return
    const reviewer = principals?.find(principal => principal.id === id)
    if (reviewer?.display_name && reviewer.id) {
      setReviewers(prev => [
        ...prev,
        {
          reviewer: { display_name: reviewer?.display_name || '', id: reviewer?.id || 0 },
          review_decision: PullReqReviewDecision.pending,
          sha: ''
        }
      ])
    }
  }

  const handleDeleteReviewer = (id?: number) => {
    if (!id) return
    const newReviewers = reviewers.filter(reviewer => reviewer?.reviewer?.id !== id)
    setReviewers(newReviewers)
  }

  const renderContent = () => {
    return (
      <PullRequestComparePage
        toCode={({ sha }: { sha: string }) => `${routes.toRepoFiles({ spaceId, repoId })}/${sha}`}
        toCommitDetails={({ sha }: { sha: string }) => routes.toRepoCommitDetails({ spaceId, repoId, commitSHA: sha })}
        currentUser={currentUser?.display_name}
        setSearchCommitQuery={setQuery}
        searchCommitQuery={query}
        useRepoCommitsStore={useRepoCommitsStore}
        repoId={repoId}
        spaceId={spaceId || ''}
        onSelectCommit={selectCommit}
        isBranchSelected={isBranchSelected}
        setIsBranchSelected={setIsBranchSelected}
        onFormSubmit={onSubmit}
        onFormCancel={onCancel}
        apiError={apiError}
        isLoading={createPullRequestMutation.isLoading}
        isSuccess={createPullRequestMutation.isSuccess}
        onFormDraftSubmit={onDraftSubmit}
        mergeability={mergeability}
        selectBranch={selectBranchorTag}
        useTranslationStore={useTranslationStore}
        useRepoBranchesStore={useRepoBranchesStore}
        targetBranch={selectedTargetBranch}
        sourceBranch={selectedSourceBranch}
        prBranchCombinationExists={prBranchCombinationExists}
        diffData={
          diffs?.map(item => ({
            text: item.filePath,
            data: item.raw,
            title: item.filePath,
            lang: item.filePath.split('.')?.[1],
            addedLines: item.addedLines,
            removedLines: item.deletedLines,
            isBinary: item.isBinary,
            deleted: item.isDeleted,
            unchangedPercentage: item.unchangedPercentage,
            blocks: item.blocks,
            filePath: item.filePath
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
        searchSourceQuery={sourceQuery}
        setSearchSourceQuery={setSourceQuery}
        searchTargetQuery={targetQuery}
        setSearchTargetQuery={setTargetQuery}
        usersList={reviewUsers}
        searchReviewersQuery={searchReviewers}
        setSearchReviewersQuery={setSearchReviewers}
        reviewers={reviewers}
        handleAddReviewer={handleAddReviewer}
        handleDeleteReviewer={handleDeleteReviewer}
      />
    )
  }
  return <>{renderContent()}</>
}
