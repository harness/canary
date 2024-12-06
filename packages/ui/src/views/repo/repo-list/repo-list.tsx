import { Badge, Icon, NoData, SkeletonList, StackedList } from '@/components'
import { TFunction } from 'i18next'

import { RepositoryType, TranslationStore } from './types'

export interface PageProps {
  repos?: RepositoryType[]
  LinkComponent: React.ComponentType<{ to: string; children: React.ReactNode }>
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
  LinkComponent,
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
    return (
      <StackedList.Root>
        <div className="flex min-h-[50vh] items-center justify-center py-20">
          {hasActiveFilters || query ? (
            <NoData
              iconName="no-search-magnifying-glass"
              title="No search results"
              description={['Check your spelling and filter options,', 'or search for a different keyword.']}
              primaryButton={{
                label: 'Clear search',
                onClick: handleResetQuery
              }}
              secondaryButton={{
                label: 'Clear filters',
                onClick: handleResetFilters
              }}
            />
          ) : (
            <NoData
              iconName="no-data-folder"
              title="No repositories yet"
              description={[
                'There are no repositories in this project yet.',
                'Create new or import an existing repository.'
              ]}
              primaryButton={{
                label: 'Create repository',
                onClick: () => {
                  /* TODO: add create handler */
                }
              }}
            />
          )}
        </div>
      </StackedList.Root>
    )
  }

  return (
    <>
      <StackedList.Root>
        {repos.map((repo, repo_idx) => (
          <LinkComponent key={repo_idx} to={repo.name}>
            <StackedList.Item key={repo.name} isLast={repos.length - 1 === repo_idx}>
              <StackedList.Field
                primary
                description={repo.description}
                title={<Title title={repo.name} isPrivate={repo.private} t={t} />}
                className="gap-1.5 truncate"
              />
              <StackedList.Field
                title={
                  <>
                    Updated <em>{repo.timestamp}</em>
                  </>
                }
                description={<Stats stars={repo.stars} pulls={repo.pulls} />}
                right
                label
                secondary
              />
            </StackedList.Item>
          </LinkComponent>
        ))}
      </StackedList.Root>
    </>
  )
}
