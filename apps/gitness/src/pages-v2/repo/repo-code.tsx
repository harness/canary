import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  OpenapiContentInfo,
  OpenapiGetContentOutput,
  useCalculateCommitDivergenceMutation,
  useGetContentQuery
} from '@harnessio/code-service-client'
import { BranchSelectorTab, CodeModes, CommitDivergenceType, RepoFiles } from '@harnessio/views'

import FileContentViewer from '../../components-v2/file-content-viewer'
import { FileEditor } from '../../components-v2/file-editor'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useForkSync } from '../../hooks/useForkSync'
import { useGitRef } from '../../hooks/useGitRef'
import { useRepoFileContentDetails } from '../../hooks/useRepoFileContentDetails'
import { PathParams } from '../../RouteDefinitions'
import { FILE_SEPARATOR, isRefACommitSHA, isRefATag, normalizeGitRef, REFS_TAGS_PREFIX } from '../../utils/git-utils'
import { splitPathWithParents } from '../../utils/path-utils'

/**
 * TODO: This code was migrated from V2 and needs to be refactored.
 */
export const RepoCode = () => {
  const repoRef = useGetRepoRef()
  const { spaceId, repoId } = useParams<PathParams>()
  const routes = useRoutes()
  const {
    fullGitRef,
    repoData,
    codeMode,
    fullGitRefWoDefault,
    gitRefName,
    fullResourcePath,
    preSelectedTab,
    setPreSelectedTab
  } = useGitRef()
  const repoPath = routes.toRepoFiles({ spaceId, repoId, '*': fullGitRef })

  // TODO: pathParts - should have all data for files path breadcrumbs
  const pathParts = [
    {
      path: repoId!,
      parentPath: repoPath
    },
    ...splitPathWithParents(fullResourcePath || '', repoPath)
  ]
  const [currBranchDivergence, setCurrBranchDivergence] = useState<CommitDivergenceType>({ ahead: 0, behind: 0 })
  const {
    data: { body: repoDetails } = {},
    refetch: refetchRepoContent,
    isLoading: isLoadingRepoDetails,
    error: repoDetailsError
  } = useGetContentQuery({
    path: fullResourcePath || '',
    repo_ref: repoRef,
    queryParams: { include_commit: true, git_ref: normalizeGitRef(fullGitRef || '') }
  })

  const { data: { body: branchDivergence = [] } = {}, mutate: calculateDivergence } =
    useCalculateCommitDivergenceMutation({ repo_ref: repoRef })

  useEffect(() => {
    setPreSelectedTab(fullGitRef.startsWith(REFS_TAGS_PREFIX) ? BranchSelectorTab.TAGS : BranchSelectorTab.BRANCHES)
  }, [fullGitRef])

  useEffect(() => {
    if (branchDivergence.length) {
      setCurrBranchDivergence(branchDivergence[0])
    }
  }, [branchDivergence])

  const repoEntryPathToFileTypeMap = useMemo((): Map<string, OpenapiGetContentOutput['type']> => {
    if (!repoDetails?.content?.entries?.length) return new Map()

    const nonEmptyPathEntries = repoDetails.content.entries.filter(entry => !!entry.path)

    return new Map(nonEmptyPathEntries.map((entry: OpenapiContentInfo) => [entry?.path ? entry.path : '', entry.type]))
  }, [repoDetails])

  const { files, loading, scheduleFileMetaFetch } = useRepoFileContentDetails({
    repoRef,
    fullGitRef,
    fullResourcePath,
    pathToTypeMap: repoEntryPathToFileTypeMap,
    spaceId,
    repoId
  })

  const latestFiles = useMemo(() => {
    const { author, message, sha } = repoDetails?.latest_commit || {}

    return {
      user: {
        name: author?.identity?.name || ''
      },
      lastCommitMessage: message || '',
      timestamp: author?.when ?? '',
      sha: sha && sha
    }
  }, [repoDetails?.latest_commit])

  const pathToNewFile = useMemo(() => {
    if (fullResourcePath && repoDetails) {
      if (repoDetails?.type === 'dir') {
        return `new/${fullGitRef}/~/${fullResourcePath}`
      }

      const parentDirPath = fullResourcePath?.split(FILE_SEPARATOR).slice(0, -1).join(FILE_SEPARATOR)
      return `new/${fullGitRef}/~/${parentDirPath}`
    }

    return `new/${fullGitRef}/~/`
  }, [fullGitRef, fullResourcePath, repoDetails])

  useEffect(() => {
    if (fullGitRefWoDefault && repoData?.default_branch) {
      calculateDivergence({
        repo_ref: repoRef,
        body: {
          requests: [
            {
              from: normalizeGitRef(fullGitRefWoDefault),
              to: repoData?.upstream
                ? `upstream:${normalizeGitRef(repoData?.upstream?.default_branch)}`
                : normalizeGitRef(repoData?.default_branch)
            }
          ]
        }
      })
    }
  }, [fullGitRefWoDefault, repoData?.default_branch, calculateDivergence])

  useEffect(() => {
    refetchRepoContent()
  }, [codeMode, refetchRepoContent])

  const showContributeBtn = useMemo(() => {
    return (
      (repoData?.upstream || gitRefName !== repoData?.default_branch) &&
      !isRefACommitSHA(fullGitRef) &&
      !isRefATag(fullGitRef)
    )
  }, [repoData?.default_branch, gitRefName, repoData?.upstream])

  /**
   * Render File content view or Edit file view
   */
  const renderCodeView = useMemo(() => {
    const isLoading = [isLoadingRepoDetails, loading].some(Boolean)

    if (codeMode === CodeModes.VIEW && !!repoDetails?.type && repoDetails.type !== 'dir') {
      return <FileContentViewer repoContent={repoDetails} loading={isLoading} />
    }

    if (codeMode !== CodeModes.VIEW) {
      return <FileEditor repoDetails={repoDetails} defaultBranch={repoData?.default_branch || ''} loading={isLoading} />
    }

    return <></>
  }, [codeMode, repoDetails, repoData?.default_branch, loading, isLoadingRepoDetails])

  const { handleFetchAndMerge, isSyncingFork } = useForkSync({
    repoRef,
    gitRefName,
    fullGitRefWoDefault,
    repoData,
    latestCommitSha: repoDetails?.latest_commit?.sha,
    calculateDivergence,
    onSyncSuccess: () => {
      refetchRepoContent()
    }
  })

  if (!repoId) return <></>

  return (
    <RepoFiles
      toCommitDetails={({ sha }: { sha: string }) => routes.toRepoCommitDetails({ spaceId, repoId, commitSHA: sha })}
      pathParts={pathParts}
      files={files}
      fullResourcePath={fullResourcePath}
      isRepoEmpty={repoData?.is_empty}
      isDir={repoDetails?.type === 'dir'}
      isShowSummary={!!repoEntryPathToFileTypeMap.size}
      latestFile={latestFiles}
      pathNewFile={pathToNewFile}
      pathUploadFiles="/upload-file"
      codeMode={codeMode}
      selectedBranchTag={{ name: gitRefName, sha: '' }}
      repoId={repoId}
      spaceId={spaceId}
      gitRef={fullGitRef}
      selectedRefType={preSelectedTab}
      defaultBranchName={repoData?.default_branch}
      currentBranchDivergence={currBranchDivergence}
      isLoadingRepoDetails={isLoadingRepoDetails}
      toRepoFileDetails={({ path }: { path: string }) => `../${path}`}
      showContributeBtn={showContributeBtn}
      repoDetailsError={repoDetailsError}
      scheduleFileMetaFetch={scheduleFileMetaFetch}
      upstream={repoData?.upstream}
      onFetchAndMerge={handleFetchAndMerge}
      isFetchingUpstream={isSyncingFork}
    >
      {renderCodeView}
    </RepoFiles>
  )
}
