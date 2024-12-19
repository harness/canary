import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { parseAsInteger, useQueryState } from 'nuqs'

import { Button, ListActions, Spacer, Text } from '@harnessio/canary'
import { TypesExecution, useListExecutionsQuery } from '@harnessio/code-service-client'
import { SkeletonList } from '@harnessio/ui/components'
import {
  ExecutionList,
  ExecutionState,
  NoData,
  PaginationComponent,
  SandboxLayout,
  timeDistance
} from '@harnessio/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { PathParams } from '../../RouteDefinitions'
import { PageResponseHeader } from '../../types'
import { getExecutionStatus, getLabel } from '../../utils/execution-utils'
import RunPipelineDialog from '../run-pipeline-dialog/run-pipeline-dialog'

export default function RepoExecutionListPage() {
  const repoRef = useGetRepoRef()
  const { pipelineId } = useParams<PathParams>()
  const [openRunPipeline, setOpenRunPipeline] = useState(false)

  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const {
    data: { body: executions, headers } = {},
    isFetching,
    isSuccess
  } = useListExecutionsQuery(
    {
      repo_ref: repoRef,
      pipeline_identifier: pipelineId || '',
      queryParams: { page }
    },
    { enabled: !!repoRef }
  )

  const totalPages = parseInt(headers?.get(PageResponseHeader.xTotalPages) || '')

  const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => <Link to={to}>{children}</Link>

  const renderListContent = () => {
    if (isFetching) {
      return <SkeletonList />
    }
    if (isSuccess) {
      if (executions?.length) {
        return (
          <>
            <ListActions.Root>
              <ListActions.Left>
                {/**
                 * @TODO enable this when execution list api supports querying
                 */}
                {/* <SearchBox.Root placeholder="Search executions" /> */}
                <></>
              </ListActions.Left>
              <ListActions.Right>
                <div className="flex gap-x-4">
                  <Button
                    variant="default"
                    onClick={() => {
                      setOpenRunPipeline(true)
                    }}
                  >
                    Run
                  </Button>
                  <Button variant="default" asChild>
                    <Link to="edit">Edit Pipeline</Link>
                  </Button>
                </div>
              </ListActions.Right>
            </ListActions.Root>
            <Spacer size={5} />
            <ExecutionList
              executions={executions?.map((item: TypesExecution) => ({
                id: item?.number ? `executions/${item.number}` : '',
                // TODO: temporary type fix - this component gonna be deleted
                status: getExecutionStatus(item?.status) as unknown as ExecutionState,
                success: item?.status,
                name: item?.message || item?.title,
                sha: item?.after?.slice(0, 7),
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
          </>
        )
      }

      return (
        <>
          <NoData
            iconName="no-data-cog"
            title="No executions yet"
            description={['Your pipeline executions will appear here once you run a pipeline.']}
            primaryButton={{
              label: 'Run Pipeline',
              onClick: () => {
                setOpenRunPipeline(true)
              }
            }}
            secondaryButton={{ label: 'Edit pipeline', to: 'edit' }}
          />
        </>
      )
    }
  }

  return (
    <>
      <SandboxLayout.Main>
        <SandboxLayout.Content>
          <Spacer size={10} />
          <Text size={5} weight={'medium'}>
            Executions
          </Text>
          <Spacer size={6} />
          {renderListContent()}
          <Spacer size={8} />
          <PaginationComponent
            totalPages={totalPages}
            currentPage={page}
            goToPage={(pageNum: number) => setPage(pageNum)}
          />
        </SandboxLayout.Content>
      </SandboxLayout.Main>
      <RunPipelineDialog
        open={openRunPipeline}
        onClose={() => {
          setOpenRunPipeline(false)
        }}
        pipelineId={pipelineId}
        branch={executions && executions.length > 0 ? executions[0].source : undefined} // TODO: check this
        toExecutions={'./executions'}
      />
    </>
  )
}
