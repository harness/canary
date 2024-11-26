import { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

import {
  getContent,
  useFindRepositoryQuery,
  useGetContentQuery,
  useListBranchesQuery,
  useListPathsQuery
} from '@harnessio/code-service-client'
import { BranchSelectorListItem, RepoSidebar as RepoSidebarView } from '@harnessio/ui/views'

import Explorer from '../../components/FileExplorer'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath.ts'
import { PathParams } from '../../RouteDefinitions.ts'
import { FILE_SEPERATOR, normalizeGitRef } from '../../utils/git-utils.ts'

/**
 * TODO: This code was migrated from V2.
 * @constructor
 */
export const RepoSidebar = () => {
  const repoRef = useGetRepoRef()
  const { spaceId, repoId, gitRef, resourcePath } = useParams<PathParams>()
  const subResourcePath = useParams()['*'] || ''
  const fullResourcePath = subResourcePath ? `${resourcePath}/${subResourcePath}` : resourcePath
  const [selectedBranch, setSelectedBranch] = useState<BranchSelectorListItem>({ name: gitRef || '', sha: '' })
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

  const branchList: BranchSelectorListItem[] = useMemo(() => {
    if (!branches?.body) return []

    return branches.body.map(item => ({
      name: item?.name || '',
      sha: item?.sha || '',
      default: item?.name === repository?.body?.default_branch
    }))
  }, [branches, repository?.body?.default_branch])

  useEffect(() => {
    if (!repository?.body?.default_branch || !branchList.length) {
      return
    }

    if (!gitRef) {
      const defaultBranch = branchList.find(branch => branch.default)
      if (defaultBranch) {
        setSelectedBranch(defaultBranch)
      }
    } else {
      const selectedGitRef = branchList.find(branch => branch.name === gitRef)
      if (selectedGitRef) {
        setSelectedBranch(selectedGitRef)
      }
    }
  }, [repository?.body?.default_branch, gitRef, branchList])

  const { data: repoDetails } = useGetContentQuery({
    path: '',
    repo_ref: repoRef,
    queryParams: {
      include_commit: true,
      git_ref: normalizeGitRef(selectedBranch.name)
    }
  })

  const { data: filesData } = useListPathsQuery({
    repo_ref: repoRef,
    queryParams: { git_ref: normalizeGitRef(selectedBranch.name) }
  })

  const filesList = filesData?.body?.files || []

  const selectBranch = useCallback(
    (branchName: BranchSelectorListItem) => {
      const branch = branchList.find(b => b.name === branchName.name)
      if (branch) {
        setSelectedBranch(branch)
        navigate(`/${spaceId}/repos/${repoId}/code/${branch.name}`)
      }
    },
    [navigate, repoId, spaceId, branchList]
  )

  const navigateToNewFile = useCallback(() => {
    if (fullResourcePath) {
      getContent({
        path: fullResourcePath || '',
        repo_ref: repoRef,
        queryParams: {
          include_commit: true,
          git_ref: normalizeGitRef(selectedBranch.name)
        }
      }).then(response => {
        if (response.body.type === 'dir') {
          navigate(`/${spaceId}/repos/${repoId}/code/new/${gitRef || selectedBranch.name}/~/${fullResourcePath}`)
        } else {
          const parentDirPath = fullResourcePath?.split(FILE_SEPERATOR).slice(0, -1).join(FILE_SEPERATOR)
          navigate(`/${spaceId}/repos/${repoId}/code/new/${gitRef || selectedBranch.name}/~/${parentDirPath}`)
        }
      })
    } else {
      navigate(`/${spaceId}/repos/${repoId}/code/new/${gitRef || selectedBranch.name}/~/`)
    }
  }, [fullResourcePath, gitRef, navigate, repoId, repoRef, selectedBranch.name, spaceId])

  const navigateToFile = useCallback(
    (filePath: string) => {
      navigate(`/${spaceId}/repos/${repoId}/code/${gitRef || selectedBranch.name}/~/${filePath}`)
    },
    [gitRef, selectedBranch.name, navigate, repoId, spaceId]
  )

  // TODO: repoId and spaceId must be defined
  if (!repoId || !spaceId) return <></>

  return (
    <>
      <RepoSidebarView
        hasHeader
        hasSubHeader
        repoId={repoId}
        spaceId={spaceId}
        selectedBranch={selectedBranch}
        selectBranch={selectBranch}
        branchList={branchList}
        tagList={[]}
        // TODO: new props navigateToNewFolder
        navigateToNewFolder={() => {}}
        navigateToNewFile={navigateToNewFile}
        navigateToFile={navigateToFile}
        filesList={filesList}
      >
        {repoDetails?.body?.content?.entries?.length && (
          <Explorer repoDetails={repoDetails?.body} selectedBranch={selectedBranch.name} />
        )}
      </RepoSidebarView>
      <Outlet />
    </>
  )
}
