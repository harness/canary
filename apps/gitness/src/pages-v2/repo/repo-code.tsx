import { useEffect, useMemo, useState } from 'react'

import {
  GitPathDetails,
  OpenapiContentInfo,
  OpenapiGetContentOutput,
  pathDetails,
  useCalculateCommitDivergenceMutation,
  useFindRepositoryQuery,
  useGetContentQuery
} from '@harnessio/code-service-client'
import { CodeModes, CommitDivergenceType, RepoFile, RepoFiles, SummaryItemType } from '@harnessio/ui/views'

import FileContentViewer from '../../components-v2/file-content-viewer'
import { FileEditor } from '../../components-v2/file-editor'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import useCodePathDetails from '../../hooks/useCodePathDetails'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { timeAgoFromISOTime } from '../../pages/pipeline-edit/utils/time-utils'
import { FILE_SEPERATOR, getTrimmedSha, normalizeGitRef } from '../../utils/git-utils'
import { splitPathWithParents } from '../../utils/path-utils'
import { useRepoBranchesStore } from './stores/repo-branches-store'

/**
 * TODO: This code was migrated from V2 and needs to be refactored.
 */
export const RepoCode = () => {
  const repoRef = useGetRepoRef()
  const { spaceId, repoId, selectedBranchTag } = useRepoBranchesStore()
  const { codeMode, fullGitRef, gitRefName, fullResourcePath } = useCodePathDetails()
  const routes = useRoutes()
  const repoPath = `${routes.toRepoFiles({ spaceId, repoId })}/${fullGitRef}`

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
  const [selectedBranch, setSelectedBranch] = useState(gitRefName || '')
  const [currBranchDivergence, setCurrBranchDivergence] = useState<CommitDivergenceType>({ ahead: 0, behind: 0 })

  const { data: { body: repoDetails } = {}, refetch: refetchRepoContent } = useGetContentQuery({
    path: fullResourcePath || '',
    repo_ref: repoRef,
    queryParams: { include_commit: true, git_ref: normalizeGitRef(fullGitRef || '') }
  })
  const { data: { body: repository } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })
  const { data: { body: branchDivergence = [] } = {}, mutate: calculateDivergence } =
    useCalculateCommitDivergenceMutation({
      repo_ref: repoRef
    })

  useEffect(() => {
    if (repository && !fullGitRef) {
      setSelectedBranch(repository?.default_branch || '')
    } else if (fullGitRef) {
      setSelectedBranch(fullGitRef)
    }
  }, [repository, fullGitRef])

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
        queryParams: { git_ref: normalizeGitRef(fullGitRef || '') },
        body: { paths: Array.from(repoEntryPathToFileTypeMap.keys()) },
        repo_ref: repoRef
      })
        .then(({ body: response }) => {
          if (response?.details && response.details.length > 0) {
            setFiles(
              response.details.map(
                (item: GitPathDetails) =>
                  ({
                    id: item?.path || '',
                    type: item?.path
                      ? getSummaryItemType(repoEntryPathToFileTypeMap.get(item.path))
                      : SummaryItemType.File,
                    name: getLastPathSegment(item?.path || ''),
                    lastCommitMessage: item?.last_commit?.message || '',
                    timestamp: item?.last_commit?.author?.when ? timeAgoFromISOTime(item.last_commit.author.when) : '',
                    user: { name: item?.last_commit?.author?.identity?.name },
                    sha: item?.last_commit?.sha && getTrimmedSha(item.last_commit.sha),
                    path: `${fullGitRef || selectedBranch}/~/${item?.path}`
                  }) as RepoFile
              )
            )
          }
        })
        .catch()
        .finally(() => {
          setLoading(false)
        })
    }
  }, [repoEntryPathToFileTypeMap.size, repoRef, selectedBranch])

  const latestFiles = useMemo(() => {
    const { author, message, sha } = repoDetails?.latest_commit || {}

    return {
      user: {
        name: author?.identity?.name || ''
      },
      lastCommitMessage: message || '',
      timestamp: author?.when ? timeAgoFromISOTime(author.when) : '',
      sha: sha && getTrimmedSha(sha)
    }
  }, [repoDetails?.latest_commit])

  const pathToNewFile = useMemo(() => {
    if (fullResourcePath && repoDetails) {
      if (repoDetails?.type === 'dir') {
        return `new/${fullGitRef || selectedBranchTag.name}/~/${fullResourcePath}`
      }

      const parentDirPath = fullResourcePath?.split(FILE_SEPERATOR).slice(0, -1).join(FILE_SEPERATOR)
      return `new/${fullGitRef || selectedBranchTag.name}/~/${parentDirPath}`
    }

    return `new/${fullGitRef || selectedBranchTag.name}/~/`
  }, [fullGitRef, fullResourcePath, repoDetails, selectedBranchTag.name])

  useEffect(() => {
    if (fullGitRef) {
      calculateDivergence({
        body: {
          requests: [{ from: selectedBranchTag.name, to: repository?.default_branch }]
        }
      })
    }
  }, [fullGitRef])

  useEffect(() => {
    refetchRepoContent()
  }, [codeMode])

  /**
   * Render File content view or Edit file view
   */
  const renderCodeView = useMemo(() => {
    if (codeMode === CodeModes.VIEW && !!repoDetails?.type && repoDetails.type !== 'dir') {
      return <FileContentViewer repoContent={repoDetails} />
    }

    if (codeMode !== CodeModes.VIEW) {
      return <FileEditor repoDetails={repoDetails} defaultBranch={repository?.default_branch || ''} />
    }

    return <></>
  }, [codeMode, repoDetails, repository?.default_branch])

  if (!repoId) return <></>

  return (
    <>
      <RepoFiles
        pathParts={pathParts}
        loading={loading}
        files={files}
        isDir={repoDetails?.type === 'dir'}
        isShowSummary={!!repoEntryPathToFileTypeMap.size}
        latestFile={latestFiles}
        useTranslationStore={useTranslationStore}
        pathNewFile={pathToNewFile}
        // TODO: add correct path to Upload files page
        pathUploadFiles="/upload-file"
        codeMode={codeMode}
        useRepoBranchesStore={useRepoBranchesStore}
        defaultBranchName={repository?.default_branch}
        currentBranchDivergence={currBranchDivergence}
      >
        {renderCodeView}
      </RepoFiles>
    </>
  )
}
