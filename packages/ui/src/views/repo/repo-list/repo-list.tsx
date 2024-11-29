import { Badge, Icon, NoData, StackedList } from '@/components'

import { RepositoryType } from './types'

export interface PageProps {
  repos?: RepositoryType[]
  LinkComponent: React.ComponentType<{ to: string; children: React.ReactNode }>
  handleResetFilters?: () => void
  hasActiveFilters?: boolean
  query?: string
  handleResetQuery: () => void
}

const Stats = ({ stars, pulls }: { stars?: number; pulls: number }) => (
  <div className="flex select-none items-center justify-end gap-3 font-medium">
    <span className="flex items-center gap-1">
      <Icon size={16} name="star" className="text-icons-7" />
      <span className="text-primary text-xs font-normal">{stars || 0}</span>
    </span>
    <span className="flex items-center gap-1">
      <Icon size={16} name="pull" className="text-icons-7" />
      <span className="text-primary text-xs font-normal">{pulls || 0}</span>
    </span>
  </div>
)

const Title = ({ title, isPrivate }: { title: string; isPrivate: boolean }) => (
  <div className="inline-flex items-center gap-2.5">
    {title}
    <Badge size="sm" disableHover borderRadius="full" theme={isPrivate ? 'muted' : 'success'}>
      {isPrivate ? 'Private' : 'Public'}
    </Badge>
  </div>
)

export function RepoList({
  repos,
  LinkComponent,
  handleResetFilters,
  hasActiveFilters,
  query,
  handleResetQuery
}: PageProps) {
  return (
    <>
      <StackedList.Root>
        {repos && repos.length > 0 ? (
          <>
            {repos.map((repo, repo_idx) => (
              <LinkComponent key={repo_idx} to={repo.name}>
                <StackedList.Item key={repo.name} isLast={repos.length - 1 === repo_idx}>
                  <StackedList.Field
                    primary
                    description={repo.description}
                    title={<Title title={repo.name} isPrivate={repo.private} />}
                    className="gap-1.5"
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
          </>
        ) : (
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
        )}
      </StackedList.Root>
    </>
  )
}
