/* eslint-disable @typescript-eslint/no-unused-vars */

import { Link } from 'react-router-dom'

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

import { CloneRepoDialog } from './components/clone-repo-dialog'
import SummaryPanel from './components/summary-panel'
import { RepoEmptyView } from './repo-empty-view'

interface RoutingProps {
  toRepoFiles: () => string
  toCommitDetails?: ({ sha }: { sha: string }) => string
}

export interface RepoSummaryViewProps extends Partial<RoutingProps> {
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
        is_public?: boolean
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
  setSearchQuery,
  handleCreateToken,
  toRepoFiles,
  toCommitDetails
}: RepoSummaryViewProps) {
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
      <RepoEmptyView
        sshUrl={repository?.git_ssh_url ?? 'could not fetch url'}
        httpUrl={repository?.git_url ?? 'could not fetch url'}
        repoName={repoId}
        projName={spaceId}
      />
    )
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Columns columnWidths="1fr 256px">
        <SandboxLayout.Column className="max-w-[1000px]">
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
                  <Button variant="outline">
                    <Link
                      className="relative grid grid-cols-[auto_1fr] items-center gap-2.5"
                      to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/code/new/${gitRef || selectedBranchTag?.name || ''}/~/`}
                    >
                      <Icon name="plus" size={12} />
                      <span className="truncate">{t('views:repos.create-new-file-no-plus', 'Create new file')}</span>
                    </Link>
                  </Button>
                  <CloneRepoDialog
                    sshUrl={repository?.git_ssh_url ?? 'could not fetch url'}
                    httpsUrl={repository?.git_url ?? 'could not fetch url'}
                    handleCreateToken={handleCreateToken}
                    useTranslationStore={useTranslationStore}
                  />
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
              toCommitDetails={toCommitDetails}
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
            <StackedList.Root onlyTopRounded borderBackground>
              <StackedList.Item className="py-2" isHeader disableHover>
                <StackedList.Field
                  title={<Text color="tertiaryBackground">{t('views:repos.readme', 'README.md')}</Text>}
                />
                <StackedList.Field
                  right
                  title={
                    <Button
                      className="flex border border-borders-1 hover:bg-background-3"
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <Link to={`${toRepoFiles?.()}/edit/${gitRef || selectedBranchTag?.name}/~/README.md`}>
                        <Icon name="edit-pen" size={16} className="text-icons-3" />
                        <span className="sr-only">{t('views:repos.editReadme', 'Edit README.md')}</span>
                      </Link>
                    </Button>
                  }
                />
              </StackedList.Item>
            </StackedList.Root>
            <MarkdownViewer source={decodedReadmeContent || ''} withBorderWrapper />
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
              is_public={repository?.is_public}
              useTranslationStore={useTranslationStore}
            />
          </SandboxLayout.Content>
        </SandboxLayout.Column>
      </SandboxLayout.Columns>
    </SandboxLayout.Main>
  )
}
