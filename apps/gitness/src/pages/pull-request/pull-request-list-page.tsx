import { Link, useParams } from 'react-router-dom'

import { parseAsInteger, useQueryState } from 'nuqs'

import { Button, Spacer, Text } from '@harnessio/canary'
import {
  ListPullReqQueryQueryParams,
  TypesPullReq,
  useFindRepositoryQuery,
  useListPullReqQuery
} from '@harnessio/code-service-client'
import { SkeletonList } from '@harnessio/ui/components'
import {
  Filter,
  NoData,
  NoSearchResults,
  PaginationComponent,
  PullRequestList,
  SandboxLayout,
  useCommonFilter
} from '@harnessio/views'

import { DropdownItemProps } from '../../../../../packages/canary/dist/components/list-actions'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useDebouncedQueryState } from '../../hooks/useDebouncedQueryState'
import { PathParams } from '../../RouteDefinitions'
import { PageResponseHeader } from '../../types'
import { timeAgoFromEpochTime } from '../pipeline-edit/utils/time-utils'

const SortOptions = [
  { name: 'Created', value: 'created' },
  { name: 'Edited', value: 'edited' },
  { name: 'Merged', value: 'merged' },
  { name: 'Number', value: 'number' },
  { name: 'Updated', value: 'updated' }
] as const satisfies DropdownItemProps[]

const colorArr = ['mint', 'yellow', 'red', 'blue', 'purple']

export default function PullRequestListPage() {
  const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => <Link to={to}>{children}</Link>
  const repoRef = useGetRepoRef()
  const { repoId, spaceId } = useParams<PathParams>()

  const { sort } = useCommonFilter<ListPullReqQueryQueryParams['sort']>()
  const [query, setQuery] = useDebouncedQueryState('query')
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const { data: { body: pullrequests, headers } = {}, isFetching } = useListPullReqQuery({
    repo_ref: repoRef,
    queryParams: { page, query, sort }
  })

  const { data: { body: repoMetadata } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })

  const totalPages = parseInt(headers?.get(PageResponseHeader.xTotalPages) || '')

  const renderListContent = () => {
    if (isFetching) {
      return <SkeletonList />
    }
    if (!pullrequests?.length) {
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
          insideTabView
          iconName="no-data-merge"
          title="No Pull Requests yet"
          description={['There are no pull requests in this repository yet.']}
          primaryButton={{
            label: 'Open a pull request',
            to: `/spaces/${spaceId}/repos/${repoId}/pull-requests/compare`
          }}
        />
      )
    }
    return (
      <PullRequestList
        LinkComponent={LinkComponent}
        pullRequests={pullrequests?.map((item: TypesPullReq) => ({
          author: item?.author?.display_name,
          name: item?.title,
          // TODO: fix review required when its actually there
          reviewRequired: !item?.is_draft,
          merged: item?.merged,
          comments: item?.stats?.conversations,
          number: item?.number,
          is_draft: item?.is_draft,
          // TODO: add label information to display associated labels for each pull request
          // labels: item?.labels?.map((key: string, color: string) => ({ text: key, color: color })),
          // TODO: fix 2 hours ago in timestamp
          timestamp: item?.created ? timeAgoFromEpochTime(item?.created) : '',
          source_branch: item?.source_branch,
          state: item?.state,
          labels: item?.labels?.map((label, index) => ({
            text: label?.key && label?.value ? `${label?.key}:${label?.value}` : (label.key ?? ''),
            color: colorArr[index % colorArr.length]
          }))
        }))}
        closed_prs={repoMetadata?.num_closed_pulls}
        open_prs={repoMetadata?.num_open_pulls}
      />
    )
  }

  return (
    <>
      <SandboxLayout.Main hasHeader hasSubHeader hasLeftPanel>
        <SandboxLayout.Content>
          <Spacer size={10} />
          <Text size={5} weight={'medium'}>
            Pull Requests
          </Text>
          <Spacer size={6} />
          <div className="flex justify-between gap-5">
            <div className="flex-1">
              <Filter sortOptions={SortOptions} />
            </div>
            <Button variant="default" asChild>
              <Link to={`/spaces/${spaceId}/repos/${repoId}/pull-requests/compare/`}>New pull request</Link>
            </Button>
          </div>
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
