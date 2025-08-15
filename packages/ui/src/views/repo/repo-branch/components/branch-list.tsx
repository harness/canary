import { FC } from 'react'

import {
  ActionData,
  Avatar,
  CopyTag,
  IconPropsV2,
  IconV2,
  MoreActionsTooltip,
  NoData,
  Separator,
  Skeleton,
  StatusBadge,
  Table,
  Tag,
  Text,
  TimeAgoCard
} from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { cn } from '@utils/cn'
import { getChecksState, getPrState } from '@views/repo/pull-request/utils'

import { BranchListPageProps } from '../types'
import { DivergenceGauge } from './divergence-gauge'

export const BranchesList: FC<BranchListPageProps> = ({
  isLoading,
  branches,
  defaultBranch,
  isDirtyList,
  setCreateBranchDialogOpen,
  handleResetFiltersAndPages,
  // toBranchRules,
  toPullRequestCompare,
  toPullRequest,
  toCode,
  onDeleteBranch
}) => {
  const { t } = useTranslation()
  const { Link } = useRouterContext()

  if (!branches?.length && !isLoading) {
    return (
      <NoData
        className="m-auto"
        imageName={isDirtyList ? 'no-search-magnifying-glass' : 'no-data-branches'}
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
        secondaryButton={
          isDirtyList
            ? {
                label: (
                  <>
                    <IconV2 name="trash" />
                    {t('views:noData.clearSearch', 'Clear Search')}
                  </>
                ),
                onClick: handleResetFiltersAndPages
              }
            : undefined
        }
        primaryButton={
          isDirtyList
            ? undefined
            : {
                label: (
                  <>
                    <IconV2 name="plus" />
                    {t('views:repos.createBranch', 'Create Branch')}
                  </>
                ),
                onClick: () => {
                  setCreateBranchDialogOpen(true)
                }
              }
        }
      />
    )
  }

  if (isLoading) {
    return <Skeleton.Table countRows={12} countColumns={6} />
  }

  return (
    <Table.Root className={isLoading ? '[mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]' : ''}>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-[25rem]">
            <Text variant="caption-strong">{t('views:repos.branch', 'Branch')}</Text>
          </Table.Head>
          <Table.Head className="w-[11.71875rem]">
            <Text variant="caption-strong">{t('views:repos.update', 'Updated')}</Text>
          </Table.Head>
          {branches[0]?.checks ? (
            <Table.Head className="w-[11.71875rem]">
              <Text variant="caption-strong">{t('views:repos.checkStatus', 'Check status')}</Text>
            </Table.Head>
          ) : null}
          <Table.Head className="w-[11.71875rem]">
            <div className="mx-auto grid w-28 grid-flow-col grid-cols-[1fr_auto_1fr] items-center justify-center gap-x-1.5">
              <Text variant="caption-strong" align="right">
                {t('views:repos.behind', 'Behind')}
              </Text>
              <Separator orientation="vertical" />
              <Text variant="caption-strong">{t('views:repos.ahead', 'Ahead')}</Text>
            </div>
          </Table.Head>
          <Table.Head className="w-[11.71875rem] whitespace-nowrap">
            <Text variant="caption-strong">{t('views:repos.pullRequest', 'Pull Request')}</Text>
          </Table.Head>
          <Table.Head className="w-[4.25rem]" />
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {branches.map(branch => {
          const checkState = branch?.checks?.status ? getChecksState(branch?.checks?.status) : null

          return (
            <Table.Row key={branch.id} className="cursor-pointer" to={toCode?.({ branchName: branch.name })}>
              {/* branch name */}
              <Table.Cell className="content-center">
                <div className="flex items-center">
                  <CopyTag
                    variant="secondary"
                    value={branch?.name}
                    icon={defaultBranch === branch?.name ? 'lock' : undefined}
                    theme="gray"
                  />
                </div>
              </Table.Cell>
              {/* user avatar and timestamp */}
              <Table.Cell className="content-center" disableLink>
                <div className="flex items-center gap-2">
                  <Avatar name={branch?.user?.name} src={branch?.user?.avatarUrl} size="sm" rounded />
                  <TimeAgoCard
                    timestamp={branch?.timestamp}
                    dateTimeFormatOptions={{ dateStyle: 'medium' }}
                    textProps={{ color: 'foreground-1', truncate: true }}
                  />
                </div>
              </Table.Cell>
              {/* checkstatus: show in the playground, hide the check status column if the checks are null in the gitness without data */}
              {branch?.checks && (
                <Table.Cell className="content-center">
                  <div className="flex items-center">
                    {checkState === 'running' ? (
                      <span className="mr-1.5 size-2 rounded-full bg-icons-alert" />
                    ) : (
                      <IconV2
                        className={cn('mr-1.5', {
                          'text-icons-success': checkState === 'success',
                          'text-icons-danger': checkState === 'failure'
                        })}
                        name={
                          cn({
                            check: checkState === 'success',
                            xmark: checkState === 'failure'
                          }) as NonNullable<IconPropsV2['name']>
                        }
                        size="2xs"
                      />
                    )}
                    <span className="truncate text-cn-foreground-3">{branch?.checks?.done}</span>
                    <span className="mx-px">/</span>
                    <span className="truncate text-cn-foreground-3">{branch?.checks?.total}</span>
                  </div>
                </Table.Cell>
              )}
              {/* calculated divergence bar & default branch */}
              <Table.Cell className="content-center">
                <div className="flex size-full items-center justify-start">
                  {branch?.behindAhead?.default ? (
                    <Tag variant="outline" size="md" value={t('views:repos.default', 'Default')} theme="gray" rounded />
                  ) : (
                    <DivergenceGauge behindAhead={branch?.behindAhead || {}} />
                  )}
                </div>
              </Table.Cell>

              {/* PR link */}
              <Table.Cell className="max-w-20 content-center" disableLink>
                {branch.pullRequests && branch.pullRequests.length > 0 && branch.pullRequests[0].number && (
                  <StatusBadge
                    variant="outline"
                    size="md"
                    theme={
                      getPrState(
                        branch.pullRequests[0].is_draft,
                        branch.pullRequests[0].merged,
                        branch.pullRequests[0].state
                      ).theme
                    }
                    // className="w-[66px]"
                  >
                    <Link
                      to={toPullRequest?.({ pullRequestId: branch.pullRequests[0].number }) || ''}
                      onClick={e => e.stopPropagation()}
                      className="flex w-full gap-1"
                    >
                      <IconV2
                        name={
                          getPrState(
                            branch.pullRequests[0].is_draft,
                            branch.pullRequests[0].merged,
                            branch.pullRequests[0].state
                          ).icon
                        }
                        size="xs"
                      />
                      #{branch.pullRequests[0].number}
                    </Link>
                  </StatusBadge>
                )}
              </Table.Cell>
              <Table.Cell className="text-right" disableLink>
                <MoreActionsTooltip
                  iconName="more-horizontal"
                  actions={[
                    // Don't show New Pull Request option for default branch
                    ...(!branch?.behindAhead?.default
                      ? [
                          {
                            title: t('views:repos.newPullReq', 'New pull request'),
                            to: toPullRequestCompare?.({ diffRefs: `${defaultBranch}...${branch.name}` }) || '',
                            iconName: 'git-pull-request'
                          } as ActionData
                        ]
                      : []),
                    // {
                    //   title: t('views:repos.viewRules', 'View Rules'),
                    //   to: toBranchRules?.()
                    // },
                    {
                      title: t('views:repos.browse', 'Browse'),
                      to: toCode?.({ branchName: branch.name }) || '',
                      iconName: 'page'
                    },
                    {
                      isDanger: true,
                      title: t('views:repos.deleteBranch', 'Delete Branch'),
                      onClick: () => onDeleteBranch(branch.name),
                      iconName: 'trash'
                    }
                  ]}
                />
              </Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table.Root>
  )
}
