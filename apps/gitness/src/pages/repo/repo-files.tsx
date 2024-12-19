import { useCallback, useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

import { Button, ButtonGroup, Icon } from '@harnessio/canary'
import {
  getContent,
  OpenapiGetContentOutput,
  useFindRepositoryQuery,
  useGetContentQuery,
  useListBranchesQuery,
  useListPathsQuery
} from '@harnessio/code-service-client'
import { BranchListProps, BranchSelector, SandboxLayout, SearchFiles } from '@harnessio/views'

import Explorer from '../../components/FileExplorer'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { PathParams } from '../../RouteDefinitions'
import { FILE_SEPERATOR, normalizeGitRef } from '../../utils/git-utils'

interface SidebarProps {
  selectedBranch: string
  selectBranch: (branch: string) => void
  branchList: BranchListProps[] | undefined
  navigateToNewFile: () => void
  navigateToFile: (file: string) => void
  filesList: string[] | undefined
  repoDetails: OpenapiGetContentOutput | undefined
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedBranch,
  selectBranch,
  branchList,
  navigateToNewFile,
  navigateToFile,
  filesList,
  repoDetails
}) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid w-full auto-cols-auto grid-flow-col grid-cols-[1fr] items-center gap-3">
        {branchList && (
          <BranchSelector size="sm" name={selectedBranch} branchList={branchList} selectBranch={selectBranch} />
        )}
        <ButtonGroup.Root
          spacing="0"
          className="h-full overflow-hidden rounded-md shadow-[inset_0_0_0_1px] shadow-border"
        >
          <Button size="sm" variant="ghost" className="w-8 rounded-none border-l p-0" onClick={navigateToNewFile}>
            <Icon size={15} name="add-file" className="text-primary/80" />
          </Button>
        </ButtonGroup.Root>
      </div>
      <SearchFiles navigateToFile={navigateToFile} filesList={filesList} />
      {repoDetails?.content?.entries?.length && <Explorer repoDetails={repoDetails} selectedBranch={selectedBranch} />}
    </div>
  )
}

export const RepoFiles: React.FC = () => {
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

  const { data: repoDetails } = useGetContentQuery({
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
      <SandboxLayout.LeftSubPanel>
        <SandboxLayout.Content>
          <Sidebar
            selectedBranch={selectedBranch}
            selectBranch={selectBranch}
            branchList={branchList}
            navigateToNewFile={navigateToNewFile}
            navigateToFile={navigateToFile}
            filesList={filesList}
            repoDetails={repoDetails?.body}
          />
        </SandboxLayout.Content>
      </SandboxLayout.LeftSubPanel>
      <Outlet />
    </>
  )
}
