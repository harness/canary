import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  GitPathDetails,
  OpenapiContentInfo,
  OpenapiGetContentOutput,
  pathDetails,
  useCalculateCommitDivergenceMutation,
  useGetContentQuery
} from '@harnessio/code-service-client'
import {
  BranchSelectorTab,
  CodeModes,
  CommitDivergenceType,
  RepoFile,
  RepoFiles,
  SummaryItemType
} from '@harnessio/ui/views'

import FileContentViewer from '../../components-v2/file-content-viewer'
import { FileEditor } from '../../components-v2/file-editor'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useGitRef } from '../../hooks/useGitRef'
import { PathParams } from '../../RouteDefinitions'
import { sortFilesByType } from '../../utils/common-utils'
import { FILE_SEPERATOR, getTrimmedSha, normalizeGitRef, REFS_TAGS_PREFIX } from '../../utils/git-utils'
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
    rawFullGitRef,
    rawGitRefName,
    fullResourcePath,
    preSelectedTab,
    setPreSelectedTab
  } = useGitRef()
  const repoPath = `${routes.toRepoFiles({ spaceId, repoId })}/${rawFullGitRef}`

  // TODO: pathParts - should have all data for files path breadcrumbs
  const pathParts = [
    {
      path: repoId!,
      parentPath: repoPath
    },
    ...splitPathWithParents(fullResourcePath || '', repoPath)
  ]
  const [files, setFiles] = useState<RepoFile[]>([])
  const [loading, setLoading] = useState(false)
  const [currBranchDivergence, setCurrBranchDivergence] = useState<CommitDivergenceType>({ ahead: 0, behind: 0 })
  const {
    data: { body: repoDetails } = {},
    refetch: refetchRepoContent,
    isLoading: isLoadingRepoDetails
  } = useGetContentQuery({
    path: fullResourcePath || '',
    repo_ref: repoRef,
    queryParams: { include_commit: true, git_ref: normalizeGitRef(rawFullGitRef || '') }
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

  const getSummaryItemType = (type: OpenapiGetContentOutput['type']): SummaryItemType => {
    if (type === 'dir') {
      return SummaryItemType.Folder
    }
    return SummaryItemType.File
  }

  const getLastPathSegment = (path: string) => {
    if (!path || /^\/+$/.test(path)) {
      return ''
    }
    path = path.replace(/\/+$/, '')
    return path.split('/').pop()
  }

  useEffect(() => {
    if (repoEntryPathToFileTypeMap.size > 0) {
      setLoading(true)
      pathDetails({
        queryParams: { git_ref: normalizeGitRef(rawFullGitRef || '') },
        body: { paths: Array.from(repoEntryPathToFileTypeMap.keys()) },
        repo_ref: repoRef
      })
        .then(({ body: response }) => {
          if (response?.details && response.details.length > 0) {
            setFiles(
              sortFilesByType(
                response.details.map((item: GitPathDetails) => ({
                  id: item?.path || '',
                  type: item?.path
                    ? getSummaryItemType(repoEntryPathToFileTypeMap.get(item.path))
                    : SummaryItemType.File,
                  name: getLastPathSegment(item?.path || '') || '',
                  lastCommitMessage: item?.last_commit?.message || '',
                  timestamp: item?.last_commit?.author?.when ?? '',
                  user: { name: item?.last_commit?.author?.identity?.name || '' },
                  sha: item?.last_commit?.sha && getTrimmedSha(item.last_commit.sha),
                  path: `${routes.toRepoFiles({ spaceId, repoId })}/${rawFullGitRef || ''}/~/${item?.path}`
                }))
              )
            )
          }
        })
        .catch()
        .finally(() => {
          setLoading(false)
        })
    }
  }, [repoEntryPathToFileTypeMap.size, repoRef, rawFullGitRef])

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
        return `new/${rawFullGitRef}/~/${fullResourcePath}`
      }

      const parentDirPath = fullResourcePath?.split(FILE_SEPERATOR).slice(0, -1).join(FILE_SEPERATOR)
      return `new/${rawFullGitRef}/~/${parentDirPath}`
    }

    return `new/${rawFullGitRef}/~/`
  }, [rawFullGitRef, fullResourcePath, repoDetails])

  useEffect(() => {
    if (rawFullGitRef && repoData?.default_branch) {
      calculateDivergence({
        repo_ref: repoRef,
        body: {
          requests: [{ from: rawFullGitRef, to: repoData?.default_branch }]
        }
      })
    }
  }, [rawFullGitRef, repoData?.default_branch, calculateDivergence])

  useEffect(() => {
    refetchRepoContent()
  }, [codeMode, refetchRepoContent])

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
      isRepoEmpty={repoData?.is_empty}
      isDir={repoDetails?.type === 'dir'}
      isShowSummary={!!repoEntryPathToFileTypeMap.size}
      latestFile={latestFiles}
      pathNewFile={pathToNewFile}
      pathUploadFiles="/upload-file"
      codeMode={codeMode}
      selectedBranchTag={{ name: rawGitRefName, sha: '' }}
      repoId={repoId}
      spaceId={spaceId!}
      selectedRefType={preSelectedTab}
      defaultBranchName={repoData?.default_branch}
      currentBranchDivergence={currBranchDivergence}
      isLoadingRepoDetails={isLoadingRepoDetails}
      toRepoFileDetails={({ path }: { path: string }) => `../${path}`}
    >
      {renderCodeView}
    </RepoFiles>
  )
}
