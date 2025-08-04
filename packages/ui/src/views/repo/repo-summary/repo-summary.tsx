import { cloneElement } from 'react'

import {
  Button,
  ButtonLayout,
  IconV2,
  ListActions,
  MarkdownViewer,
  SearchFiles,
  SkeletonList,
  Spacer,
  StackedList,
  Text
} from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import {
  BranchSelectorListItem,
  CommitDivergenceType,
  RepoFile,
  RepoRepositoryOutput,
  SandboxLayout,
  TypesBranchTable
} from '@/views'
import { BranchInfoBar, BranchSelectorTab, Summary } from '@/views/repo/components'
import { isEmpty } from 'lodash-es'

import BranchCompareBannerList from '../components/branch-banner/branch-compare-banner-list'
import { CloneRepoDialog } from './components/clone-repo-dialog'
import SummaryPanel from './components/summary-panel'
import { RepoEmptyView } from './repo-empty-view'

interface RoutingProps {
  toRepoFiles: () => string
  toCommitDetails?: ({ sha }: { sha: string }) => string
  toRepoCommits: () => string
  toRepoBranches: () => string
  toRepoTags: () => string
  toRepoPullRequests: () => string
  navigateToProfileKeys: () => void
}

const README_PATH = 'README.md'
const doesReadmeExistInFiles = (files: RepoFile[]) => {
  return files.some(file => file.id === README_PATH)
}

export interface RepoSummaryViewProps extends Partial<RoutingProps> {
  repoId: string
  spaceId: string
  selectedBranchOrTag: BranchSelectorListItem | null
  loading: boolean
  filesList: string[]
  navigateToFile: (path: string) => void
  repository?: RepoRepositoryOutput
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
    avatarUrl?: string
    message: string
    timestamp: string
    sha: string | null
  }
  saveDescription: (description: string) => void
  updateRepoError?: string
  isEditDialogOpen: boolean
  setEditDialogOpen: (value: boolean) => void
  currentBranchDivergence: CommitDivergenceType
  searchQuery: string
  setSearchQuery: (query: string) => void
  renderSidebarComponent?: React.ReactNode
  isRepoEmpty?: boolean
  branchSelectorRenderer: React.ReactElement
  toRepoFileDetails?: ({ path }: { path: string }) => string
  tokenGenerationError?: string | null
  refType?: BranchSelectorTab
  prCandidateBranches?: TypesBranchTable[]
}

