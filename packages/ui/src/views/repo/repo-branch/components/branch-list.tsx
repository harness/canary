import { FC } from 'react'

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
  Table
} from '@/components'
import { useRouterContext } from '@/context'
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
  toCode,
  onDeleteBranch
}) => {
  const { t } = useTranslationStore()
  const { Link, navigate } = useRouterContext()

  if (!branches?.length && !isLoading) {
    return (
      <NoData
        className="m-auto"
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
    <Table.Root
      className={isLoading ? '[mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]' : ''}
      variant="asStackedList"
    >
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-96">{t('views:repos.branch', 'Branch')}</Table.Head>
          <Table.Head className="w-44">{t('views:repos.update', 'Updated')}</Table.Head>
          <Table.Head>{t('views:repos.checkStatus', 'Check status')}</Table.Head>
          <Table.Head className="w-40">
            <div className="mx-auto grid w-28 grid-flow-col grid-cols-[1fr_auto_1fr] items-center justify-center gap-x-1.5">
              <span className="text-right leading-none">{t('views:repos.behind', 'Behind')}</span>
              <div className="bg-cn-background-3 h-3 w-px" aria-hidden />
              <span className="leading-none">{t('views:repos.ahead', 'Ahead')}</span>
            </div>
          </Table.Head>
          <Table.Head className="w-40 whitespace-nowrap">{t('views:repos.pullRequest', 'Pull Request')}</Table.Head>
          <Table.Head className="w-16" />
        </Table.Row>
      </Table.Header>
      {isLoading ? (
        <SkeletonTable countRows={12} countColumns={5} />
      ) : (
        <Table.Body>
          {branches.map(branch => {
            const checkState = branch?.checks?.status ? getChecksState(branch?.checks?.status) : null

            return (
              <Table.Row
                key={branch.id}
                className="cursor-pointer"
                onClick={() => navigate(`${toCode?.({ branchName: branch.name })}`)}
              >
                {/* branch name */}
                <Table.Cell className="content-center">
                  <div className="flex h-6 items-center">
                    <div className="inline-flex h-6 max-w-80 items-center truncate rounded bg-cn-background-8 px-2.5 text-2 text-cn-foreground-1">
                      {defaultBranch === branch?.name && (
                        <Icon name="lock" size={14} className="text-icons-9 -mt-px mr-1 inline-block" />
                      )}
                      {branch?.name}
                    </div>
                    <CopyButton color="gray" name={branch?.name} />
                  </div>
                </Table.Cell>
                {/* user avatar and timestamp */}
                <Table.Cell className="content-center">
                  <div className="flex items-center gap-2">
                    <Avatar.Root size="4.5">
                      {!!branch?.user?.avatarUrl && <Avatar.Image src={branch?.user?.avatarUrl} />}
                      <Avatar.Fallback className="text-center text-0">
                        {getInitials(branch?.user?.name ?? '')}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <time className="text-cn-foreground-1 truncate">{branch?.timestamp}</time>
                  </div>
                </Table.Cell>
                {/* checkstatus: show in the playground, hide the check status column if the checks are null in the gitness without data */}
                <Table.Cell className="content-center">
                  {branch?.checks && (
                    <div className="flex items-center">
                      {checkState === 'running' ? (
                        <span className="bg-icons-alert mr-1.5 size-2 rounded-full" />
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
                      <span className="text-cn-foreground-3 truncate">{branch?.checks?.done}</span>
                      <span className="mx-px">/</span>
                      <span className="text-cn-foreground-3 truncate">{branch?.checks?.total}</span>
                    </div>
                  )}
                </Table.Cell>
                {/* calculated divergence bar & default branch */}
                <Table.Cell className="content-center">
                  <div className="flex items-center justify-center gap-1.5 align-middle">
                    {branch?.behindAhead?.default ? (
                      <Badge variant="surface" size="sm">
                        {t('views:repos.default', 'Default')}
                      </Badge>
                    ) : (
                      <DivergenceGauge
                        behindAhead={branch?.behindAhead || {}}
                        useTranslationStore={useTranslationStore}
                      />
                    )}
                  </div>
                </Table.Cell>

                {/* PR link */}
                <Table.Cell className="max-w-20 content-center">
                  {branch.pullRequests && branch.pullRequests.length > 0 && branch.pullRequests[0].number && (
                    <Button variant="soft" theme="muted" size="sm" asChild>
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
                </Table.Cell>
                <Table.Cell className="text-right">
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
                        title: t('views:repos.browse', 'Browse'),
                        to: toCode?.({ branchName: branch.name }) || ''
                      },
                      {
                        isDanger: true,
                        title: t('views:repos.deleteBranch', 'Delete Branch'),
                        onClick: () => onDeleteBranch(branch.name)
                      }
                    ]}
                  />
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      )}
    </Table.Root>
  )
}
