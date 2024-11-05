import { parseAsInteger, useQueryState } from 'nuqs'
import { Spacer, Text, Button } from '@harnessio/canary'
import { Link, useParams } from 'react-router-dom'
import {
  SkeletonList,
  PullRequestList,
  NoData,
  useCommonFilter,
  Filter,
  NoSearchResults,
  SandboxLayout
} from '@harnessio/playground'
import { ListPullReqQueryQueryParams, TypesPullReq, useListPullReqQuery } from '@harnessio/code-service-client'
import { timeAgoFromEpochTime } from './pipeline-edit/utils/time-utils'
import { DropdownItemProps } from '../../../../packages/canary/dist/components/list-actions'
import { PathParams } from '../RouteDefinitions'
import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { PaginationComponent } from '../../../../packages/playground/dist'
import { PageResponseHeader } from '../types'

const SortOptions = [
  { name: 'Created', value: 'created' },
  { name: 'Edited', value: 'edited' },
  { name: 'Merged', value: 'merged' },
  { name: 'Number', value: 'number' },
  { name: 'Updated', value: 'updated' }
] as const satisfies DropdownItemProps[]

const colorArr = ['mint', 'yellow', 'red', 'blue', 'purple']

export default function PullRequestSandboxListPage() {
  const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => <Link to={to}>{children}</Link>
  const repoRef = useGetRepoRef()
  const { repoId, spaceId } = useParams<PathParams>()

  const { sort, query: currentQuery } = useCommonFilter<ListPullReqQueryQueryParams['sort']>()
  const [query, _] = useQueryState('query', { defaultValue: currentQuery || '' })
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const { data: { body: pullrequests, headers } = {}, isFetching } = useListPullReqQuery({
    repo_ref: repoRef,
    queryParams: { page, query, sort }
  })

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
            primaryButton={{ label: 'Clear search' }}
            secondaryButton={{ label: 'Clear filters' }}
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
          merged: item.merged,
          comments: item.stats?.conversations,
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
      />
    )
  }

  const pullRequestsExist = (pullrequests?.length ?? 0) > 0

  return (
    <>
      <SandboxLayout.Main hasHeader hasLeftPanel>
        <SandboxLayout.Content>
          <Spacer size={10} />
          {/**
           * Show if pull requests exist.
           * Additionally, show if query(search) is applied.
           */}
          {(query || pullRequestsExist) && (
            <>
              <Text size={5} weight={'medium'}>
                Pull Requests
              </Text>
              <Spacer size={6} />
              <div className="flex justify-between gap-5 items-center">
                <div className="flex-1">
                  <Filter sortOptions={SortOptions} />
                </div>
                <Button variant="default" asChild>
                  <Link to={`/spaces/${spaceId}/repos/${repoId}/pull-requests/compare/`}>New pull request</Link>
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
