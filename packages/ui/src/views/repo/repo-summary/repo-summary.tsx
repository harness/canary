/* eslint-disable @typescript-eslint/no-unused-vars */

import { Link, useNavigate } from 'react-router-dom'

import {
  Button,
  ButtonGroup,
  Icon,
  ListActions,
  MarkdownViewer,
  NoData,
  SearchFiles,
  SkeletonList,
  Spacer,
  StackedList,
  Text
} from '@/components'
import {
  BranchSelectorListItem,
  CommitDivergenceType,
  IBranchSelectorStore,
  RepoFile,
  SandboxLayout,
  TranslationStore
} from '@/views'
import { BranchInfoBar, BranchSelector, BranchSelectorTab, Summary } from '@/views/repo/components'
import { formatDate } from '@utils/utils'

// import { RecentPushInfoBar } from './components/recent-push-info-bar'
import SummaryPanel from './components/summary-panel'

export interface RepoSummaryViewProps {
  loading: boolean
  filesList: string[]
  navigateToFile: (path: string) => void
  repository:
    | {
        git_ssh_url?: string
        git_url?: string
        description?: string
        created?: number
        default_branch?: string
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
  gitRef?: string
  latestCommitInfo?: {
    userName: string
    message: string
    timestamp: string
    sha: string | null
  }
  saveDescription: (description: string) => void
  selectBranchOrTag: (branchTag: BranchSelectorListItem, type: BranchSelectorTab) => void
  useRepoBranchesStore: () => IBranchSelectorStore
  updateRepoError?: string
  useTranslationStore: () => TranslationStore
  isEditDialogOpen: boolean
  setEditDialogOpen: (value: boolean) => void
  currentBranchDivergence: CommitDivergenceType
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function RepoSummaryView({
  loading,
  filesList,
  navigateToFile,
  repository,
  repoEntryPathToFileTypeMap,
  files,
  decodedReadmeContent,
  summaryDetails: { default_branch_commit_count = 0, branch_count = 0, tag_count = 0, pull_req_summary },
  gitRef,
  latestCommitInfo,
  saveDescription,
  selectBranchOrTag,
  useRepoBranchesStore,
  updateRepoError,
  isEditDialogOpen,
  setEditDialogOpen,
  useTranslationStore,
  currentBranchDivergence,
  searchQuery,
  setSearchQuery
}: RepoSummaryViewProps) {
  const navigate = useNavigate()
  const { t } = useTranslationStore()
  const { repoId, spaceId, selectedBranchTag } = useRepoBranchesStore()

  if (loading) {
    return (
      <SandboxLayout.Main fullWidth>
        <SandboxLayout.Content>
          <SkeletonList />
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    )
  }

  if (!repoEntryPathToFileTypeMap.size) {
    return (
      <NoData
        iconName="no-data-folder"
        title="No files yet"
        description={['There are no files in this repository yet.', 'Create new or import an existing file.']}
        primaryButton={{ label: 'Create file' }}
        secondaryButton={{ label: 'Import file' }}
      />
    )
  }

  return (
    <SandboxLayout.Main fullWidth>
      <SandboxLayout.Columns columnWidths="1fr 255px">
        <SandboxLayout.Column>
          <SandboxLayout.Content className="pl-6">
            {/*
              TODO: Implement proper recent push detection logic:
              1. Backend needs to:
                - Track and store information about recent pushes
                - Provide an API endpoint that returns array of recent pushes:
                  {
                    recentPushes: Array<{
                      branchName: string
                      pushedAt: string // ISO timestamp
                      userId: string // to show banner only to user who made the push
                    }>
                  }
                - Consider:
                  * Clearing push data after PR is created
                  * Clearing push data after 24h
                  * Limiting number of shown pushes (e.g. max 3 most recent)
                  * Sorting pushes by timestamp (newest first)

              2. Frontend needs to:
                - Fetch recent pushes data from the API
                - Filter pushes to show only where:
                  * Current user is the one who made the push
                  * Push was made less than 24h ago
                  * No PR has been created from this branch yet
                - Format timestamps using timeAgoFromISOTime
                - Remove mock data below

                Example:
                {selectedBranchTag.name !== repository?.default_branch && (
                  <>
                    <RecentPushInfoBar
                      recentPushes={[
                        {
                          branchName: 'new-branch',
                          timeAgo: timeAgoFromISOTime(new Date(Date.now() - 1000 * 60 * 5).toISOString())
                        }
                      ]}
                      spaceId={spaceId}
                      repoId={repoId}
                    />
                    <Spacer size={6} />
                  </>
                )}
            */}
            <ListActions.Root>
              <ListActions.Left>
                <ButtonGroup>
                  <BranchSelector
                    onSelectBranch={selectBranchOrTag}
                    useRepoBranchesStore={useRepoBranchesStore}
                    useTranslationStore={useTranslationStore}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
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
                  <Button variant="outline" asChild>
                    <Link to={`/${spaceId}/repos/${repoId}/code/new/${gitRef || selectedBranchTag?.name || ''}/~/`}>
                      {t('views:repos.addFile', 'Add File')}
                    </Link>
                  </Button>
                  <Button>
                    <Icon name="clone" />
                    &nbsp; {t('views:repos.clone', 'Clone')}
                  </Button>
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
            {selectedBranchTag.name !== repository?.default_branch && (
              <>
                <Spacer size={4} />
                <BranchInfoBar
                  defaultBranchName={repository?.default_branch}
                  useRepoBranchesStore={useRepoBranchesStore}
                  currentBranchDivergence={{
                    ahead: currentBranchDivergence?.ahead || 0,
                    behind: currentBranchDivergence?.behind || 0
                  }}
                />
              </>
            )}
            <Spacer size={5} />
            <Summary
              latestFile={{
                user: { name: latestCommitInfo?.userName || '' },
                lastCommitMessage: latestCommitInfo?.message || '',
                timestamp: latestCommitInfo?.timestamp || '',
                sha: latestCommitInfo?.sha || ''
              }}
              files={files}
              useTranslationStore={useTranslationStore}
              hideHeader
            />
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
                <MarkdownViewer source={decodedReadmeContent || ''} />
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
              timestamp={formatDate(repository?.created || '')}
              description={repository?.description}
              saveDescription={saveDescription}
              updateRepoError={updateRepoError}
              isEditDialogOpen={isEditDialogOpen}
              setEditDialogOpen={setEditDialogOpen}
            />
          </SandboxLayout.Content>
        </SandboxLayout.Column>
      </SandboxLayout.Columns>
    </SandboxLayout.Main>
  )
}
