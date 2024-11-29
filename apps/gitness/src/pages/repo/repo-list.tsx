import { useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { parseAsInteger, useQueryState } from 'nuqs'

import { Button, Spacer, Text } from '@harnessio/canary'
import {
  ListReposOkResponse,
  ListReposQueryQueryParams,
  RepoRepositoryOutput,
  useListReposQuery
} from '@harnessio/code-service-client'
import { SkeletonList } from '@harnessio/ui/components'
import {
  Filter,
  NoData,
  NoSearchResults,
  PaginationComponent,
  RepoList,
  SandboxLayout,
  useCommonFilter
} from '@harnessio/views'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import useSpaceSSE from '../../framework/hooks/useSpaceSSE'
import { useDebouncedQueryState } from '../../hooks/useDebouncedQueryState'
import { PageResponseHeader, SSEEvent } from '../../types'
import { timeAgoFromEpochTime } from '../pipeline-edit/utils/time-utils'

const sortOptions = [
  { name: 'Created', value: 'created' },
  { name: 'Identifier', value: 'identifier' },
  { name: 'Updated', value: 'updated' }
]

const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => <Link to={to}>{children}</Link>

export default function ReposListPageV1() {
  const space = useGetSpaceURLParam() ?? ''
  const navigate = useNavigate()

  /* Query and Pagination */
  const { sort } = useCommonFilter<ListReposQueryQueryParams['sort']>()
  const [query, setQuery] = useDebouncedQueryState('query')
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const {
    isFetching,
    data: { body: repositories, headers } = {},
    isError,
    error,
    refetch
  } = useListReposQuery(
    {
      queryParams: { sort, query, page },
      space_ref: `${space}/+`
    },
    { retry: false }
  )

  const isRepoStillImporting: boolean = useMemo(() => {
    return repositories?.some(repository => repository.importing) ?? false
  }, [repositories])

  const onEvent = useCallback(
    (_eventRepos: ListReposOkResponse) => {
      if (repositories?.some(repository => repository.importing)) {
        refetch()
      }
    },
    [repositories]
  )

  const events = useMemo(() => [SSEEvent.REPO_IMPORTED], [])

  useSpaceSSE({
    space,
    events,
    onEvent,
    shouldRun: isRepoStillImporting
  })

  const totalPages = parseInt(headers?.get(PageResponseHeader.xTotalPages) || '')

  const renderListContent = () => {
    if (isFetching) return <SkeletonList />

    if (isError)
      return (
        <NoData
          title="Error"
          description={[error.message || '']}
          primaryButton={{
            label: 'Go Back',
            onClick: () => {
              navigate(-1)
            }
          }}
        />
      )

    if (!repositories?.length) {
      if (query) {
        return (
          <NoSearchResults
            iconName="no-search-magnifying-glass"
            title="No search results"
            description={['Check your spelling and filter options,', 'or search for a different keyword.']}
            primaryButton={{ label: 'Clear search', onClick: () => setQuery('') }}
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
          primaryButton={{ label: 'Create repository', to: `create` }}
          /**
           * @TODO add "to" link when Import repository gets implemented
           */
          secondaryButton={{ label: 'Import repository', to: 'import' }}
        />
      )
    }

    return (
      <RepoList
        LinkComponent={LinkComponent}
        repos={repositories?.map((repo: RepoRepositoryOutput) => {
          return {
            id: repo.id || 0,
            name: repo.identifier,
            description: repo.description,
            private: !repo.is_public,
            stars: 0,
            forks: repo.num_forks,
            pulls: repo.num_pulls,
            timestamp: (repo.updated && timeAgoFromEpochTime(repo.updated)) || '',
            importing: repo.importing
          }
        })}
      />
    )
  }

  const repositoriesExist = (repositories?.length || 0) > 0

  return (
    <>
      <SandboxLayout.Main hasHeader hasLeftPanel>
        <SandboxLayout.Content>
          <Spacer size={10} />
          {/**
           * Show if repositories exist.
           * Additionally, show if query(search) is applied.
           */}
          {(query || repositoriesExist) && (
            <>
              <Text size={5} weight={'medium'}>
                Repositories
              </Text>
              <Spacer size={6} />
              <div className="flex justify-between gap-5">
                <div className="flex-1">
                  <Filter showSort={repositoriesExist} sortOptions={sortOptions} />
                </div>
                <Button variant="default" asChild>
                  <Link to={`create`}>Create Repository</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to={`import`}>Import Repository</Link>
                </Button>
              </div>
            </>
          )}
          <Spacer size={5} />
          {renderListContent()}
          <Spacer size={8} />
          <PaginationComponent
            totalPages={totalPages}
            currentPage={page}
            goToPage={(pageNum: number) => setPage(pageNum)}
          />
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    </>
  )
}
