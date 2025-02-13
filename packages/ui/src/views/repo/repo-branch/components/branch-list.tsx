import { FC } from 'react'
import { Link } from 'react-router-dom'

import {
  Avatar,
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
  TableRow
} from '@/components'
import { cn } from '@utils/cn'
import { getInitials } from '@utils/stringUtils'
import { getChecksState, getPrState } from '@views/repo/pull-request/utils'

import { BranchListPageProps } from '../types'
import { DivergenceGauge } from './divergence-gauge'

export const BranchesList: FC<BranchListPageProps> = ({
  isLoading,
  branches,
  defaultBranch,
  useTranslationStore,
  isDirtyList,
  setCreateBranchDialogOpen,
  handleResetFiltersAndPages,
  toBranchRules,
  toPullRequestCompare,
  toPullRequest,
  onDeleteBranch
}) => {
  const { t } = useTranslationStore()

  if (!branches?.length && !isLoading) {
    return (
      <NoData
        iconName={isDirtyList ? 'no-search-magnifying-glass' : 'no-data-branches'}
        withBorder={isDirtyList}
        title={
          isDirtyList
            ? t('views:noData.noResults', 'No search results')
            : t('views:noData.noBranches', 'No branches yet')
        }
        description={
          isDirtyList
            ? [
                t(
                  'views:noData.noResultsDescription',
                  'No branches match your search. Try adjusting your keywords or filters.',
                  {
                    type: 'branches'
                  }
                )
              ]
            : [
                t('views:noData.createBranchDescription', "Your branches will appear here once they're created."),
                t('views:noData.startBranchDescription', 'Start branching to see your work organized.')
              ]
        }
        primaryButton={
          isDirtyList
            ? {
                label: t('views:noData.clearSearch', 'Clear search'),
                onClick: handleResetFiltersAndPages
              }
            : {
                label: t('views:noData.createBranch', 'Create new branch'),
                onClick: () => {
                  setCreateBranchDialogOpen(true)
                }
              }
        }
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
              <span className="text-right leading-none">{t('views:repos.behind', 'Behind')}</span>
              <div className="h-3 w-px bg-borders-2" aria-hidden />
              <span className="leading-none">{t('views:repos.ahead', 'Ahead')}</span>
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
          {branches.map(branch => {
            const checkState = branch?.checks?.status ? getChecksState(branch?.checks?.status) : null

            return (
              <TableRow key={branch.id}>
                {/* branch name */}
                <TableCell className="content-center">
                  <div className="flex h-6 items-center">
                    <div className="inline-flex h-6 max-w-80 items-center truncate rounded bg-background-8 px-2.5 text-14 text-foreground-8">
                      {defaultBranch === branch?.name && (
                        <Icon name="lock" size={14} className="-mt-px mr-1 inline-block text-icons-9" />
                      )}
                      {branch?.name}
                    </div>
                    <CopyButton color="gray" name={branch?.name} />
                  </div>
                </TableCell>
                {/* user avatar and timestamp */}
                <TableCell className="content-center">
                  <div className="flex items-center gap-2">
                    <Avatar.Root size="4.5">
                      {!!branch?.user?.avatarUrl && <Avatar.Image src={branch?.user?.avatarUrl} />}
                      <Avatar.Fallback className="text-center text-10">
                        {getInitials(branch?.user?.name ?? '')}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <span className="truncate text-foreground-1">{branch?.timestamp}</span>
                  </div>
                </TableCell>
                {/* checkstatus: show in the playground, hide the check status column if the checks are null in the gitness without data */}
                <TableCell className="content-center">
                  {branch?.checks && (
                    <div className="flex items-center">
                      {checkState === 'running' ? (
                        <span className="mr-1.5 size-2 rounded-full bg-icons-alert" />
                      ) : (
                        <Icon
                          className={cn('mr-1.5', {
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
                      <span className="truncate text-foreground-3">{branch?.checks?.done}</span>
                      <span className="mx-px">/</span>
                      <span className="truncate text-foreground-3">{branch?.checks?.total}</span>
                    </div>
                  )}
                </TableCell>
                {/* calculated divergence bar & default branch */}
                <TableCell className="content-center">
                  <div className="flex items-center justify-center gap-1.5 align-middle">
                    {branch?.behindAhead?.default ? (
                      <Badge
                        className="m-auto rounded-full bg-background-2 px-2 text-center font-medium text-foreground-3"
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

                {/* PR link */}
                <TableCell className="max-w-20 content-center">
                  {branch.pullRequests && branch.pullRequests.length > 0 && branch.pullRequests[0].number && (
                    <Button
                      className="flex w-fit items-center gap-1 bg-background-8 px-2.5 text-sm text-foreground-8 hover:bg-background-9 hover:text-foreground-1"
                      variant="custom"
                      size="xs"
                      asChild
                    >
                      <Link to={toPullRequest?.({ pullRequestId: branch.pullRequests[0].number }) || ''}>
                        <Icon
                          name={
                            getPrState(
                              branch.pullRequests[0].is_draft,
                              branch.pullRequests[0].merged,
                              branch.pullRequests[0].state
                            ).icon
                          }
                          size={14}
                          className={cn({
                            'text-icons-success':
                              branch.pullRequests[0].state === 'open' && !branch.pullRequests[0].is_draft,
                            'text-icons-1': branch.pullRequests[0].state === 'open' && branch.pullRequests[0].is_draft,
                            'text-icons-danger': branch.pullRequests[0].state === 'closed',
                            'text-icons-merged': branch.pullRequests[0].merged
                          })}
                        />
                        #{branch.pullRequests[0].number}
                      </Link>
                    </Button>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <MoreActionsTooltip
                    isInTable
                    actions={[
                      {
                        title: t('views:repos.newPullReq', 'New pull request'),
                        to: toPullRequestCompare?.({ diffRefs: `${defaultBranch}...${branch.name}` }) || ''
                      },
                      {
                        title: t('views:repos.viewRules', 'View Rules'),
                        to: toBranchRules?.()
                      },
                      {
                        isDanger: true,
                        title: t('views:repos.deleteBranch', 'Delete Branch'),
                        onClick: () => onDeleteBranch(branch.name)
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
