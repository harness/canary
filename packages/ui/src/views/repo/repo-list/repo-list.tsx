import { Link } from 'react-router-dom'

import { Badge, Icon, NoData, SkeletonList, StackedList } from '@/components'
import { TFunction } from 'i18next'

import { RepositoryType } from '../repo.types'
import { RoutingProps, TranslationStore } from './types'

export interface PageProps extends Partial<RoutingProps> {
  repos: RepositoryType[]
  handleResetFiltersQueryAndPages: () => void
  isDirtyList: boolean
  useTranslationStore: () => TranslationStore
  isLoading: boolean
}

const Stats = ({ pulls }: { pulls: number }) => (
  <div className="flex select-none items-center justify-end gap-3 font-medium">
    <span className="flex items-center gap-1">
      <Icon size={16} name="pull" className="text-icons-7" />
      <span className="text-xs font-normal text-primary">{pulls || 0}</span>
    </span>
  </div>
)

const Title = ({ title, isPrivate, t }: { title: string; isPrivate: boolean; t: TFunction }) => (
  <div className="inline-flex items-center gap-2.5">
    <span className="max-w-full truncate font-medium">{title}</span>
    <Badge className="leading-none" size="sm" disableHover borderRadius="full" theme={isPrivate ? 'muted' : 'success'}>
      {isPrivate ? t('views:repos.private', 'Private') : t('views:repos.public', 'Public')}
    </Badge>
  </div>
)

export function RepoList({
  repos,
  handleResetFiltersQueryAndPages,
  isDirtyList,
  useTranslationStore,
  isLoading,
  toRepository,
  toCreateRepo,
  toImportRepo
}: PageProps) {
  const { t } = useTranslationStore()

  if (isLoading) {
    return <SkeletonList />
  }

  if (!repos.length) {
    return isDirtyList ? (
      <NoData
        withBorder
        iconName="no-search-magnifying-glass"
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
        iconName="no-repository"
        title={t('views:noData.noRepos', 'No repositories yet')}
        description={[
          t('views:noData.noReposProject', 'There are no repositories in this project yet.'),
          t('views:noData.createOrImportRepos', 'Create new or import an existing repository.')
        ]}
        primaryButton={{
          label: t('views:repos.create-repository', 'Create repository'),
          to: toCreateRepo?.()
        }}
        secondaryButton={{ label: t('views:repos.import-repository', 'Import repository'), to: toImportRepo?.() }}
      />
    )
  }

  return (
    <StackedList.Root>
      {repos
        .filter(repo => !repo.importing) // Exclude repos where importing is true
        .map((repo, repo_idx) => (
          <Link key={repo.name} to={toRepository?.(repo) || ''}>
            <StackedList.Item key={repo.name} className="pb-2.5 pt-3" isLast={repos.length - 1 === repo_idx}>
              <StackedList.Field
                primary
                description={<span className="max-w-full truncate">{repo.description}</span>}
                title={<Title title={repo.name} isPrivate={repo.private} t={t} />}
                className="flex max-w-[80%] gap-1.5 text-wrap"
              />

              <StackedList.Field
                title={t('views:repos.updated', 'Updated') + ' ' + repo.timestamp}
                description={<Stats pulls={repo.pulls} />}
                right
                label
                secondary
              />
            </StackedList.Item>
          </Link>
        ))}
    </StackedList.Root>
  )
}
