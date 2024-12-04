import { Link } from 'react-router-dom'

import { parseAsInteger, useQueryState } from 'nuqs'

import { Button, Spacer, Text } from '@harnessio/canary'
import { TypesPipeline, useListSpacePipelinesQuery } from '@harnessio/code-service-client'
import { SkeletonList } from '@harnessio/ui/components'
import { Filter, NoData, NoSearchResults, PaginationComponent, PipelineList, SandboxLayout } from '@harnessio/views'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useDebouncedQueryState } from '../../hooks/useDebouncedQueryState'
import { PageResponseHeader } from '../../types'
import { getExecutionStatus } from '../../utils/execution-utils'
import { timeAgoFromEpochTime } from '../pipeline-edit/utils/time-utils'

export default function ProjectPipelinesPage() {
  const spaceId = useGetSpaceURLParam()
  const [query, setQuery] = useDebouncedQueryState('query')
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const { data: { body: pipelines, headers } = {}, isFetching } = useListSpacePipelinesQuery(
    {
      space_ref: spaceId || '',
      queryParams: { page, query }
    },
    { enabled: !!spaceId }
  )

  const totalPages = parseInt(headers?.get(PageResponseHeader.xTotalPages) || '')

  const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => <Link to={to}>{children}</Link>

  const renderListContent = () => {
    if (isFetching) {
      return <SkeletonList />
    }

    if (!pipelines?.length) {
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
          title="No pipelines yet"
          description={['There are no pipelines in this repository yet.']}
          primaryButton={{ label: 'Create pipeline', to: 'create' }}
        />
      )
    }
    return (
      <PipelineList
        pipelines={pipelines?.map((item: TypesPipeline) => ({
          id: item?.identifier || '',
          status: getExecutionStatus(item?.execution?.status),
          name: item?.identifier || '',
          sha: item?.execution?.after,
          description: item?.execution?.message,
          timestamp: item?.created ? timeAgoFromEpochTime(item.created) : ''
          /**
           * Add when pipeline contains execution data as well
           */
          // meter: [
          //         {
          //           id: item?.execution?.number,
          //           state: getMeterState(item?.execution?.status)
          //         }
          //       ]
        }))}
        LinkComponent={LinkComponent}
      />
    )
  }

  return (
    <>
      <SandboxLayout.Main hasHeader hasLeftPanel>
        <SandboxLayout.Content>
          <Spacer size={10} />
          <Text size={5} weight={'medium'}>
            Pipelines
          </Text>
          <Spacer size={6} />
          <div className="flex justify-between gap-5">
            <div className="flex-1">
              <Filter />
            </div>
            <Button variant="default" asChild>
              <Link to="create">Create Pipeline</Link>
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
