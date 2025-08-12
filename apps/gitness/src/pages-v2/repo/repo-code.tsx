import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  OpenapiContentInfo,
  OpenapiGetContentOutput,
  useCalculateCommitDivergenceMutation,
  useGetContentQuery
} from '@harnessio/code-service-client'
import { BranchSelectorTab, CodeModes, CommitDivergenceType, RepoFiles } from '@harnessio/ui/views'

import FileContentViewer from '../../components-v2/file-content-viewer'
import { FileEditor } from '../../components-v2/file-editor'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useGitRef } from '../../hooks/useGitRef'
import { useRepoFileContentDetails } from '../../hooks/useRepoFileContentDetails'
import { PathParams } from '../../RouteDefinitions'
import { FILE_SEPERATOR, isRefACommitSHA, isRefATag, normalizeGitRef, REFS_TAGS_PREFIX } from '../../utils/git-utils'
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

  const { files, loading, loadMetadataForPaths } = useRepoFileContentDetails({
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

      const parentDirPath = fullResourcePath?.split(FILE_SEPERATOR).slice(0, -1).join(FILE_SEPERATOR)
      return `new/${fullGitRef}/~/${parentDirPath}`
    }

    return `new/${fullGitRef}/~/`
  }, [fullGitRef, fullResourcePath, repoDetails])

  useEffect(() => {
    if (fullGitRefWoDefault && repoData?.default_branch) {
      calculateDivergence({
        repo_ref: repoRef,
        body: {
          requests: [{ from: normalizeGitRef(fullGitRefWoDefault), to: normalizeGitRef(repoData?.default_branch) }]
        }
      })
    }
  }, [fullGitRefWoDefault, repoData?.default_branch, calculateDivergence])

  useEffect(() => {
    refetchRepoContent()
  }, [codeMode, refetchRepoContent])

  const showContributeBtn = useMemo(() => {
    return gitRefName !== repoData?.default_branch && !isRefACommitSHA(fullGitRef) && !isRefATag(fullGitRef)
  }, [repoData?.default_branch, gitRefName])

  /**
   * Render File content view or Edit file view
   */
  const renderCodeView = useMemo(() => {
    if (codeMode === CodeModes.VIEW && !!repoDetails?.type && repoDetails.type !== 'dir') {
      return <FileContentViewer repoContent={repoDetails} />
    }

    if (codeMode !== CodeModes.VIEW) {
      return <FileEditor repoDetails={repoDetails} defaultBranch={repoData?.default_branch || ''} />
    }

    return <></>
  }, [codeMode, repoDetails, repoData?.default_branch])

  if (!repoId) return <></>

  return (
    <RepoFiles
      toCommitDetails={({ sha }: { sha: string }) => routes.toRepoCommitDetails({ spaceId, repoId, commitSHA: sha })}
      pathParts={pathParts}
      loading={loading}
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
      loadMetadataForPaths={loadMetadataForPaths}
    >
      {renderCodeView}
    </RepoFiles>
  )
}
