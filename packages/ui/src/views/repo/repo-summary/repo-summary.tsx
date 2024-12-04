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
import { BranchSelectorListItem, RepoFile, SandboxLayout, TranslationStore } from '@/views'
import { BranchSelector, Summary } from '@/views/repo/components'

import SummaryPanel from './components/summary-panel'

export interface RepoSummaryViewProps {
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
  onChangeDescription?: () => void
  isEditingDescription?: boolean
  setIsEditingDescription: (value: boolean) => void
  saveDescription: (description: string) => void
  useTranslationStore: () => TranslationStore
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
  latestCommitInfo,
  onChangeDescription,
  isEditingDescription,
  setIsEditingDescription,
  saveDescription,
  useTranslationStore
}: RepoSummaryViewProps) {
  const navigate = useNavigate()
  const { t } = useTranslationStore()

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
          useTranslationStore={useTranslationStore}
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
                <ButtonGroup>
                  <BranchSelector
                    selectedBranch={selectedBranch}
                    branchList={branchList}
                    tagList={tagList}
                    onSelectBranch={selectBranch}
                    repoId={repoId}
                    spaceId={spaceId}
                    useTranslationStore={useTranslationStore}
                  />
                  <SearchFiles
                    navigateToFile={navigateToFile}
                    filesList={filesList}
                    useTranslationStore={useTranslationStore}
                  />
                </ButtonGroup>
              </ListActions.Left>
              <ListActions.Right>
                <ButtonGroup>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="gap-x-2" variant="outline">
                        {t('views:repos.add-file', 'Add file')}
                        <Icon name="chevron-down" size={11} className="chevron-down" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        key={'create-file'}
                        onClick={() => {
                          navigate(`/${spaceId}/repos/${repoId}/code/new/${gitRef || selectedBranch.name}/~/`)
                        }}
                      >
                        {t('views:repos.createNewFile', '+ Create New File')}
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
                </ButtonGroup>
              </ListActions.Right>
            </ListActions.Root>
            <Spacer size={5} />
            {renderListContent()}
            <Spacer size={5} />
            <StackedList.Root>
              <StackedList.Item isHeader disableHover>
                <StackedList.Field
                  title={<Text color="tertiaryBackground">{t('views:repos.readme', 'README.md')}</Text>}
                />
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
              title={t('views:repos.summary', 'Summary')}
              details={[
                {
                  id: '0',
                  name: t('views:repos.commits', 'Commits'),
                  count: default_branch_commit_count,
                  iconName: 'tube-sign'
                },
                {
                  id: '1',
                  name: t('views:repos.branches', 'Branches'),
                  count: branch_count,
                  iconName: 'branch'
                },
                {
                  id: '2',
                  name: t('views:repos.tags', 'Tags'),
                  count: tag_count,
                  iconName: 'tag'
                },
                {
                  id: '3',
                  name: t('views:repos.openPullReq', 'Open pull requests'),
                  count: pull_req_summary?.open_count || 0,
                  iconName: 'open-pr'
                }
              ]}
              description={repository?.description}
              onChangeDescription={onChangeDescription}
              isEditingDescription={isEditingDescription}
              setIsEditingDescription={setIsEditingDescription}
              saveDescription={saveDescription}
            />
          </SandboxLayout.Content>
        </SandboxLayout.Column>
      </SandboxLayout.Columns>
    </SandboxLayout.Main>
  )
}
