import { Link } from 'react-router-dom'

import { Badge, Icon, NoData, SkeletonList, StackedList } from '@/components'
import { cn } from '@utils/cn'
import { TFunction } from 'i18next'

import { RepositoryType } from '../repo.types'
import { TranslationStore } from './types'

export interface PageProps {
  repos?: RepositoryType[]
  handleResetFilters?: () => void
  hasActiveFilters?: boolean
  query?: string
  handleResetQuery: () => void
  useTranslationStore: () => TranslationStore
  isLoading: boolean
}

const Stats = ({ stars, pulls }: { stars?: number; pulls: number }) => (
  <div className="flex select-none items-center justify-end gap-3 font-medium">
    <span className="flex items-center gap-1">
      <Icon size={16} name="star" className="text-icons-7" />
      <span className="text-xs font-normal text-primary">{stars || 0}</span>
    </span>
    <span className="flex items-center gap-1">
      <Icon size={16} name="pull" className="text-icons-7" />
      <span className="text-xs font-normal text-primary">{pulls || 0}</span>
    </span>
  </div>
)

const Title = ({ title, isPrivate, t }: { title: string; isPrivate: boolean; t: TFunction }) => (
  <div className="inline-flex items-center gap-2.5">
    {title}
    <Badge size="sm" disableHover borderRadius="full" theme={isPrivate ? 'muted' : 'success'}>
      {isPrivate ? t('views:repos.private', 'Private') : t('views:repos.public', 'Public')}
    </Badge>
  </div>
)

export function RepoList({
  repos,
  handleResetFilters,
  hasActiveFilters,
  query,
  handleResetQuery,
  useTranslationStore,
  isLoading
}: PageProps) {
  const noData = !(repos && repos.length > 0)
  const { t } = useTranslationStore()

  if (isLoading) {
    return <SkeletonList />
  }

  if (noData) {
    return hasActiveFilters || query ? (
      <StackedList.Root>
        <div className="flex min-h-[50vh] items-center justify-center py-20">
          <NoData
            iconName="no-search-magnifying-glass"
            title={t('views:noData.noResults', 'No search results')}
            description={[
              t('views:noData.checkSpelling', 'Check your spelling and filter options,'),
              t('views:noData.changeSearch', 'or search for a different keyword.')
            ]}
            primaryButton={{
              label: t('views:noData.clearSearch', 'Clear search'),
              onClick: handleResetQuery
            }}
            secondaryButton={{
              label: t('views:noData.clearFilters', 'Clear filters'),
              onClick: handleResetFilters
            }}
          />
        </div>
      </StackedList.Root>
    ) : (
      <div className="flex min-h-[70vh] items-center justify-center py-20">
        <NoData
          iconName="no-data-folder"
          title={t('views:noData.noRepos', 'No repositories yet')}
          description={[
            t('views:noData.noReposProject', 'There are no repositories in this project yet.'),
            t('views:noData.createOrImportRepos', 'Create new or import an existing repository.')
          ]}
          primaryButton={{
            label: t('views:repos.create-repository', 'Create repository'),
            to: 'create'
          }}
          secondaryButton={{ label: t('views:repos.import-repository', 'Import repository'), to: 'import' }}
        />
      </div>
    )
  }

  return (
    <>
      <StackedList.Root>
        {repos.map((repo, repo_idx) => (
          <Link
            key={repo.name}
            to={repo.name}
            className={cn({
              'pointer-events-none': repo.importing
            })}
          >
            <StackedList.Item key={repo.name} isLast={repos.length - 1 === repo_idx}>
              <StackedList.Field
                primary
                description={repo.importing ? 'Importing Repository...' : repo.description}
                title={<Title title={repo.name} isPrivate={repo.private} t={t} />}
                className="line-clamp-1 gap-1.5 text-wrap"
              />
              {!repo.importing ? (
                <StackedList.Field
                  title={t('views:repos.updated', 'Updated') + ' ' + repo.timestamp}
                  description={<Stats stars={repo.stars} pulls={repo.pulls} />}
                  right
                  label
                  secondary
                />
              ) : null}
            </StackedList.Item>
          </Link>
        ))}
      </StackedList.Root>
    </>
  )
}
