import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  GitPathDetails,
  OpenapiContentInfo,
  OpenapiGetContentOutput,
  pathDetails,
  useFindRepositoryQuery,
  useGetContentQuery
} from '@harnessio/code-service-client'
import { RepoFile, RepoFiles, SummaryItemType } from '@harnessio/ui/views'

import FileContentViewer from '../../components-v2/file-content-viewer'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import useCodePathDetails, { CodeModes } from '../../hooks/useCodePathDetails'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { timeAgoFromISOTime } from '../../pages/pipeline-edit/utils/time-utils'
import { PathParams } from '../../RouteDefinitions'
import { FILE_SEPERATOR, getTrimmedSha, normalizeGitRef } from '../../utils/git-utils'
import { splitPathWithParents } from '../../utils/path-utils'
import { useRepoBranchesStore } from './stores/repo-branches-store'

/**
 * TODO: This code was migrated from V2 and needs to be refactored.
 */
export const RepoCode = () => {
  const repoRef = useGetRepoRef()
  const { spaceId, repoId } = useParams<PathParams>()

  // TODO: Not sure what codeMode is used for; it needs to be reviewed, and the condition for rendering the FileContentViewer component may need to be adjusted or fixed.
  const { codeMode, fullGitRef, gitRefName, fullResourcePath } = useCodePathDetails()
  const repoPath = `/${spaceId}/repos/${repoId}/code/${fullGitRef}`

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
  const [selectedBranch, setSelectedBranch] = useState<string>(gitRefName || '')

  const { data: { body: repoDetails } = {} } = useGetContentQuery({
    path: fullResourcePath || '',
    repo_ref: repoRef,
    queryParams: { include_commit: true, git_ref: normalizeGitRef(fullGitRef || '') }
  })
  const { data: { body: repository } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })

  useEffect(() => {
    if (repository && !fullGitRef) {
      setSelectedBranch(repository?.default_branch || '')
    } else if (fullGitRef) {
      setSelectedBranch(fullGitRef)
    }
  }, [repository, fullGitRef])

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
    setLoading(true)
    if (repoEntryPathToFileTypeMap.size > 0) {
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

  if (!repoId) return <></>

  const { selectedBranchTag } = useRepoBranchesStore()

  const pathToNewFile = useMemo(() => {
    if (fullResourcePath && repoDetails) {
      if (repoDetails?.type === 'dir') {
        return `new/${fullGitRef || selectedBranchTag.name}/~/${fullResourcePath}`
      } else {
        const parentDirPath = fullResourcePath?.split(FILE_SEPERATOR).slice(0, -1).join(FILE_SEPERATOR)
        return `new/${fullGitRef || selectedBranchTag.name}/~/${parentDirPath}`
      }
    } else {
      return `new/${fullGitRef || selectedBranchTag.name}/~/`
    }
  }, [repoDetails])

  const renderCodeView = () => {
    if (codeMode === CodeModes.VIEW && !!repoDetails?.type && repoDetails.type !== 'dir') {
      return <FileContentViewer repoContent={repoDetails} />
    } else if (codeMode === CodeModes.EDIT) {
      // TODO: should render FileEditor
      return <></>
    } else if (codeMode === CodeModes.NEW) {
      // TODO: should render FileEditor with view for new file : empty filename + action to commit on top
      return <></>
    }
  }

  return (
    <RepoFiles
      pathParts={pathParts}
      loading={loading}
      files={files}
      isDir={repoDetails?.type === 'dir'}
      isShowSummary={!!repoEntryPathToFileTypeMap.size}
      latestFile={latestFiles}
      useTranslationStore={useTranslationStore}
      // TODO: add correct path to Create new file page
      pathNewFile={pathToNewFile}
      // TODO: add correct path to Upload files page
      pathUploadFiles="/upload-file"
      isEditFile={codeMode === CodeModes.EDIT}
      isNewFile={codeMode === CodeModes.NEW}
    >
      {renderCodeView()}
    </RepoFiles>
  )
}
