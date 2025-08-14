import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useMutation } from '@tanstack/react-query'
import * as Diff2Html from 'diff2html'
import { useAtom } from 'jotai'
import { compact, noop } from 'lodash-es'

import {
  CreateRepositoryErrorResponse,
  mergeCheck,
  OpenapiCreatePullReqRequest,
  rawDiff as rawDiffCheck,
  RepoRepositoryOutput,
  useCreatePullReqMutation,
  useDiffStatsQuery,
  useFindRepositoryQuery,
  useGetContentQuery,
  useGetPullReqByBranchesQuery,
  useListCommitsQuery,
  useListPrincipalsQuery,
  useRawDiffQuery
} from '@harnessio/code-service-client'
import { IconV2 } from '@harnessio/ui/components'
import {
  BranchSelectorListItem,
  BranchSelectorTab,
  CommitSelectorListItem,
  CompareFormFields,
  HandleAddLabelType,
  LabelAssignmentType,
  LabelValueType,
  PRReviewer,
  PullReqReviewDecision,
  PullRequestComparePage
} from '@harnessio/ui/views'

import { BranchSelectorContainer } from '../../components-v2/branch-selector-container'
import { useAppContext } from '../../framework/context/AppContext'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useIsMFE } from '../../framework/hooks/useIsMFE.ts'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { useQueryState } from '../../framework/hooks/useQueryState'
import { useAPIPath } from '../../hooks/useAPIPath.ts'
import { useGitRef } from '../../hooks/useGitRef.ts'
import { PathParams } from '../../RouteDefinitions'
import { decodeGitContent, normalizeGitRef } from '../../utils/git-utils'
import { getFileExtension } from '../../utils/path-utils.ts'
import { useGetRepoLabelAndValuesData } from '../repo/labels/hooks/use-get-repo-label-and-values-data'
import { useRepoCommitsStore } from '../repo/stores/repo-commits-store'
import { parseSpecificDiff } from './diff-utils'
import { usePRCommonInteractions } from './hooks/usePRCommonInteractions'
import { changedFileId, DIFF2HTML_CONFIG, normalizeGitFilePath } from './pull-request-utils'
import { changesInfoAtom, DiffFileEntry } from './types'

interface AiPullRequestSummaryParams {
  repoMetadata: RepoRepositoryOutput
  baseRef: string
  headRef: string
}

/**
 * TODO: This code was migrated from V2 and needs to be refactored.
 */
