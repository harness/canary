import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Outlet } from 'react-router-dom'
import { BranchSelector, SandboxLayout, BranchListProps } from '@harnessio/playground'
import {
  Button,
  ButtonGroup,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  Icon,
  Popover,
  PopoverAnchor,
  PopoverContent,
  SearchBox,
  Text
} from '@harnessio/canary'
import {
  useListBranchesQuery,
  useFindRepositoryQuery,
  useGetContentQuery,
  getContent,
  useListPathsQuery,
  OpenapiGetContentOutput
} from '@harnessio/code-service-client'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { PathParams } from '../../RouteDefinitions'
import Explorer from '../../components/FileExplorer'
import { FILE_SEPERATOR, normalizeGitRef } from '../../utils/git-utils'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedBranch: string
  selectBranch: (branch: string) => void
  branchList: BranchListProps[] | undefined
  navigateToNewFile: () => void
  navigateToFile: (file: string) => void
  query: string
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  fileText: (file: string) => React.ReactNode
  filesList: string[] | undefined
  repoDetails: OpenapiGetContentOutput | undefined
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  selectedBranch,
  selectBranch,
  branchList,
  navigateToNewFile,
  navigateToFile,
  query,
  handleInputChange,
  fileText,
  filesList,
  repoDetails
}) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="w-full grid grid-cols-[1fr] auto-cols-auto grid-flow-col gap-3 items-center">
        {branchList && (
          <BranchSelector size="sm" name={selectedBranch} branchList={branchList} selectBranch={selectBranch} />
        )}
        <ButtonGroup.Root
          spacing="0"
          className="shadow-border shadow-[inset_0_0_0_1px] rounded-md h-full overflow-hidden">
          <Button size="sm" variant="ghost" className="border-l rounded-none p-0 w-8" onClick={navigateToNewFile}>
            <Icon size={15} name="add-file" className="text-primary/80" />
          </Button>
        </ButtonGroup.Root>
      </div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverAnchor asChild>
          <div>
            <SearchBox.Root
              width="full"
              placeholder="Search files..."
              className="h-9 searchbox"
              handleChange={handleInputChange}
              value={query}
            />
          </div>
        </PopoverAnchor>
        <PopoverContent
          className="w-[600px] max-h-60 p-0 overflow-auto"
          align="start"
          // Prevent focus from moving to the popover when it opens
          onOpenAutoFocus={event => {
            event.preventDefault()
          }}>
          <Command>
            <CommandList>
              <CommandEmpty>No file found.</CommandEmpty>
              <CommandGroup>
                {filesList?.map((file: string, idx: number) => (
                  <CommandItem
                    key={idx}
                    value={file}
                    onSelect={() => {
                      if (file) {
                        navigateToFile(file)
                        setIsOpen(false)
                      }
                    }}>
                    {fileText(file)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {repoDetails?.content?.entries?.length && <Explorer repoDetails={repoDetails} selectedBranch={selectedBranch} />}
    </div>
  )
}

export const RepoSandboxFiles: React.FC = () => {
  const repoRef = useGetRepoRef()
  const { spaceId, repoId, gitRef, resourcePath } = useParams<PathParams>()
  const subResourcePath = useParams()['*'] || ''
  const fullResourcePath = subResourcePath ? `${resourcePath}/${subResourcePath}` : resourcePath
  const navigate = useNavigate()

  const [selectedBranch, setSelectedBranch] = useState<string>(gitRef || '')
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

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

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setQuery(value)
      setIsOpen(value !== '')
    },
    [setQuery, setIsOpen]
  )

  const filteredFiles = useMemo(() => {
    return filesList?.filter(file => file.toLowerCase().includes(query.toLowerCase()))
  }, [query, filesList])

  const fileText = useCallback(
    (file: string) => {
      const matchIndex = file.toLowerCase().indexOf(query.toLowerCase())
      if (matchIndex === -1) {
        return <Text>{file}</Text>
      }
      const startText = file.slice(0, matchIndex)
      const matchedText = file.slice(matchIndex, matchIndex + query.length)
      const endText = file.slice(matchIndex + query.length)
      return (
        <Text>
          {startText}
          <mark>{matchedText}</mark>
          {endText}
        </Text>
      )
    },
    [query]
  )

  return (
    <>
      <SandboxLayout.LeftSubPanel hasHeader hasSubHeader>
        <SandboxLayout.Content>
          <Sidebar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            selectedBranch={selectedBranch}
            selectBranch={selectBranch}
            branchList={branchList}
            navigateToNewFile={navigateToNewFile}
            navigateToFile={navigateToFile}
            query={query}
            handleInputChange={handleInputChange}
            fileText={fileText}
            filesList={filteredFiles}
            repoDetails={repoDetails?.body}
          />
        </SandboxLayout.Content>
      </SandboxLayout.LeftSubPanel>
      <Outlet />
    </>
  )
}
