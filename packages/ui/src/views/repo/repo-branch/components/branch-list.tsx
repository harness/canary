import { Link } from 'react-router-dom'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  CopyButton,
  Icon,
  IconProps,
  MoreActionsTooltip,
  NoData,
  SkeletonTable,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text
} from '@/components'
import { cn } from '@utils/cn'
import { getInitials } from '@utils/stringUtils'
import { getChecksState, getPrState } from '@views/repo/pull-request/utils'

import { BranchListPageProps } from '../types'
import { DivergenceGauge } from './divergence-gauge'

export const BranchesList = ({
  isLoading,
  branches,
  defaultBranch,
  useTranslationStore,
  searchQuery,
  setCreateBranchDialogOpen,
  handleResetFiltersAndPages,
  toBranchRules,
  toPullRequestCompare,
  toCommitDetails,
  onDeleteBranch
}: BranchListPageProps) => {
  const { t } = useTranslationStore()

  if (!branches?.length && !isLoading) {
    if (searchQuery) {
      return (
        <NoData
          className="border-borders-4 rounded-md border pb-[157px] pt-[100px]"
          iconName="no-search-magnifying-glass"
          title={t('views:noData.noResults', 'No search results')}
          description={[
            t('views:noData.checkSpelling', 'Check your spelling and filter options,'),
            t('views:noData.changeSearch', 'or search for a different keyword.')
          ]}
          primaryButton={{
            label: t('views:noData.clearSearch', 'Clear search'),
            onClick: handleResetFiltersAndPages
          }}
        />
      )
    }

    return (
      <NoData
        iconName="no-data-branches"
        title={t('views:noData.noBranches', 'No branches yet')}
        description={[
          t('views:noData.createBranchDescription', "Your branches will appear here once they're created."),
          t('views:noData.startBranchDescription', 'Start branching to see your work organized.')
        ]}
        primaryButton={{
          label: t('views:noData.createBranch', 'Create new branch'),
          onClick: () => {
            setCreateBranchDialogOpen(true)
          }
        }}
      />
    )
  }

  return (
    <Table
      className={isLoading ? '[mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]' : ''}
      variant="asStackedList"
    >
      <TableHeader>
        <TableRow>
          <TableHead className="w-96">{t('views:repos.branch', 'Branch')}</TableHead>
          <TableHead className="w-44">{t('views:repos.update', 'Updated')}</TableHead>
          <TableHead>{t('views:repos.checkStatus', 'Check status')}</TableHead>
          <TableHead className="w-40">
            <div className="mx-auto grid w-28 grid-flow-col grid-cols-[1fr_auto_1fr] items-center justify-center gap-x-1.5">
              <Text className="leading-none" size={2} truncate color="foreground-4" weight="medium">
                {t('views:repos.behind', 'Behind')}
              </Text>
              <div className="bg-borders-2 h-3 w-px" aria-hidden />
              <Text className="place-self-start leading-none" size={2} truncate color="foreground-4" weight="medium">
                {t('views:repos.ahead', 'Ahead')}
              </Text>
            </div>
          </TableHead>
          <TableHead className="w-40 whitespace-nowrap">{t('views:repos.pullRequest', 'Pull Request')}</TableHead>
          <TableHead className="w-16">
            <></>
          </TableHead>
        </TableRow>
      </TableHeader>
      {isLoading ? (
        <SkeletonTable countRows={12} countColumns={5} />
      ) : (
        <TableBody>
          {branches &&
            branches.map(branch => {
              const checkState = branch?.checks?.status ? getChecksState(branch?.checks?.status) : null

              return (
                <TableRow key={branch.id}>
                  {/* branch name */}
                  <TableCell className="content-center">
                    <div className="flex h-6 items-center">
                      <Text wrap="nowrap" truncate>
                        <Button
                          className="text-foreground-8 bg-background-8 hover:bg-background-9 hover:text-foreground-1 inline-block max-w-80 truncate px-2.5 text-sm"
                          variant="custom"
                          size="xs"
                        >
                          {defaultBranch === branch?.name && (
                            <Icon name="lock" size={14} className="text-icons-9 -mt-px mr-1 inline-block" />
                          )}
                          {branch?.name}
                        </Button>
                      </Text>
                      <CopyButton color="icons-1" name={branch?.name} />
                    </div>
                  </TableCell>
                  {/* user avatar and timestamp */}
                  <TableCell className="content-center">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-[1.125rem]">
                        {branch?.user?.avatarUrl && <AvatarImage src={branch?.user?.avatarUrl} />}
                        <AvatarFallback className="text-center text-[0.625rem]">
                          {getInitials(branch?.user?.name ?? '', 2)}
                        </AvatarFallback>
                      </Avatar>
                      <Text color="primary" wrap="nowrap" truncate size={2}>
                        {branch?.timestamp}
                      </Text>
                    </div>
                  </TableCell>
                  {/* TODO: update pending icon */}
                  {/* checkstatus: show in the playground, hide the check status column if the checks are null in the gitness without data */}
                  <TableCell className="content-center">
                    {branch?.checks && (
                      <div className="flex items-center gap-1.5">
                        {checkState === 'running' ? (
                          <span className="bg-icons-alert size-2 rounded-full" />
                        ) : (
                          <Icon
                            className={cn('text-icons-1', {
                              'text-icons-success': checkState === 'success',
                              'text-icons-danger': checkState === 'failure'
                            })}
                            name={
                              cn({
                                tick: checkState === 'success',
                                cross: checkState === 'failure'
                              }) as IconProps['name']
                            }
                            size={12}
                          />
                        )}
                        <Text size={2} wrap="nowrap" truncate color="tertiaryBackground">
                          {branch?.checks?.done}
                          <span className="mx-px">/</span>
                          {branch?.checks?.total}
                        </Text>
                      </div>
                    )}
                  </TableCell>
                  {/* calculated divergence bar & default branch */}
                  <TableCell className="content-center">
                    <div className="flex items-center justify-center gap-1.5 align-middle">
                      {branch?.behindAhead?.default ? (
                        <Badge
                          className="text-foreground-3 bg-background-2 m-auto rounded-full px-2 text-center font-medium"
                          variant="outline"
                          size="sm"
                        >
                          {t('views:repos.default', 'Default')}
                        </Badge>
                      ) : (
                        <DivergenceGauge
                          behindAhead={branch?.behindAhead || {}}
                          useTranslationStore={useTranslationStore}
                        />
                      )}
                    </div>
                  </TableCell>

                  {/* change commit data instead: SHA */}
                  <TableCell className="max-w-20 content-center">
                    {branch.pullRequests && branch.pullRequests.length > 0 && (
                      <Button
                        className="text-foreground-8 bg-background-8 hover:bg-background-9 hover:text-foreground-1 flex w-fit items-center gap-1 px-2.5 text-sm"
                        variant="custom"
                        size="xs"
                        asChild
                      >
                        <Link to={`/${spaceId}/repos/${repoId}/pulls/${branch.pullRequests[0].number}`}>
                          <Icon
                            name={
                              getPrState(
                                branch.pullRequests[0].is_draft,
                                branch.pullRequests[0].merged,
                                branch.pullRequests[0].state
                              ).icon
                            }
                            size={11}
                            className={cn({
                              'text-icons-success':
                                branch.pullRequests[0].state === 'open' && !branch.pullRequests[0].is_draft,
                              'text-icons-1':
                                branch.pullRequests[0].state === 'open' && branch.pullRequests[0].is_draft,
                              'text-icons-danger': branch.pullRequests[0].state === 'closed',
                              'text-icons-merged': branch.pullRequests[0].merged
                            })}
                          />
                          #{branch.pullRequests[0].number}
                        </Link>
                      </Button>
                    )}
                  </TableCell>
                  {/* <TableCell className="content-center">
                    <div className="flex justify-end">
                      <MoreActionsTooltip
                        branchInfo={branch}
                        spaceId={spaceId}
                        repoId={repoId}
                        defaultBranch={defaultBranch}
                        useTranslationStore={useTranslationStore}
                      />
                    </div>
                  </TableCell> */}
                  <TableCell className="text-right">
                    <MoreActionsTooltip
                      actions={[
                        {
                          title: t('views:repos.newPullReq', 'New pull request'),
                          to: `${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/${defaultBranch}...${branch.name}`
                        },
                        {
                          title: t('views:repos.viewRules', 'View Rules'),
                          to: `${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/settings/rules`
                        },
                        {
                          title: t('views:repos.renameBranch', 'Rename Branch'),
                          // TODO: add rename fnc or path
                          onClick: () => {}
                        },
                        {
                          isDanger: true,
                          title: t('views:repos.deleteBranch', 'Delete Branch'),
                          // TODO: add remove fnc
                          onClick: () => {}
                        }
                      ]}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      )}
    </Table>
  )
}
