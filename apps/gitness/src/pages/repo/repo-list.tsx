import { Link } from 'react-router-dom'
import { parseAsInteger, useQueryState } from 'nuqs'
import { Button, Spacer, Text } from '@harnessio/canary'
import { useListReposQuery, RepoRepositoryOutput, ListReposQueryQueryParams } from '@harnessio/code-service-client'
import {
  PaddingListLayout,
  SkeletonList,
  RepoList,
  Filter,
  useCommonFilter,
  NoData,
  NoSearchResults,
  PaginationComponent
} from '@harnessio/playground'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import Header from '../../components/Header'
import { timeAgoFromEpochTime } from '../pipeline-edit/utils/time-utils'
import { PageResponseHeader } from '../../types'

const sortOptions = [
  { name: 'Created', value: 'created' },
  { name: 'Identifier', value: 'identifier' },
  { name: 'Updated', value: 'updated' }
]

const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => <Link to={to}>{children}</Link>

export default function ReposListPage() {
  const space = useGetSpaceURLParam()

  /* Query and Pagination */
  const { query: currentQuery = '', sort } = useCommonFilter<ListReposQueryQueryParams['sort']>()
  const [query, _] = useQueryState('query', { defaultValue: currentQuery })
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const { isFetching, data: { body: repositories, headers } = {} } = useListReposQuery({
    queryParams: { sort, query, page },
    space_ref: `${space}/+`
  })

  const totalPages = parseInt(headers?.get(PageResponseHeader.xTotalPages) || '')

  const renderListContent = () => {
    if (isFetching) return <SkeletonList />

    if (!repositories?.length) {
      if (query) {
        return (
          <NoSearchResults
            iconName="no-search-magnifying-glass"
            title="No search results"
            description={['Check your spelling and filter options,', 'or search for a different keyword.']}
            primaryButton={{ label: 'Clear search' }}
            secondaryButton={{ label: 'Clear filters' }}
          />
        )
      }
      return (
        <NoData
          iconName="no-data-folder"
          title="No repositories yet"
          description={[
            'There are no repositories in this project yet.',
            'Create new or import an existing repository.'
          ]}
          primaryButton={{ label: 'Create repository', to: `/spaces/${space}/repos/create` }}
          /**
           * @TODO add "to" link when Import repository gets implemented
           */
          secondaryButton={{ label: 'Import repository', to: '' }}
        />
      )
    }

    return (
      <RepoList
        LinkComponent={LinkComponent}
        repos={repositories?.map((repo: RepoRepositoryOutput) => {
          return {
            id: repo.id,
            name: repo.identifier,
            description: repo.description,
            private: !repo.is_public,
            stars: 0,
            forks: repo.num_forks,
            pulls: repo.num_pulls,
            timestamp: repo.updated && timeAgoFromEpochTime(repo.updated)
          }
        })}
      />
    )
  }

  return (
    <>
      <Header />
      <PaddingListLayout>
        {/**
         * Show if repositories exist.
         * Additionally, show if query(search) is applied.
         */}
        {(query || repositories?.length) && (
          <>
            <Text size={5} weight={'medium'}>
              Repositories
            </Text>
            <Spacer size={6} />
            <div className="flex justify-between gap-5">
              <div className="flex-1">
                <Filter sortOptions={sortOptions} />
              </div>
              <Button variant="default" asChild>
                <Link to={`/spaces/${space}/repos/create`}>Create Repository</Link>
              </Button>
            </div>
          </>
        )}
        <Spacer size={5} />
        {renderListContent()}
        <Spacer size={8} />
        {totalPages > 1 && (
          <PaginationComponent
            totalPages={totalPages}
            currentPage={page}
            goToPage={(pageNum: number) => setPage(pageNum)}
          />
        )}
      </PaddingListLayout>
    </>
  )
}
