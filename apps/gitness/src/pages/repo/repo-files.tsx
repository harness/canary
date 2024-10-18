import { useEffect, useState } from 'react'
import { useParams, useNavigate, Outlet } from 'react-router-dom'
import { BranchSelector, SandboxLayout } from '@harnessio/playground'
import {
  useListBranchesQuery,
  useFindRepositoryQuery,
  useGetContentQuery,
  getContent
} from '@harnessio/code-service-client'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { PathParams } from '../../RouteDefinitions'
import Explorer from '../../components/FileExplorer'
import { FILE_SEPERATOR, normalizeGitRef } from '../../utils/git-utils'
import { Button, ButtonGroup, Icon } from '@harnessio/canary'

export const RepoFiles: React.FC = () => {
  const repoRef = useGetRepoRef()
  const { spaceId, repoId, gitRef, resourcePath } = useParams<PathParams>()
  const subResourcePath = useParams()['*'] || ''
  const fullResourcePath = subResourcePath ? `${resourcePath}/${subResourcePath}` : resourcePath
  const navigate = useNavigate()

  const [selectedBranch, setSelectedBranch] = useState<string>(gitRef || '')

  const { data: repository } = useFindRepositoryQuery({ repo_ref: repoRef })

  const { data: branches } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: { include_commit: false, sort: 'date', order: 'asc', limit: 20, page: 1, query: '' }
  })

  const { data: repoDetails } = useGetContentQuery({
    path: '',
    repo_ref: repoRef,
    queryParams: { include_commit: true, git_ref: normalizeGitRef(selectedBranch) }
  })

  const branchList = branches?.map(item => ({
    name: item?.name
  }))

  useEffect(() => {
    if (repository && !gitRef) {
      setSelectedBranch(repository?.default_branch || '')
    } else if (gitRef) {
      setSelectedBranch(gitRef)
    }
  }, [repository, gitRef])

  const selectBranch = (branch: string) => {
    setSelectedBranch(branch)
    navigate(`/${spaceId}/repos/${repoId}/code/${branch}`)
  }

  const navigateToNewFile = () => {
    if (fullResourcePath) {
      getContent({
        path: fullResourcePath || '',
        repo_ref: repoRef,
        queryParams: { include_commit: true, git_ref: normalizeGitRef(selectedBranch) }
      }).then(response => {
        if (response.type === 'dir') {
          navigate(`/${spaceId}/repos/${repoId}/code/new/${gitRef}/~/${fullResourcePath}`)
        } else {
          const parentDirPath = fullResourcePath?.split(FILE_SEPERATOR).slice(0, -1).join(FILE_SEPERATOR)
          navigate(`/${spaceId}/repos/${repoId}/code/new/${gitRef}/~/${parentDirPath}`)
        }
      })
    } else {
      navigate(`/${spaceId}/repos/${repoId}/code/new/${gitRef || selectedBranch}/~/`)
    }
  }

  function Sidebar() {
    return (
      <div className="flex flex-col gap-5">
        <div className="w-full grid grid-cols-[1fr] auto-cols-auto grid-flow-col gap-3 items-center">
          <BranchSelector size="sm" name={selectedBranch} branchList={branchList} selectBranch={selectBranch} />
          <ButtonGroup.Root
            spacing="0"
            className="shadow-border shadow-[inset_0_0_0_1px] rounded-md h-full overflow-hidden">
            {/* <Button size="sm" variant="ghost" className="rounded-none p-0 w-8">
              <Icon size={15} name="add-folder" className="text-primary/80" />
            </Button> */}
            <Button
              size="sm"
              variant="ghost"
              borderRadius="0"
              className="border-l rounded-none p-0 w-8"
              onClick={navigateToNewFile}>
              <Icon size={15} name="add-file" className="text-primary/80" />
            </Button>
          </ButtonGroup.Root>
        </div>
        {/* <Filter /> */}
        {/*  Add back when search api is available  
          <SearchBox.Root width="full" placeholder="Search" /> 
        */}
        {repoDetails?.content?.entries?.length && (
          <Explorer repoDetails={repoDetails} selectedBranch={selectedBranch} />
        )}
      </div>
    )
  }

  return (
    <>
      <SandboxLayout.LeftSubPanel hasHeader hasSubHeader>
        <SandboxLayout.Content>
          <Sidebar />
        </SandboxLayout.Content>
      </SandboxLayout.LeftSubPanel>
      <Outlet />
    </>
  )
}
