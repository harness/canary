import { TypesExecution, useListExecutionsQuery } from '@harnessio/code-service-client'
import { ListActions, SearchBox, Spacer, Text, Button } from '@harnessio/canary'
import { PaddingListLayout, ExecutionList, SkeletonList, timeDistance, NoData } from '@harnessio/playground'
import { ExecutionState } from '../types'
import { Link, useParams } from 'react-router-dom'
import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { PathParams } from '../RouteDefinitions'
import { getLabel } from '../utils/execution-utils'

const filterOptions = [{ name: 'Filter option 1' }, { name: 'Filter option 2' }, { name: 'Filter option 3' }]
const sortOptions = [{ name: 'Sort option 1' }, { name: 'Sort option 2' }, { name: 'Sort option 3' }]
const viewOptions = [{ name: 'View option 1' }, { name: 'View option 2' }]

export default function ExecutionsListPage() {
  const repoRef = useGetRepoRef()
  const { pipelineId } = useParams<PathParams>()
  const {
    data: executions,
    isFetching,
    error,
    isSuccess
  } = useListExecutionsQuery(
    {
      repo_ref: repoRef,
      pipeline_identifier: pipelineId || '',
      queryParams: { page: 0, limit: 10 }
    },
    /* To enable mock data */
    {
      placeholderData: [{ message: 'Pipeline execution failed' }, { message: 'Execution successful' }],
      enabled: true
    }
  )

  const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => <Link to={to}>{children}</Link>

  const renderListContent = () => {
    if (isFetching) {
      return <SkeletonList />
    }
    if (isSuccess) {
      if (executions?.length) {
        return (
          <ExecutionList
            executions={executions?.map((item: TypesExecution) => ({
              id: item?.number && `executions/${item.number}`,
              status: item?.status,
              success: item?.status === 'success',
              name: item?.message || item?.title,
              sha: item?.after?.slice(0, 6),
              description: getLabel(item),
              timestamp: `${timeDistance(item?.finished, Date.now(), true)} ago`,
              lastTimestamp: timeDistance(
                item?.started,
                item?.status === ExecutionState.RUNNING ? Date.now() : item?.finished,
                true
              )
            }))}
            LinkComponent={LinkComponent}
          />
        )
      }

      return (
        <>
          <NoData
            iconName="no-data-cog"
            title="No executions yet"
            description={[
              "Your pipeline executions will appear here once they're completed.",
              'Start your pipeline to see the results.'
            ]}
            primaryButton={{ label: 'Create pipeline' }}
            secondaryButton={{ label: 'Import pipeline' }}
          />
        </>
      )
    } else {
      console.log({ error })
      return <></>
    }
  }

  return (
    <>
      <PaddingListLayout>
        <Text size={5} weight={'medium'}>
          Executions
        </Text>
        <Spacer size={6} />
        <ListActions.Root>
          <ListActions.Left>
            <SearchBox.Root placeholder="Search executions" />
          </ListActions.Left>
          <ListActions.Right>
            <ListActions.Dropdown title="Filter" items={filterOptions} />
            <ListActions.Dropdown title="Sort" items={sortOptions} />
            <ListActions.Dropdown title="View" items={viewOptions} />
            <Button variant="default" asChild>
              <Link to="edit">Edit Pipeline</Link>
            </Button>
          </ListActions.Right>
        </ListActions.Root>
        <Spacer size={5} />
        {renderListContent()}
        <Spacer size={8} />
      </PaddingListLayout>
    </>
  )
}
