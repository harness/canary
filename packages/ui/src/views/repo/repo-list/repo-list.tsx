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

const Stats = ({ pulls }: { pulls: number }) => (
  <div className="flex select-none items-center justify-end gap-2">
    <Layout.Flex gap="3xs">
      <IconV2 name="git-pull-request" />
      <Text as="span" color="foreground-1">
        {pulls || 0}
      </Text>
    </Layout.Flex>
  </div>
)

const Title = ({
  repoName,
  isPrivate,
  isArchived,
  scope,
  repoPath,
  showScope = false
}: {
  repoName: string
  isPrivate: boolean
  isArchived?: boolean
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
      <Text variant="heading-base" className="max-w-[50%]" truncate>
        {repoName}
      </Text>
      <Layout.Flex align="center" gap="xs">
        <StatusBadge variant="outline" size="sm" theme={isPrivate ? 'muted' : 'success'}>
          {isPrivate ? t('views:repos.private', 'Private') : t('views:repos.public', 'Public')}
        </StatusBadge>
        {isArchived && (
          <StatusBadge variant="outline" size="sm" theme="warning">
            {t('views:repos.archived', 'Archived')}
          </StatusBadge>
        )}
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
          label: (
            <>
              <IconV2 name="trash" />
              {t('views:noData.clearFilters', 'Clear filters')}
            </>
          ),
          onClick: handleResetFiltersQueryAndPages
        }}
      />
    ) : (
      <NoData
        imageName="no-repository"
        title={t('views:noData.noRepos', 'No repositories yet')}
        description={[
          t('views:noData.noReposProject', 'There are no repositories in this project yet.'),
          t('views:noData.createOrImportRepos', 'Create new or import an existing repository.')
        ]}
        primaryButton={{
          label: (
            <>
              <IconV2 name="plus" />
              {t('views:repos.new-repository', 'New repository')}
            </>
          ),
          to: toCreateRepo?.()
        }}
        secondaryButton={{
          label: (
            <>
              <IconV2 name="import" />
              {t('views:repos.import-repository', 'Import Repository')}
            </>
          ),
          to: toImportRepo?.(),
          props: { variant: 'outline' }
        }}
      />
    )
  }

  return (
    <StackedList.Root>
      {repos.map((repo, repo_idx) => (
        <StackedList.Item
          key={repo.name}
          asChild
          className="py-3"
          isLast={repos.length - 1 === repo_idx}
          actions={
            <Favorite
              isFavorite={repo.favorite}
              onFavoriteToggle={isFavorite => onFavoriteToggle({ repoId: repo.id, isFavorite })}
            />
          }
        >
          <Link to={toRepository?.(repo) || ''} className={cn({ 'pointer-events-none': repo.importing })}>
            <StackedList.Field
              primary
              description={repo.importing ? t('views:repos.importing', 'Importing…') : repo.description}
              title={
                <Title
                  repoName={repo.name}
                  isPrivate={repo.private}
                  isArchived={repo.archived}
                  repoPath={repo.path}
                  scope={scope}
                  showScope={showScope}
                />
              }
              className="flex max-w-[80%] text-wrap"
            />
            {!repo.importing && (
              <StackedList.Field
                title={
                  <>
                    {t('views:repos.updated', 'Updated')}{' '}
                    <TimeAgoCard timestamp={repo.timestamp} dateTimeFormatOptions={{ dateStyle: 'medium' }} />
                  </>
                }
                description={<Stats pulls={repo.pulls} />}
                right
                label
              />
            )}
          </Link>
        </StackedList.Item>
      ))}
    </StackedList.Root>
  )
}
