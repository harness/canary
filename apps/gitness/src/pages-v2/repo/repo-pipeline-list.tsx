import { useEffect } from 'react'

import { parseAsInteger, useQueryState } from 'nuqs'

import { ListPipelinesOkResponse, useListPipelinesQuery } from '@harnessio/code-service-client'
import { Pipeline, SandboxPipelineListPage } from '@harnessio/ui/views'

import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PageResponseHeader } from '../../types'
import { getExecutionStatus, getMeterState } from '../../utils/execution-utils'
import { usePipelineListStore } from './stores/repo-pipeline-list-store'

export default function RepoPipelineListPage() {
  const repoRef = useGetRepoRef()

  const [query, setQuery] = useQueryState('query')
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const { setPipelinesData, page, setPage } = usePipelineListStore()

  const {
    data: { body: pipelinesBody, headers } = {},
    isFetching,
    isError,
    error
  } = useListPipelinesQuery(
    {
      repo_ref: repoRef,
      queryParams: { page, query: query ?? '', latest: true }
    },
    { enabled: !!repoRef }
  )

  useEffect(() => {
    if (pipelinesBody) {
      const pipelines = apiPipelines2Pipelines(pipelinesBody)
      const totalPages = parseInt(headers?.get(PageResponseHeader.xTotalPages) || '')
      setPipelinesData(pipelines, totalPages)
    } else {
      setPipelinesData(null, 0)
    }
  }, [pipelinesBody, headers])

  useEffect(() => {
    setQueryPage(page)
  }, [queryPage, page, setPage])

  return (
    <>
      <div className="breadcrumbs">
        <Breadcrumbs />
      </div>
      <SandboxPipelineListPage
        usePipelineListStore={usePipelineListStore}
        useTranslationStore={useTranslationStore}
        isLoading={isFetching}
        isError={isError}
        errorMessage={error?.message}
        searchQuery={query}
        setSearchQuery={setQuery}
      />
    </>
  )
}

// NOTE: consider move this function to another file/location
function apiPipelines2Pipelines(data: ListPipelinesOkResponse): Pipeline[] {
  return data.map(pipelineBody => ({
    id: pipelineBody.identifier ?? '',
    description: pipelineBody?.execution?.message,
    meter: pipelineBody.last_executions?.map(exec => ({
      id: exec.number?.toString(),
      state: getMeterState(pipelineBody?.execution?.status)
    })),
    name: pipelineBody.identifier,
    sha: pipelineBody?.execution?.after,
    timestamp: pipelineBody?.created?.toString(),
    status: getExecutionStatus(pipelineBody?.execution?.status)
  }))
}
