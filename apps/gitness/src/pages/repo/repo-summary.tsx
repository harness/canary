import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  Button,
  ButtonGroup,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  ListActions,
  Spacer,
  StackedList,
  Text,
  ToggleGroup,
  ToggleGroupItem
} from '@harnessio/canary'
import {
  GitPathDetails,
  OpenapiContentInfo,
  OpenapiGetContentOutput,
  pathDetails,
  RepoPathsDetailsOutput,
  useCreateTokenMutation,
  useFindRepositoryQuery,
  useGetContentQuery,
  useListBranchesQuery,
  useListPathsQuery,
  useSummaryQuery
} from '@harnessio/code-service-client'
import { SkeletonList } from '@harnessio/ui/components'
import {
  BranchSelector,
  CloneRepoDialog,
  FileProps,
  generateAlphaNumericHash,
  MarkdownViewer,
  NoData,
  RepoSummaryPanel,
  SandboxLayout,
  SearchFiles,
  Summary,
  SummaryItemType,
  useCommonFilter
} from '@harnessio/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { PathParams } from '../../RouteDefinitions'
import { decodeGitContent, getTrimmedSha, normalizeGitRef } from '../../utils/git-utils'
import { timeAgoFromISOTime } from '../pipeline-edit/utils/time-utils'
import { TokenFormType } from '../profile-settings/token-create/token-create-form'
import { TokenSuccessDialog } from '../profile-settings/token-create/token-success-dialog'