export const CreatePullRequest = () => {
  const routes = useRoutes()
  const [desc, setDesc] = useState('')
  const [prTemplate, setPrTemplate] = useState<string>()
  const createPullRequestMutation = useCreatePullReqMutation({})
  const params = useParams<PathParams>()
  const { repoId, spaceId } = params
  const diffRefs = params.diffRefs || params['*']
  const [isBranchSelected, setIsBranchSelected] = useState<boolean>(diffRefs ? true : false) // State to track branch selection
  const { currentUser } = useAppContext()
  const [diffTargetBranch, diffSourceBranch] = diffRefs ? diffRefs.split('...') : [undefined, undefined]
  const {
    scope: { accountId }
  } = useMFEContext()

  const navigate = useNavigate()
  const [apiError, setApiError] = useState<string | null>(null)
  const repoRef = useGetRepoRef()
  const [selectedTargetBranch, setSelectedTargetBranch] = useState<BranchSelectorListItem | null>(
    diffTargetBranch ? { name: diffTargetBranch, sha: '' } : null
  )
  const [selectedSourceBranch, setSelectedSourceBranch] = useState<BranchSelectorListItem | null>(
    diffSourceBranch ? { name: diffSourceBranch, sha: '' } : null
  )
  const [prBranchCombinationExists, setPrBranchCombinationExists] = useState<{
    number: number
    title: string
    description: string
  } | null>(null)
  const [reviewers, setReviewers] = useState<PRReviewer[]>([])
  const [diffs, setDiffs] = useState<DiffFileEntry[]>()
  const [labels, setLabels] = useState<LabelAssignmentType[]>([])
  const [searchLabel, setSearchLabel] = useState('')
  const commitSHA = '' // TODO: when you implement commit filter will need commitSHA
  const defaultCommitRange = compact(commitSHA?.split(/~1\.\.\.|\.\.\./g))
  const [
    commitRange
    //  setCommitRange  TODO: add commit view filter dropdown to manage different commits
  ] = useState(defaultCommitRange)
  const targetRef = useMemo(() => selectedTargetBranch?.name, [selectedTargetBranch])
  const sourceRef = useMemo(() => selectedSourceBranch?.name, [selectedSourceBranch])
  const [cachedDiff, setCachedDiff] = useAtom(changesInfoAtom)
  const [mergeability, setMergeabilty] = useState<boolean>()
  const [jumpToDiff, setJumpToDiff] = useState('')
  const diffApiPath = useMemo(
    () =>
      // show range of commits and user selected subrange
      commitRange.length > 0
        ? `${commitRange[0]}~1...${commitRange[commitRange.length - 1]}`
        : // show range of commits and user did not select a subrange
          `${normalizeGitRef(targetRef)}...${normalizeGitRef(sourceRef)}`,
    [commitRange, targetRef, sourceRef]
  )

  const { data: { body: prTemplateData } = {} } = useGetContentQuery({
    path: '.harness/pull_request_template.md',
    repo_ref: repoRef,
    queryParams: { include_commit: false, git_ref: normalizeGitRef(diffTargetBranch || '') }
  })

  useEffect(() => {
    if (prTemplateData?.content?.data) {
      setPrTemplate(decodeGitContent(prTemplateData?.content?.data))
    }
  }, [prTemplateData, setDesc])

  const { handleUpload } = usePRCommonInteractions({
    repoRef,
    prId: -1,
    refetchActivities: noop,
    updateCommentStatus: noop
  })

  const path = useMemo(() => `/api/v1/repos/${repoRef}/+/${diffApiPath}`, [repoRef, diffApiPath])

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
  const {
    data: { body: principals } = {},
    isLoading: isPrincipalsLoading,
    error: principalsError
  } = useListPrincipalsQuery({
    // @ts-expect-error : BE issue - not implemnted
    queryParams: { page: 1, limit: 100, type: 'user', query: searchReviewers, accountIdentifier: accountId }
  })

  const {
    labels: labelsList,
    values: labelsValues,
    isLoading: isLabelsLoading
  } = useGetRepoLabelAndValuesData({
    query: searchLabel,
    inherited: true,
    limit: 100
  })

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

  useEffect(() => {
    // Set isBranchSelected to false if source and target branches are the same, otherwise true
    if (selectedSourceBranch && selectedTargetBranch && selectedSourceBranch.name === selectedTargetBranch.name) {
      setIsBranchSelected(false)
    } else {
      setIsBranchSelected(true)
    }
  }, [selectedSourceBranch, selectedTargetBranch, setIsBranchSelected])

  // Parsing diff and construct data structure to pass into DiffViewer component
  useEffect(() => {
    if (loadingRawDiff || cachedDiff.path !== path || typeof cachedDiff.raw !== 'string') {
      return
    }
    if (!cachedDiff.raw) {
      setDiffs([])
      return
    }
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
  }, [loadingRawDiff, path, cachedDiff])

  const { data: { body: repoMetadata } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })

  useEffect(() => {
    if (repoMetadata?.default_branch) {
      setSelectedTargetBranch({ name: diffTargetBranch || repoMetadata.default_branch, sha: '' })
      setSelectedSourceBranch({ name: diffSourceBranch || '', sha: '' })
    }
  }, [repoMetadata, diffTargetBranch, diffSourceBranch])

  const handleSubmit = (data: CompareFormFields, isDraft: boolean) => {
    const pullRequestBody: OpenapiCreatePullReqRequest = {
      description: data.description,
      is_draft: isDraft,
      target_branch: selectedTargetBranch?.name || repoMetadata?.default_branch,
      source_branch: selectedSourceBranch?.name,
      title: data.title,
      reviewer_ids: reviewers.map(reviewer => reviewer.reviewer.id),
      labels: labels.map(label => {
        return {
          label_id: label.id,
          value: label.assigned_value?.value || undefined,
          value_id: label.assigned_value?.id || undefined
        }
      })
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
    source_branch: selectedSourceBranch?.name || repoMetadata?.default_branch || '',
    target_branch: selectedTargetBranch?.name || repoMetadata?.default_branch || '',
    queryParams: {
      include_checks: true,
      include_rules: true
    }
  })

  useEffect(() => {
    if (pullReqData?.number && pullReqData.title) {
      setPrBranchCombinationExists({
        number: pullReqData.number,
        title: pullReqData.title,
        description: pullReqData?.description || ''
      })
    } else {
      setPrBranchCombinationExists(null)
    }
  }, [pullReqData, targetRef, sourceRef])
  const [query, setQuery] = useQueryState('query')

  // TODO:handle pagination in compare commit tab
  const { data: { body: commitData, headers } = {}, isFetching: isFetchingCommits } = useListCommitsQuery({
    repo_ref: repoRef,

    queryParams: {
      // TODO: add query when commit list api has query abilities
      // query: query??'',
      page: 0,
      limit: 20,
      after: normalizeGitRef(selectedTargetBranch?.name),
      git_ref: normalizeGitRef(selectedSourceBranch?.name),
      include_stats: true
    }
  })
  const { setCommits, setSelectedCommit } = useRepoCommitsStore()

  useEffect(() => {
    if (commitData) {
      setCommits(commitData, headers)
    }
  }, [commitData, headers, setCommits])

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
        if (sourceBranch) {
          setSelectedSourceBranch(branchTagName)
        } else {
          setSelectedTargetBranch(branchTagName)
        }
      } else if (type === BranchSelectorTab.TAGS) {
        if (sourceBranch) {
          setSelectedSourceBranch(branchTagName)
        } else {
          setSelectedTargetBranch(branchTagName)
        }
      }

      // Update URL when either branch changes - use branchTagName directly
      const targetName = sourceBranch ? selectedTargetBranch?.name || diffTargetBranch : branchTagName.name

      const sourceName = sourceBranch ? branchTagName.name : selectedSourceBranch?.name || diffSourceBranch

      if (targetName && sourceName) {
        navigate(
          routes.toPullRequestCompare({
            spaceId,
            repoId,
            diffRefs: `${targetName}...${sourceName}`
          }),
          { replace: true }
        )
      }
    },
    [
      setSelectedSourceBranch,
      setSelectedTargetBranch,
      selectedSourceBranch,
      selectedTargetBranch,
      diffTargetBranch,
      diffSourceBranch,
      navigate,
      routes,
      spaceId,
      repoId
    ]
  )

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

  const handleAddLabel = (labelToAdd: HandleAddLabelType) => {
    const findLabel = labelsList.find(label => label.id === labelToAdd.label_id)
    if (!findLabel) return
    let labelValue: LabelValueType | undefined
    if (labelToAdd.value_id && findLabel?.key) {
      labelValue = labelsValues[findLabel.key].find(labelValue => labelToAdd.value_id === labelValue.id)
    }
    setLabels(prev => [
      {
        id: findLabel.id,
        scope: findLabel.scope,
        color: findLabel.color,
        key: findLabel.key,
        type: findLabel.type,
        assigned_value: labelValue
          ? {
              color: labelValue?.color,
              id: labelValue?.id,
              value: labelValue?.value
            }
          : undefined
      },
      ...prev
    ])
  }

  const handleDeleteLabel = (id: number) => {
    const newLabels = labels.filter(label => label.id !== id)
    setLabels(newLabels)
  }

  const getApiPath = useAPIPath()
  const { fullGitRef: baseRef } = useGitRef()

  const mutation = useMutation(async ({ repoMetadata, baseRef, headRef }: AiPullRequestSummaryParams) => {
    return fetch(getApiPath(`/api/v1/repos/${repoMetadata.path}/+/genai/change-summary`), {
      method: 'POST',
      body: JSON.stringify({
        base_ref: baseRef,
        head_ref: headRef
      })
    })
      .then(res => res.json())
      .then(json => ({
        summary: json.summary
      }))
  })

  const handleAiPullRequestSummary = useCallback(async () => {
    if (repoMetadata && repoMetadata.path && selectedSourceBranch?.name) {
      const headRef = `refs/heads/${selectedSourceBranch.name}`

      return await mutation.mutateAsync({
        repoMetadata,
        baseRef,
        headRef
      })
    }

    return Promise.resolve({
      summary: ''
    })
  }, [mutation])

  const onGetFullDiff = async (path?: string) => {
    if (!path) return
    return rawDiffCheck({
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

  const isMFE = useIsMFE()

  const toRepoFileDetails = ({ path }: { path: string }) =>
    isMFE ? `/repos/${repoId}/${path}` : `/${spaceId}/repos/${repoId}/${path}`

  const renderContent = () => {
    return (
      <PullRequestComparePage
        desc={desc}
        setDesc={setDesc}
        prTemplate={prTemplate}
        handleUpload={handleUpload}
        toCode={({ sha }: { sha: string }) => `${routes.toRepoFiles({ spaceId, repoId })}/${sha}`}
        toCommitDetails={({ sha }: { sha: string }) => routes.toRepoCommitDetails({ spaceId, repoId, commitSHA: sha })}
        toPullRequestConversation={({ pullRequestId }: { pullRequestId: number }) =>
          routes.toPullRequestConversation({ spaceId, repoId, pullRequestId: pullRequestId.toString() })
        }
        currentUser={currentUser?.display_name}
        setSearchCommitQuery={setQuery}
        searchCommitQuery={query}
        useRepoCommitsStore={useRepoCommitsStore}
        repoId={repoId}
        spaceId={spaceId || ''}
        isLabelsLoading={isLabelsLoading}
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
        prBranchCombinationExists={prBranchCombinationExists}
        handleAiPullRequestSummary={handleAiPullRequestSummary}
        diffData={
          diffStats?.files_changed || 0
            ? diffs?.map(item => ({
                text: item.filePath,
                data: item.raw,
                title: item.filePath,
                lang: getFileExtension(item.filePath),
                addedLines: item.addedLines,
                deletedLines: item.deletedLines,
                isBinary: item.isBinary,
                isDeleted: Boolean(item.isDeleted),
                unchangedPercentage: item.unchangedPercentage,
                blocks: item.blocks,
                filePath: item.filePath,
                diffData: item
              })) || []
            : []
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
        principalProps={{
          principals,
          searchPrincipalsQuery: searchReviewers,
          setSearchPrincipalsQuery: setSearchReviewers,
          isPrincipalsLoading,
          principalsError
        }}
        reviewers={reviewers}
        handleAddReviewer={handleAddReviewer}
        handleDeleteReviewer={handleDeleteReviewer}
        isFetchingCommits={isFetchingCommits}
        jumpToDiff={jumpToDiff}
        setJumpToDiff={setJumpToDiff}
        labelsList={labelsList}
        labelsValues={labelsValues}
        PRLabels={labels}
        addLabel={handleAddLabel}
        removeLabel={handleDeleteLabel}
        editLabelsProps={{ to: routes.toRepoLabels({ spaceId, repoId }) }}
        searchLabelQuery={searchLabel}
        setSearchLabelQuery={setSearchLabel}
        branchSelectorRenderer={
          <>
            <BranchSelectorContainer
              onSelectBranchorTag={(branchTagName, type) => selectBranchorTag(branchTagName, type, false)}
              selectedBranch={selectedTargetBranch}
              branchPrefix="base"
            />
            <IconV2 name="arrow-left" />
            <BranchSelectorContainer
              onSelectBranchorTag={(branchTagName, type) => selectBranchorTag(branchTagName, type, true)}
              selectedBranch={selectedSourceBranch}
              branchPrefix="compare"
            />
          </>
        }
        onGetFullDiff={onGetFullDiff}
        toRepoFileDetails={toRepoFileDetails}
        sourceBranch={selectedSourceBranch?.name}
      />
    )
  }
  return <>{renderContent()}</>
}
