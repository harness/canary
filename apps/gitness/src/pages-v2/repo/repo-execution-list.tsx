import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { noop } from 'lodash-es'
import { parseAsInteger, useQueryState } from 'nuqs'

import { ListExecutionsOkResponse, TypesExecution, useListExecutionsQuery } from '@harnessio/code-service-client'
import { Icon } from '@harnessio/ui/components'
import { ExecutionListPage, IExecution } from '@harnessio/ui/views'

import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs'
import { LinkComponent } from '../../components/LinkComponent'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { PageResponseHeader } from '../../types'
import { getExecutionStatus } from '../../utils/execution-utils'
import { useExecutionListStore } from './stores/repo-execution-list-store'

export default function RepoExecutionListPage() {
  const repoRef = useGetRepoRef()
  const { pipelineId } = useParams<PathParams>()

  const [query, setQuery] = useQueryState('query')
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const { setExecutionsData, page, setPage } = useExecutionListStore()

  const {
    data: { body: executionsBody, headers } = {},
    isFetching,
    isError,
    error
  } = useListExecutionsQuery(
    {
      repo_ref: repoRef,
      pipeline_identifier: pipelineId || '',
      queryParams: { page }
    },
    { enabled: !!repoRef }
  )

  useEffect(() => {
    if (executionsBody) {
      const executions = apiExecutions2Executions(executionsBody)
      const totalPages = parseInt(headers?.get(PageResponseHeader.xTotalPages) || '')
      setExecutionsData(executions, totalPages)
    } else {
      setExecutionsData(null, 0)
    }
  }, [executionsBody, headers])

  useEffect(() => {
    setQueryPage(page)
  }, [queryPage, page, setPage])

  return (
    <>
      <div className="breadcrumbs">
        <Breadcrumbs />
      </div>
      <ExecutionListPage
        useExecutionListStore={useExecutionListStore}
        useTranslationStore={useTranslationStore}
        isLoading={isFetching}
        isError={isError}
        errorMessage={error?.message}
        searchQuery={query}
        setSearchQuery={setQuery}
        handleExecutePipeline={noop}
        LinkComponent={LinkComponent}
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
    <div className="flex items-center gap-1 rounded-md bg-tertiary-background/10 px-1.5 font-mono">
      <Icon name="branch" size={11} className="text-tertiary-background" />
      {children}
    </div>
  )
}

export const Description = (props: { execution: TypesExecution }): string | React.ReactElement => {
  const {
    execution: { author_name, event, source, target }
  } = props
  if (!author_name || !event) {
    return ''
  }
  switch (event) {
    case 'manual':
      return `${author_name} triggered manually`
    case 'pull_request':
      return (
        <div className="flex items-center gap-1">
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
      return ''
  }
}