export default function RepoSummaryPage() {
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<FileProps[]>([])
  const repoRef = useGetRepoRef()
  const navigate = useNavigate()
  const { spaceId, repoId, gitRef } = useParams<PathParams>()

  const { data: { body: repository } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })

  const { data: { body: branches } = {} } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: { include_commit: false, sort: 'date', order: 'asc', limit: 20, page: 1, query: '' }
  })

  const [selectedBranch, setSelectedBranch] = useState<string>('')
  const [createdTokenData, setCreatedTokenData] = useState<(TokenFormType & { token: string }) | null>(null)
  const [successTokenDialog, setSuccessTokenDialog] = useState(false)

  const { query } = useCommonFilter()

  const branchList = branches?.map(item => ({
    name: item?.name
  }))

  const { data: { body: repoSummary } = {} } = useSummaryQuery({
    repo_ref: repoRef,
    queryParams: { include_commit: false, sort: 'date', order: 'asc', limit: 20, page: 1, query }
  })

  const { branch_count, default_branch_commit_count, pull_req_summary, tag_count } = repoSummary || {}

  const { data: { body: readmeContent } = {} } = useGetContentQuery({
    path: 'README.md',
    repo_ref: repoRef,
    queryParams: { include_commit: false, git_ref: normalizeGitRef(selectedBranch) }
  })

  const decodedReadmeContent = useMemo(() => {
    return decodeGitContent(readmeContent?.content?.data)
  }, [readmeContent])

  const { data: { body: repoDetails } = {} } = useGetContentQuery({
    path: '',
    repo_ref: repoRef,
    queryParams: { include_commit: true, git_ref: normalizeGitRef(selectedBranch) }
  })

  const { mutate: createToken } = useCreateTokenMutation(
    { body: {} },
    {
      onSuccess: ({ body: newToken }) => {
        const tokenData = {
          identifier: newToken.token?.identifier ?? 'Unknown',
          lifetime: newToken.token?.expires_at
            ? new Date(newToken.token.expires_at).toLocaleDateString()
            : 'No Expiration',
          token: newToken.access_token ?? 'Token not available'
        }

        setCreatedTokenData(tokenData)
        setSuccessTokenDialog(true)
      }
    }
  )

  const handleCreateToken = () => {
    const body = {
      identifier: `code_token_${generateAlphaNumericHash(5)}`
    }
    createToken({ body })
  }

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
        .then(({ body: response }: { body: RepoPathsDetailsOutput }) => {
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
                    timestamp: item?.last_commit?.author?.when ? timeAgoFromISOTime(item.last_commit.author.when) : '',
                    user: { name: item?.last_commit?.author?.identity?.name },
                    sha: item?.last_commit?.sha && getTrimmedSha(item.last_commit.sha),
                    path: `/spaces/${spaceId}/repos/${repoId}/code/${gitRef || selectedBranch}/~/${item?.path}`
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
  }, [repoEntryPathToFileTypeMap.size, gitRef, repoRef, selectedBranch])

  useEffect(() => {
    if (repository) {
      setSelectedBranch(repository?.default_branch || '')
    }
  }, [repository])

  const selectBranch = (branch: string) => {
    setSelectedBranch(branch)
  }

  const { data: filesData } = useListPathsQuery({
    repo_ref: repoRef,
    queryParams: { git_ref: normalizeGitRef(gitRef || selectedBranch) }
  })

  const filesList = filesData?.body?.files || []

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
            timestamp: author?.when ? timeAgoFromISOTime(author.when) : '',
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

  const navigateToFile = useCallback(
    (filePath: string) => {
      navigate(`/spaces/${spaceId}/repos/${repoId}/code/${gitRef || selectedBranch}/~/${filePath}`)
    },
    [gitRef, selectedBranch, navigate, repoId, spaceId]
  )

  return (
    <>
      <SandboxLayout.Main hasLeftPanel hasHeader hasSubHeader>
        <SandboxLayout.Columns columnWidths="1fr 220px">
          <SandboxLayout.Column>
            <SandboxLayout.Content>
              <ListActions.Root>
                <ListActions.Left>
                  <ButtonGroup.Root>
                    <BranchSelector
                      size="default"
                      name={selectedBranch}
                      branchList={branchList}
                      selectBranch={branch => selectBranch(branch)}
                    />
                    <SearchFiles navigateToFile={navigateToFile} filesList={filesList} />
                  </ButtonGroup.Root>
                </ListActions.Left>
                <ListActions.Right>
                  <ButtonGroup.Root>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          Add file&nbsp;&nbsp;
                          <Icon name="chevron-down" size={11} className="chevron-down" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem
                          key={'create-file'}
                          onClick={() => {
                            navigate(`/spaces/${spaceId}/repos/${repoId}/code/new/${gitRef || selectedBranch}/~/`)
                          }}
                        >
                          + Create New File
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <CloneRepoDialog
                      sshUrl={repository?.git_ssh_url ?? 'could not fetch url'}
                      httpsUrl={repository?.git_url ?? 'could not fetch url'}
                      handleCreateToken={handleCreateToken}
                    />
                  </ButtonGroup.Root>
                </ListActions.Right>
              </ListActions.Root>
              <Spacer size={5} />
              {renderListContent()}
              <Spacer size={5} />
              <StackedList.Root>
                <StackedList.Item isHeader disableHover>
                  <StackedList.Field title={<Text color="tertiaryBackground">README.md</Text>} />
                  <StackedList.Field
                    right
                    title={
                      <ToggleGroup type="single" variant="compact" size="sm">
                        <ToggleGroupItem
                          value="edit"
                          onClick={() =>
                            navigate(
                              `/spaces/${spaceId}/repos/${repoId}/code/edit/${gitRef || selectedBranch}/~/README.md`
                            )
                          }
                          title="Edit"
                          size="sm"
                        >
                          <Icon name="edit-pen" className="size-5 text-foreground" />
                        </ToggleGroupItem>
                      </ToggleGroup>
                    }
                  />
                </StackedList.Item>
                <StackedList.Item disableHover>
                  <MarkdownViewer source={decodedReadmeContent || ''} />
                </StackedList.Item>
              </StackedList.Root>
            </SandboxLayout.Content>
          </SandboxLayout.Column>
          <SandboxLayout.Column>
            <SandboxLayout.Content className="pl-0">
              <RepoSummaryPanel
                title="Summary"
                details={[
                  {
                    id: '0',
                    name: 'Commits',
                    count: default_branch_commit_count || 0,
                    iconName: 'tube-sign'
                  },
                  {
                    id: '1',
                    name: 'Branches',
                    count: branch_count || 0,
                    iconName: 'branch'
                  },
                  {
                    id: '2',
                    name: 'Tags',
                    count: tag_count || 0,
                    iconName: 'tag'
                  },
                  {
                    id: '3',
                    name: 'Open pull requests',
                    count: pull_req_summary?.open_count || 0,
                    iconName: 'open-pr'
                  }
                ]}
                description={repository?.description}
              />
            </SandboxLayout.Content>
          </SandboxLayout.Column>
        </SandboxLayout.Columns>
      </SandboxLayout.Main>
      {createdTokenData && (
        <TokenSuccessDialog
          open={successTokenDialog}
          onClose={() => setSuccessTokenDialog(false)}
          tokenData={createdTokenData}
        />
      )}
    </>
  )
}
