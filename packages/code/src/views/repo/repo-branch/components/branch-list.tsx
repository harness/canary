import { FC, useCallback, useMemo } from 'react'

import { getChecksState, getPrState } from '@views/repo/pull-request/utils'

import {
  ActionData,
  AvatarWithTooltip,
  CopyTag,
  IconPropsV2,
  IconV2,
  Layout,
  Link,
  MoreActionsTooltip,
  Separator,
  Skeleton,
  StatusBadge,
  Table,
  Tag,
  Text,
  TimeAgoCard
} from '@harnessio/ui/components'
import { useCustomDialogTrigger, useTranslation } from '@harnessio/ui/context'
import { cn, createPaginationLinks } from '@harnessio/ui/utils'

import { BranchListPageProps } from '../types'
import { DivergenceGauge } from './divergence-gauge'

export const BranchesList: FC<BranchListPageProps> = ({
  isLoading,
  useRepoBranchesStore,
  toPullRequestCompare,
  toPullRequest,
  toCode,
  onDeleteBranch,
  searchQuery
}) => {
  const { t } = useTranslation()

  const { triggerRef, registerTrigger } = useCustomDialogTrigger()

  const { branchList, defaultBranch, xNextPage, xPrevPage, page, pageSize, setPageSize } = useRepoBranchesStore()

  const handleDeleteBranch = useCallback(
    (branchName: string) => {
      registerTrigger()
      onDeleteBranch(branchName)
    },
    [onDeleteBranch, registerTrigger]
  )

  const { getPrevPageLink, getNextPageLink } = useMemo(
    () => createPaginationLinks(xPrevPage, xNextPage, searchQuery),
    [xPrevPage, xNextPage, searchQuery]
  )

  const canShowPagination = useMemo(() => {
    return !isLoading && !!branchList.length
  }, [isLoading, branchList.length])

  if (isLoading) {
    return <Skeleton.Table countRows={12} countColumns={6} />
  }

  return (
    <Table.Root
      paginationProps={
        canShowPagination
          ? {
              indeterminate: true,
              currentPage: page,
              hasNext: xNextPage > 0,
              hasPrevious: xPrevPage > 0,
              getNextPageLink: getNextPageLink,
              getPrevPageLink: getPrevPageLink,
              pageSize: pageSize,
              onPageSizeChange: setPageSize
            }
          : undefined
      }
    >
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-[33%]">{t('views:repos.branch', 'Branch')}</Table.Head>
          <Table.Head className="w-[15%]">{t('views:repos.update', 'Updated')}</Table.Head>

          {branchList[0]?.checks && (
            <Table.Head className="w-[15%]">{t('views:repos.checkStatus', 'Check status')}</Table.Head>
          )}

          <Table.Head className="w-[15%]" contentClassName="w-full">
            <Layout.Grid flow="column" columns="1fr auto 1fr" align="center" justify="center" gapX="2xs">
              <span className="text-right">{t('views:repos.behind', 'Behind')}</span>
              <Separator orientation="vertical" />
              <span>{t('views:repos.ahead', 'Ahead')}</span>
            </Layout.Grid>
          </Table.Head>
          <Table.Head className="w-[15%] whitespace-nowrap">{t('views:repos.pullRequest', 'Pull Request')}</Table.Head>
          <Table.Head className="w-[68px]" />
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {branchList.map(branch => {
          const checkState = branch?.checks?.status ? getChecksState(branch?.checks?.status) : null

          const checkStateColor = () => {
            switch (checkState) {
              case 'success':
                return 'success'
              case 'failure':
                return 'danger'
              case 'running':
                return 'warning'
              default:
                return 'neutral'
            }
          }

          return (
            <Table.Row key={branch.id} className="cursor-pointer" to={toCode?.({ branchName: branch.name })}>
              <Table.Cell>
                <CopyTag
                  variant="secondary"
                  value={branch?.name}
                  icon={defaultBranch === branch?.name ? 'lock' : undefined}
                  theme="gray"
                />
              </Table.Cell>

              <Table.Cell>
                <Layout.Flex align="center" gapX="xs">
                  <AvatarWithTooltip name={branch?.user?.name} src={branch?.user?.avatarUrl} size="xs" rounded />
                  <TimeAgoCard
                    timestamp={branch?.timestamp}
                    dateTimeFormatOptions={{ dateStyle: 'medium' }}
                    textProps={{ color: 'foreground-1', truncate: true }}
                  />
                </Layout.Flex>
              </Table.Cell>
              {/* checkstatus: show in the playground, hide the check status column if the checks are null in the gitness without data */}
              {checkState && (
                <Table.Cell>
                  <Layout.Flex align="center" gapX="xs">
                    <IconV2
                      color={checkStateColor()}
                      className={cn('shrink-0')}
                      name={
                        cn({
                          check: checkState === 'success',
                          xmark: checkState === 'failure',
                          circle: checkState === 'running'
                        }) as NonNullable<IconPropsV2['name']>
                      }
                      size="2xs"
                    />

                    <Text variant="body-single-line-strong" className="text-cn-gray-outline">
                      <span>{branch?.checks?.done || 0}</span>
                      <span>/</span>
                      <span>{branch?.checks?.total || 0}</span>
                    </Text>
                  </Layout.Flex>
                </Table.Cell>
              )}
              {/* calculated divergence bar & default branch */}
              <Table.Cell>
                {branch?.behindAhead?.default ? (
                  <Layout.Flex>
                    <Tag className="m-auto" value={t('views:repos.default', 'Default')} rounded />
                  </Layout.Flex>
                ) : (
                  <DivergenceGauge className="m-auto" behindAhead={branch?.behindAhead || {}} />
                )}
              </Table.Cell>

              <Table.Cell>
                {branch.pullRequests && branch.pullRequests.length > 0 && branch.pullRequests[0].number && (
                  <Link
                    noHoverUnderline
                    variant="secondary"
                    to={toPullRequest?.({ pullRequestId: branch.pullRequests[0].number }) || ''}
                    onClick={e => e.stopPropagation()}
                    className="rounded-cn-2 inline-flex"
                  >
                    {/* TODO: Merged state is not shown in the branch list, because the PR gets removed from 'branch.pullRequests' */}
                    <StatusBadge
                      variant="primary"
                      size="md"
                      theme={
                        getPrState(
                          branch.pullRequests[0].is_draft,
                          branch.pullRequests[0].merged,
                          branch.pullRequests[0].state
                        ).theme
                      }
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
                    </StatusBadge>
                  </Link>
                )}
              </Table.Cell>
              <Table.Cell className="text-right">
                <MoreActionsTooltip
                  ref={triggerRef}
                  iconName="more-horizontal"
                  actions={[
                    // Don't show Compare option for default branch
                    ...(!branch?.behindAhead?.default
                      ? [
                          {
                            title: t('views:repos.compare', 'Compare'),
                            to: toPullRequestCompare?.({ diffRefs: `${defaultBranch}...${branch.name}` }) || '',
                            iconName: 'git-pull-request'
                          } as ActionData
                        ]
                      : []),
                    {
                      title: t('views:repos.browse', 'Browse'),
                      to: toCode?.({ branchName: branch.name }) || '',
                      iconName: 'empty-page'
                    },
                    {
                      isDanger: true,
                      title: t('views:repos.deleteBranch', 'Delete Branch'),
                      onClick: () => handleDeleteBranch(branch.name),
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
