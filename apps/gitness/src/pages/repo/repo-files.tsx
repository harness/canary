import { useEffect, useMemo, useState } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  Button,
  ButtonGroup,
  Icon,
  ListActions,
  SearchBox,
  Spacer,
  Text
} from '@harnessio/canary'
import {
  BranchSelector,
  SkeletonList,
  Summary,
  FileProps,
  SummaryItemType,
  NoData,
  SandboxLayout
} from '@harnessio/playground'
import {
  useListBranchesQuery,
  useGetContentQuery,
  useFindRepositoryQuery,
  pathDetails,
  RepoPathsDetailsOutput,
  GitPathDetails,
  OpenapiGetContentOutput,
  OpenapiContentInfo
} from '@harnessio/code-service-client'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { getTrimmedSha, normalizeGitRef } from '../../utils/git-utils'
import { timeAgo } from '../pipeline-edit/utils/time-utils'

export const RepoFiles: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<FileProps[]>([])
  const repoRef = useGetRepoRef()

  const { data: repository } = useFindRepositoryQuery({ repo_ref: repoRef })

  const { data: branches } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: { include_commit: false, sort: 'date', order: 'asc', limit: 20, page: 1, query: '' }
  })

  const [selectedBranch, setSelectedBranch] = useState<string>('')

  const branchList = branches?.map(item => ({
    name: item?.name
  }))

  const { data: repoDetails } = useGetContentQuery({
    path: '',
    repo_ref: repoRef,
    queryParams: { include_commit: true, git_ref: normalizeGitRef(selectedBranch) }
  })

  const repoEntryPathToFileTypeMap = useMemo((): Map<string, OpenapiGetContentOutput['type']> => {
    if (repoDetails?.content?.entries?.length === 0) return new Map()
    const nonEmtpyPathEntries = repoDetails?.content?.entries?.filter(entry => !!entry.path) || []
    return new Map(nonEmtpyPathEntries.map((entry: OpenapiContentInfo) => [entry?.path ? entry.path : '', entry.type]))
  }, [repoDetails?.content?.entries])

  const getSummaryItemType = (type: OpenapiGetContentOutput['type']): SummaryItemType => {
    if (type === 'dir') {
      return SummaryItemType.Folder
    }
    return SummaryItemType.File
  }

  useEffect(() => {
    setLoading(true)
    if (repoEntryPathToFileTypeMap.size > 0) {
      pathDetails({
        queryParams: { git_ref: normalizeGitRef(selectedBranch) },
        body: { paths: Array.from(repoEntryPathToFileTypeMap.keys()) },
        repo_ref: repoRef
      })
        .then((response: RepoPathsDetailsOutput) => {
          if (response?.details && response.details.length > 0) {
            setFiles(
              response.details.map(
                (item: GitPathDetails) =>
                  ({
                    id: item?.path || '',
                    type: item?.path
                      ? getSummaryItemType(repoEntryPathToFileTypeMap.get(item.path))
                      : SummaryItemType.File,
                    name: item?.path || '',
                    lastCommitMessage: item?.last_commit?.message || '',
                    timestamp: item?.last_commit?.author?.when ? timeAgo(item.last_commit.author.when) : '',
                    user: { name: item?.last_commit?.author?.identity?.name },
                    sha: item?.last_commit?.sha && getTrimmedSha(item.last_commit.sha)
                  }) as FileProps
              )
            )
          }
        })
        .catch()
        .finally(() => {
          setLoading(false)
        })
    }
  }, [repoEntryPathToFileTypeMap.size, repoRef])

  useEffect(() => {
    if (repository) {
      setSelectedBranch(repository?.default_branch || '')
    }
  }, [repository])

  const selectBranch = (branch: string) => {
    setSelectedBranch(branch)
  }

  const renderListContent = () => {
    if (loading) return <SkeletonList />

    if (!loading && repoEntryPathToFileTypeMap.size > 0) {
      const { author, message, sha } = repoDetails?.latest_commit || {}
      return (
        <Summary
          latestFile={{
            user: {
              name: author?.identity?.name || ''
            },
            lastCommitMessage: message || '',
            timestamp: author?.when && timeAgo(author.when),
            sha: sha && getTrimmedSha(sha)
          }}
          files={files}
        />
      )
    } else
      return (
        <NoData
          insideTabView
          iconName="no-data-folder"
          title="No files yet"
          description={['There are no files in this repository yet.', 'Create new or import an existing file.']}
          primaryButton={{ label: 'Create file' }}
          secondaryButton={{ label: 'Import file' }}
        />
      )
  }

  function Sidebar() {
    return (
      <div className="flex flex-col gap-5">
        <div className="w-full grid grid-cols-[1fr] auto-cols-auto grid-flow-col gap-3 items-center">
          <BranchSelector size="sm" name={selectedBranch} branchList={branchList} selectBranch={selectBranch} />
          <ButtonGroup.Root
            spacing="0"
            className="shadow-border shadow-[inset_0_0_0_1px] rounded-md h-full overflow-hidden">
            <Button size="sm" variant="ghost" className="rounded-none p-0 w-8">
              <Icon size={15} name="add-folder" className="text-primary/80" />
            </Button>
            <Button size="sm" variant="ghost" borderRadius="0" className="border-l rounded-none p-0 w-8">
              <Icon size={15} name="add-file" className="text-primary/80" />
            </Button>
          </ButtonGroup.Root>
        </div>
        <SearchBox.Root width="full" placeholder="Search" />
        <div className="flex flex-col">
          <Accordion type="multiple">
            {repoDetails?.content?.entries?.length &&
              repoDetails?.content?.entries.map((item, idx) => (
                <AccordionItem key={idx} value={idx.toString()} className="border-none">
                  <AccordionTrigger className="text-tertiary-background py-1.5">
                    <div className="flex gap-1.5 items-center">
                      <Icon name={item.type === 'dir' ? 'folder' : 'file'} size={14} />
                      <Text className="text-inherit">{item.name}</Text>
                    </div>
                  </AccordionTrigger>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
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
      <SandboxLayout.Main fullWidth hasLeftSubPanel>
        <SandboxLayout.Content>
          <ListActions.Root>
            <ListActions.Left>
              <ButtonGroup.Root spacing="2">
                <Text size={2} color="tertiaryBackground">
                  {repository?.identifier}
                </Text>
                <Text size={2} color="tertiaryBackground">
                  /
                </Text>
              </ButtonGroup.Root>
            </ListActions.Left>
            <ListActions.Right>
              <Button variant="outline" size="sm">
                Add file&nbsp;&nbsp;
                <Icon name="chevron-down" size={11} className="chevron-down" />
              </Button>
            </ListActions.Right>
          </ListActions.Root>
          <Spacer size={5} />
          {renderListContent()}
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    </>
  )
}
