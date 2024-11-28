/* eslint-disable @typescript-eslint/no-unused-vars */

import { useNavigate } from 'react-router-dom'

import {
  Button,
  ButtonGroup,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  ListActions,
  NoData,
  SearchFiles,
  SkeletonList,
  Spacer,
  StackedList,
  Text
} from '@/components'
import { BranchSelectorListItem } from '@views/repo'
import { BranchSelector } from '@views/repo/components'

import { SandboxLayout } from '../../index'
import { RepoFile } from '../repo.types'
import Summary from './components/summary'
import SummaryPanel from './components/summary-panel'

interface RepoSummaryViewProps {
  loading: boolean
  selectedBranch: BranchSelectorListItem
  branchList: BranchSelectorListItem[]
  tagList: BranchSelectorListItem[]
  selectBranch: (branch: BranchSelectorListItem) => void
  filesList: string[]
  navigateToFile: (path: string) => void
  repository:
    | {
        git_ssh_url?: string
        git_url?: string
        description?: string
      }
    | undefined
  handleCreateToken: () => void
  // TODO: fix this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  repoEntryPathToFileTypeMap: Map<string, any>
  files: RepoFile[]
  decodedReadmeContent: string
  summaryDetails: {
    default_branch_commit_count?: number
    branch_count?: number
    tag_count?: number
    pull_req_summary?: { open_count: number } | undefined
  }
  spaceId: string
  repoId: string
  gitRef?: string
  latestCommitInfo?: {
    userName: string
    message: string
    timestamp: string
    sha: string | null
  }
}

export function RepoSummaryView({
  loading,
  selectedBranch,
  branchList,
  tagList,
  selectBranch,
  filesList,
  navigateToFile,
  repository,
  handleCreateToken,
  repoEntryPathToFileTypeMap,
  files,
  decodedReadmeContent,
  summaryDetails: { default_branch_commit_count = 0, branch_count = 0, tag_count = 0, pull_req_summary },
  spaceId,
  repoId,
  gitRef,
  latestCommitInfo
}: RepoSummaryViewProps) {
  const navigate = useNavigate()

  const renderListContent = () => {
    if (loading) return <SkeletonList />

    if (repoEntryPathToFileTypeMap.size) {
      return (
        <Summary
          latestFile={{
            user: { name: latestCommitInfo?.userName || '' },
            lastCommitMessage: latestCommitInfo?.message || '',
            timestamp: latestCommitInfo?.timestamp || '',
            sha: latestCommitInfo?.sha || ''
          }}
          files={files}
        />
      )
    }

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

  return (
    <SandboxLayout.Main hasLeftPanel hasHeader hasSubHeader>
      <SandboxLayout.Columns columnWidths="1fr 220px">
        <SandboxLayout.Column>
          <SandboxLayout.Content>
            <ListActions.Root>
              <ListActions.Left>
                <ButtonGroup.Root>
                  <BranchSelector
                    selectedBranch={selectedBranch}
                    branchList={branchList}
                    tagList={tagList}
                    onSelectBranch={selectBranch}
                    repoId={repoId}
                    spaceId={spaceId}
                  />
                  <SearchFiles navigateToFile={navigateToFile} filesList={filesList} />
                </ButtonGroup.Root>
              </ListActions.Left>
              <ListActions.Right>
                <ButtonGroup.Root>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="gap-x-2" variant="outline">
                        Add file
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
                  {/*  
                    TODO: require moving and preparing a component from views
                    <CloneRepoDialog
                      sshUrl={repository?.git_ssh_url ?? 'could not fetch url'}
                      httpsUrl={repository?.git_url ?? 'could not fetch url'}
                      handleCreateToken={handleCreateToken}
                    />
                   */}
                </ButtonGroup.Root>
              </ListActions.Right>
            </ListActions.Root>
            <Spacer size={5} />
            {renderListContent()}
            <Spacer size={5} />
            <StackedList.Root>
              <StackedList.Item isHeader disableHover>
                <StackedList.Field title={<Text color="tertiaryBackground">README.md</Text>} />
                {/* TODO: add component and file editing logic */}
                <StackedList.Field right />
              </StackedList.Item>
              <StackedList.Item disableHover>
                {/*
                  TODO: require moving and preparing a component from views
                  <MarkdownViewer source={decodedReadmeContent || ''} />
                */}
              </StackedList.Item>
            </StackedList.Root>
          </SandboxLayout.Content>
        </SandboxLayout.Column>
        <SandboxLayout.Column>
          <SandboxLayout.Content className="pl-0">
            <SummaryPanel
              title="Summary"
              details={[
                {
                  id: '0',
                  name: 'Commits',
                  count: default_branch_commit_count,
                  iconName: 'tube-sign'
                },
                {
                  id: '1',
                  name: 'Branches',
                  count: branch_count,
                  iconName: 'branch'
                },
                {
                  id: '2',
                  name: 'Tags',
                  count: tag_count,
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
  )
}
