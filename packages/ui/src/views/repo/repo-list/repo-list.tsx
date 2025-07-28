import {
  Favorite,
  IconV2,
  Layout,
  NoData,
  ScopeTag,
  SkeletonList,
  StackedList,
  StatusBadge,
  Text,
  TimeAgoCard
} from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { determineScope, getScopedPath } from '@components/scope/utils'
import { cn } from '@utils/cn'
import { Scope } from '@views/common'

import { RepositoryType } from '../repo.types'
import { FavoriteProps, RoutingProps } from './types'

export interface RepoListProps extends Partial<RoutingProps>, FavoriteProps {
  repos: RepositoryType[]
  handleResetFiltersQueryAndPages: () => void
  isDirtyList: boolean
  isLoading: boolean
  scope: Scope
  showScope?: boolean
}

const Stats = ({
  pulls,
  repoId,
  onFavoriteToggle,
  isFavorite
}: {
  pulls: number
  repoId: number
  onFavoriteToggle: RepoListProps['onFavoriteToggle']
  isFavorite?: boolean
}) => (
  <div className="flex select-none items-center justify-end gap-2 font-medium">
    <Favorite isFavorite={isFavorite} onFavoriteToggle={isFavorite => onFavoriteToggle({ repoId, isFavorite })} />
    <span className="flex items-center gap-1">
      <IconV2 name="git-pull-request" className="text-icons-7" />
      <span className="text-2 text-cn-foreground-1 font-normal">{pulls || 0}</span>
    </span>
  </div>
)

const Title = ({
  repoName,
  isPrivate,
  scope,
  repoPath,
  showScope = false
}: {
  repoName: string
  isPrivate: boolean
  scope: Scope
  repoPath: string
  showScope?: boolean
}) => {
  const { t } = useTranslation()
  const repoScopeParams = { ...scope, repoIdentifier: repoName, repoPath }
  const scopeType = determineScope(repoScopeParams)
  const scopedPath = getScopedPath(repoScopeParams)
  return (
    <Layout.Flex gap="xs" align="center">
      <span className="max-w-full truncate font-medium">{repoName}</span>
      <Layout.Flex align="center" gap="xs">
        <StatusBadge variant="outline" size="sm" theme={isPrivate ? 'muted' : 'success'}>
          {isPrivate ? t('views:repos.private', 'Private') : t('views:repos.public', 'Public')}
        </StatusBadge>
        {showScope && scopeType ? <ScopeTag scopeType={scopeType} scopedPath={scopedPath} /> : null}
      </Layout.Flex>
    </Layout.Flex>
  )
}

export function RepoList({
  repos,
  handleResetFiltersQueryAndPages,
  isDirtyList,
  isLoading,
  toRepository,
  toCreateRepo,
  toImportRepo,
  onFavoriteToggle,
  scope,
  showScope = false
}: RepoListProps) {
  const { Link } = useRouterContext()
  const { t } = useTranslation()

  if (isLoading) {
    return <SkeletonList />
  }

  if (!repos.length) {
    return isDirtyList ? (
      <NoData
        withBorder
        imageName="no-search-magnifying-glass"
        title={t('views:noData.noResults', 'No search results')}
        description={[
          t('views:noData.checkSpelling', 'Check your spelling and filter options,'),
          t('views:noData.changeSearch', 'or search for a different keyword.')
        ]}
        secondaryButton={{
          label: t('views:noData.clearFilters', 'Clear filters'),
          onClick: handleResetFiltersQueryAndPages
        }}
      />
    ) : (
      <NoData
        withBorder
        imageName="no-repository"
        title={t('views:noData.noRepos', 'No repositories yet')}
        description={[
          t('views:noData.noReposProject', 'There are no repositories in this project yet.'),
          t('views:noData.createOrImportRepos', 'Create new or import an existing repository.')
        ]}
        primaryButton={{
          label: t('views:repos.create-repository', 'Create Repository'),
          to: toCreateRepo?.()
        }}
        secondaryButton={{ label: t('views:repos.import-repository', 'Import Repository'), to: toImportRepo?.() }}
      />
    )
  }

  return (
    <StackedList.Root>
      {repos.map((repo, repo_idx) => (
        <Link
          key={repo.name}
          to={toRepository?.(repo) || ''}
          className={cn({
            'pointer-events-none': repo.importing
          })}
        >
          <StackedList.Item key={repo.name} className="pb-2.5 pt-3" isLast={repos.length - 1 === repo_idx}>
            <StackedList.Field
              primary
              description={
                repo.importing ? (
                  t('views:repos.importing', 'Importing…')
                ) : (
                  <span className="max-w-full truncate">{repo.description}</span>
                )
              }
              title={
                <Title
                  repoName={repo.name}
                  isPrivate={repo.private}
                  repoPath={repo.path}
                  scope={scope}
                  showScope={showScope}
                />
              }
              className="flex max-w-[80%] gap-1.5 text-wrap"
            />
            {!repo.importing && (
              <StackedList.Field
                title={
                  <Text as="span">
                    {t('views:repos.updated', 'Updated')}{' '}
                    <TimeAgoCard timestamp={repo.timestamp} dateTimeFormatOptions={{ dateStyle: 'medium' }} />
                  </Text>
                }
                description={
                  <Stats
                    pulls={repo.pulls}
                    repoId={repo.id}
                    isFavorite={repo.favorite}
                    onFavoriteToggle={onFavoriteToggle}
                  />
                }
                right
                label
                secondary
              />
            )}
          </StackedList.Item>
        </Link>
      ))}
    </StackedList.Root>
  )
}
