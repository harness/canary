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

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { timeAgoFromISOTime } from '../../pages/pipeline-edit/utils/time-utils'
import { PathParams } from '../../RouteDefinitions'
import { getTrimmedSha, normalizeGitRef } from '../../utils/git-utils'
import { splitPathWithParents } from '../../utils/path-utils'

/**
 * TODO: This code was migrated from V2 and needs to be refactored.
 */
export const RepoCode = () => {
  const repoRef = useGetRepoRef()
  const { spaceId, repoId, gitRef, resourcePath } = useParams<PathParams>()
  const subResourcePath = useParams()['*'] || ''
  const repoPath = `/${spaceId}/repos/${repoId}/code/${gitRef}`
  const fullResourcePath = subResourcePath ? resourcePath + '/' + subResourcePath : resourcePath
  // TODO: pathParts - should have all data for files path breadcrumbs
  const pathParts = [
    {
      path: repoId!,
      parentPath: repoPath
    },
    ...splitPathWithParents(fullResourcePath || '')
  ]
  const [files, setFiles] = useState<RepoFile[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<string>(gitRef || '')

  const { data: { body: repoDetails } = {} } = useGetContentQuery({
    path: fullResourcePath || '',
    repo_ref: repoRef,
    queryParams: { include_commit: true, git_ref: normalizeGitRef(gitRef || '') }
  })
  const { data: { body: repository } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })

  useEffect(() => {
    if (repository && !gitRef) {
      setSelectedBranch(repository?.default_branch || '')
    } else if (gitRef) {
      setSelectedBranch(gitRef)
    }
  }, [repository, gitRef])

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
        queryParams: { git_ref: normalizeGitRef(gitRef || '') },
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
                    path: `/${spaceId}/repos/${repoId}/code/${gitRef || selectedBranch}/~/${item?.path}`
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

  return (
    <RepoFiles
      pathParts={pathParts}
      loading={loading}
      files={files}
      isDir={repoDetails?.type === 'dir'}
      isShowSummary={repoEntryPathToFileTypeMap.size > 0}
      latestFile={latestFiles}
    >
      <>
        {/*
          TODO: Here, the FileContentViewer will need to be passed as a child component,
          but it hasn’t yet undergone the work of migrating components to the UI directory.
        */}
        {'Test'}
      </>
    </RepoFiles>
  )
}
