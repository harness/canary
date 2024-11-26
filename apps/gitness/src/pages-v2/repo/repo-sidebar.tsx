import { useCallback, useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

import {
  getContent,
  useFindRepositoryQuery,
  useGetContentQuery,
  useListBranchesQuery,
  useListPathsQuery
} from '@harnessio/code-service-client'
import { BranchListProps } from '@harnessio/ui/components'
import { RepoSidebar as RepoSidebarView } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath.ts'
import { PathParams } from '../../RouteDefinitions.ts'
import { FILE_SEPERATOR, normalizeGitRef } from '../../utils/git-utils.ts'

export const RepoSidebar = () => {
  const repoRef = useGetRepoRef()
  const { spaceId, repoId, gitRef, resourcePath } = useParams<PathParams>()
  const subResourcePath = useParams()['*'] || ''
  const fullResourcePath = subResourcePath ? `${resourcePath}/${subResourcePath}` : resourcePath
  const [selectedBranch, setSelectedBranch] = useState<string>(gitRef || '')
  const navigate = useNavigate()

  const { data: repository } = useFindRepositoryQuery({ repo_ref: repoRef })

  const { data: branches } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: {
      include_commit: false,
      sort: 'date',
      order: 'asc',
      limit: 20,
      page: 1,
      query: ''
    }
  })

  const { data: _repoDetails } = useGetContentQuery({
    path: '',
    repo_ref: repoRef,
    queryParams: {
      include_commit: true,
      git_ref: normalizeGitRef(selectedBranch)
    }
  })

  const branchList: BranchListProps[] | undefined = branches?.body?.map(item => ({
    name: item?.name || ''
  }))

  const { data: filesData } = useListPathsQuery({
    repo_ref: repoRef,
    queryParams: { git_ref: normalizeGitRef(selectedBranch) }
  })

  const filesList = filesData?.body?.files || []

  useEffect(() => {
    if (repository?.body?.default_branch && !gitRef) {
      setSelectedBranch(repository.body.default_branch)
    } else if (gitRef) {
      setSelectedBranch(gitRef)
    }
  }, [repository?.body?.default_branch, gitRef])

  const selectBranch = useCallback(
    (branch: string) => {
      setSelectedBranch(branch)
      navigate(`/spaces/${spaceId}/repos/${repoId}/code/${branch}`)
    },
    [navigate, repoId, spaceId]
  )

  const navigateToNewFile = useCallback(() => {
    if (fullResourcePath) {
      getContent({
        path: fullResourcePath || '',
        repo_ref: repoRef,
        queryParams: {
          include_commit: true,
          git_ref: normalizeGitRef(selectedBranch)
        }
      }).then(response => {
        if (response.body.type === 'dir') {
          navigate(`/spaces/${spaceId}/repos/${repoId}/code/new/${gitRef || selectedBranch}/~/${fullResourcePath}`)
        } else {
          const parentDirPath = fullResourcePath?.split(FILE_SEPERATOR).slice(0, -1).join(FILE_SEPERATOR)
          navigate(`/spaces/${spaceId}/repos/${repoId}/code/new/${gitRef || selectedBranch}/~/${parentDirPath}`)
        }
      })
    } else {
      navigate(`/spaces/${spaceId}/repos/${repoId}/code/new/${gitRef || selectedBranch}/~/`)
    }
  }, [fullResourcePath, gitRef, navigate, repoId, repoRef, selectedBranch, spaceId])

  const navigateToFile = useCallback(
    (filePath: string) => {
      navigate(`/spaces/${spaceId}/repos/${repoId}/code/${gitRef || selectedBranch}/~/${filePath}`)
    },
    [gitRef, selectedBranch, navigate, repoId, spaceId]
  )

  return (
    <>
      <RepoSidebarView
        hasHeader
        hasSubHeader
        selectedBranch={selectedBranch}
        selectBranch={selectBranch}
        branchList={branchList}
        navigateToNewFile={navigateToNewFile}
        navigateToFile={navigateToFile}
        filesList={filesList}
        // repoDetails={repoDetails?.body}
      />
      <Outlet />
    </>
  )
}
