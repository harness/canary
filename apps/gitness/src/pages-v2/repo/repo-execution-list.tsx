import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { noop } from 'lodash-es'

import { ListExecutionsOkResponse, TypesExecution, useListExecutionsQuery } from '@harnessio/code-service-client'
import { IconV2 } from '@harnessio/ui/components'
import { ExecutionListPage, IExecution } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { parseAsInteger, useQueryState } from '../../framework/hooks/useQueryState'
import { PathParams } from '../../RouteDefinitions'
import { PageResponseHeader } from '../../types'
import { getExecutionStatus } from '../../utils/execution-utils'
import { useExecutionListStore } from './stores/repo-execution-list-store'

export default function RepoExecutionListPage() {
  const repoRef = useGetRepoRef()
  const { pipelineId } = useParams<PathParams>()

  const [query, setQuery] = useQueryState('query')
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const { setExecutionsData, page, setPage, pageSize } = useExecutionListStore()

  const {
    data: { body: executionsBody, headers } = {},
    isFetching,
    isError,
    error
  } = useListExecutionsQuery(
    {
      repo_ref: repoRef,
      pipeline_identifier: pipelineId || '',
      queryParams: { page, limit: pageSize }
    },
    { enabled: !!repoRef }
  )

  useEffect(() => {
    if (executionsBody) {
      const executions = apiExecutions2Executions(executionsBody)
      const totalItems = parseInt(headers?.get(PageResponseHeader.xTotal) || '0')
      const pageSizeFromHeader = parseInt(headers?.get(PageResponseHeader.xPerPage) || String(pageSize))
      setExecutionsData(executions, { totalItems, pageSize: pageSizeFromHeader })
    } else {
      setExecutionsData(null, { totalItems: 0, pageSize })
    }
  }, [executionsBody, headers])

  useEffect(() => {
    setQueryPage(page)
  }, [queryPage, page, setPage])

  return (
    <>
      <ExecutionListPage
        useExecutionListStore={useExecutionListStore}
        isLoading={isFetching}
        isError={isError}
        errorMessage={error?.message}
        searchQuery={query}
        setSearchQuery={setQuery}
        handleExecutePipeline={noop}
      />
      {/* TODO */}
      {/* <RunPipelineDialog
        open={openRunPipeline}
        onClose={() => {
          setOpenRunPipeline(false)
        }}
        pipelineId={pipelineId}
        branch={executions && executions.length > 0 ? executions[0].source : undefined} // TODO: check this
        toExecutions={'./executions'}
      /> */}
    </>
  )
}

// NOTE: consider move this function to another file/location
function apiExecutions2Executions(data: ListExecutionsOkResponse): IExecution[] {
  return data.map(executionBody => ({
    id: executionBody?.number ? `executions/${executionBody.number}` : '',
    status: getExecutionStatus(executionBody?.status),
    success: executionBody?.status,
    name: executionBody?.message || executionBody?.title,
    sha: executionBody?.after?.slice(0, 7),
    description: <Description execution={executionBody} />,
    finished: executionBody?.finished,
    started: executionBody?.started
  }))
}

const Branch = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <div className="flex items-center gap-cn-3xs rounded-3 bg-cn-1/10 px-cn-2xs font-body-code">
      <IconV2 name="git-branch" size="2xs" className="text-cn-3" />
      {children}
    </div>
  )
}

export const Description = (props: { execution: TypesExecution }): React.ReactElement | null => {
  const {
    execution: { author_name, event, source, target }
  } = props
  if (!author_name || !event) {
    return null
  }
  switch (event) {
    case 'manual':
      return <span>{`${author_name} triggered manually`}</span>
    case 'pull_request':
      return (
        <div className="flex items-center gap-cn-3xs">
          <span>{`${author_name} created pull request`}</span>
          {source && (
            <>
              from<Branch>{source}</Branch>
            </>
          )}
          {source && <span>to</span>}
          {target && <Branch>{target}</Branch>}
        </div>
      )
    default:
      return null
  }
}