export function RepoSummaryView({
  repoId,
  spaceId,
  selectedBranchOrTag,
  loading,
  filesList,
  navigateToFile,
  prCandidateBranches,
  repository,
  files,
  decodedReadmeContent,
  summaryDetails: { default_branch_commit_count = 0, branch_count = 0, tag_count = 0, pull_req_summary },
  gitRef,
  latestCommitInfo,
  saveDescription,
  updateRepoError,
  isEditDialogOpen,
  setEditDialogOpen,
  currentBranchDivergence,
  handleCreateToken,
  toRepoFiles,
  toCommitDetails,
  navigateToProfileKeys,
  renderSidebarComponent,
  isRepoEmpty,
  branchSelectorRenderer,
  toRepoFileDetails,
  tokenGenerationError,
  refType = BranchSelectorTab.BRANCHES,
  ...props
}: RepoSummaryViewProps) {
  const { Link } = useRouterContext()
  const { t } = useTranslation()

  if (loading) {
    return (
      <SandboxLayout.Main fullWidth>
        <SandboxLayout.Content>
          <SkeletonList />
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    )
  }

  if (isRepoEmpty) {
    return (
      <RepoEmptyView
        sshUrl={repository?.git_ssh_url ?? 'could not fetch url'}
        httpUrl={repository?.git_url ?? 'could not fetch url'}
        repoName={repoId}
        projName={spaceId}
        tokenGenerationError={tokenGenerationError || undefined}
        gitRef={gitRef || selectedBranchOrTag?.name || ''}
        handleCreateToken={handleCreateToken}
        navigateToProfileKeys={navigateToProfileKeys}
      />
    )
  }

  return (
    <SandboxLayout.Main fullWidth>
      <SandboxLayout.Columns columnWidths="1fr 256px">
        <SandboxLayout.Column className="w-full min-w-0">
          <SandboxLayout.Content className="pr-cn-xl">
            {!isEmpty(prCandidateBranches) && (
              <>
                <BranchCompareBannerList
                  prCandidateBranches={prCandidateBranches}
                  defaultBranchName={repository?.default_branch || 'main'}
                  repoId={repoId}
                  spaceId={spaceId}
                />
                <Spacer size={4} />
              </>
            )}
            {selectedBranchOrTag?.name !== repository?.default_branch && (
              <>
                <BranchInfoBar
                  defaultBranchName={repository?.default_branch}
                  repoId={repoId}
                  spaceId={spaceId}
                  selectedBranchTag={selectedBranchOrTag ?? { name: '', sha: '' }}
                  currentBranchDivergence={{
                    ahead: currentBranchDivergence?.ahead || 0,
                    behind: currentBranchDivergence?.behind || 0
                  }}
                  refType={refType}
                />
                <Spacer size={4} />
              </>
            )}

            <ListActions.Root className="flex-wrap gap-y-2">
              <ListActions.Left>
                <ButtonLayout className="w-full " horizontalAlign="start">
                  {cloneElement(branchSelectorRenderer, { className: 'w-full max-w-fit' })}
                  <SearchFiles
                    navigateToFile={navigateToFile}
                    filesList={filesList}
                    searchInputSize="md"
                    inputContainerClassName="max-w-80 min-w-40 w-full"
                  />
                </ButtonLayout>
              </ListActions.Left>
              <ListActions.Right>
                <ButtonLayout>
                  {refType === BranchSelectorTab.BRANCHES ? (
                    <Button variant="outline" asChild>
                      <Link
                        className="relative grid grid-cols-[auto_1fr] items-center gap-1.5"
                        to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/files/new/${gitRef || selectedBranchOrTag?.name || ''}/~/`}
                      >
                        <span className="truncate">{t('views:repos.create-file', 'Create file')}</span>
                      </Link>
                    </Button>
                  ) : null}
                  <CloneRepoDialog
                    sshUrl={repository?.git_ssh_url}
                    httpsUrl={repository?.git_url ?? 'could not fetch url'}
                    handleCreateToken={handleCreateToken}
                    tokenGenerationError={tokenGenerationError}
                  />
                </ButtonLayout>
              </ListActions.Right>
            </ListActions.Root>
            <Spacer size={4.5} />
            <Summary
              toCommitDetails={toCommitDetails}
              latestFile={{
                user: { name: latestCommitInfo?.userName || '', avatarUrl: latestCommitInfo?.avatarUrl },
                lastCommitMessage: latestCommitInfo?.message || '',
                timestamp: latestCommitInfo?.timestamp || '',
                sha: latestCommitInfo?.sha || ''
              }}
              files={files}
              toRepoFileDetails={toRepoFileDetails}
              hideHeader
            />
            <Spacer size={5} />
            <StackedList.Root onlyTopRounded borderBackground>
              <StackedList.Item className="py-2" isHeader disableHover>
                <StackedList.Field
                  title={
                    <Text variant="caption-single-line-normal" color="foreground-1">
                      {t('views:repos.readme', 'README.md')}
                    </Text>
                  }
                />
                <StackedList.Field
                  right
                  title={
                    <Button variant="outline" iconOnly asChild>
                      <Link
                        to={`${toRepoFiles?.()}/${doesReadmeExistInFiles(files) ? 'edit' : 'new'}/${gitRef || selectedBranchOrTag?.name}/~/${README_PATH}`}
                        aria-label={t('views:repos.editReadme', 'Edit README.md')}
                      >
                        <IconV2 name="edit-pencil" className="text-icons-3" />
                      </Link>
                    </Button>
                  }
                />
              </StackedList.Item>
            </StackedList.Root>
            <MarkdownViewer source={decodedReadmeContent || ''} withBorder />
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
                  iconName: 'git-commit',
                  to: props.toRepoCommits?.() ?? '#'
                },
                {
                  id: '1',
                  name: t('views:repos.branches', 'Branches'),
                  count: branch_count,
                  iconName: 'git-branch',
                  to: props.toRepoBranches?.() ?? '#'
                },
                {
                  id: '2',
                  name: t('views:repos.tags', 'Tags'),
                  count: tag_count,
                  iconName: 'tag',
                  to: props.toRepoTags?.() ?? '#'
                },
                {
                  id: '3',
                  name: t('views:repos.openPullReq', 'Open pull requests'),
                  count: pull_req_summary?.open_count || 0,
                  iconName: 'git-pull-request',
                  to: props.toRepoPullRequests?.() ?? '#'
                }
              ]}
              timestamp={repository?.created ? new Date(repository.created).toISOString() : ''}
              description={repository?.description}
              saveDescription={saveDescription}
              updateRepoError={updateRepoError}
              isEditDialogOpen={isEditDialogOpen}
              setEditDialogOpen={setEditDialogOpen}
            />
            {renderSidebarComponent}
          </SandboxLayout.Content>
        </SandboxLayout.Column>
      </SandboxLayout.Columns>
    </SandboxLayout.Main>
  )
}
