import { useEffect } from 'react'

import { noop } from 'lodash-es'
import { parseAsInteger, useQueryState } from 'nuqs'

import { ListPipelinesOkResponse, useListPipelinesQuery } from '@harnessio/code-service-client'
import { IPipeline, PipelineListPage } from '@harnessio/ui/views'

import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs'
import { LinkComponent } from '../../components/LinkComponent'
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
      <PipelineListPage
        usePipelineListStore={usePipelineListStore}
        useTranslationStore={useTranslationStore}
        isLoading={isFetching}
        isError={isError}
        errorMessage={error?.message}
        searchQuery={query}
        setSearchQuery={setQuery}
        handleCreatePipeline={noop}
        LinkComponent={LinkComponent}
      />
    </>
  )
}

// NOTE: consider move this function to another file/location
function apiPipelines2Pipelines(data: ListPipelinesOkResponse): IPipeline[] {
  return data.map(pipelineBody => ({
    id: pipelineBody.identifier ?? '',
    description: pipelineBody?.execution?.message,
    meter:
      pipelineBody.last_executions?.map((exec, idx) => ({
        id: exec.number?.toString() ?? idx.toString(),
        state: getMeterState(pipelineBody?.execution?.status)
      })) ?? [],
    name: pipelineBody.identifier,
    sha: pipelineBody?.execution?.after,
    timestamp: pipelineBody?.created,
    status: getExecutionStatus(pipelineBody?.execution?.status)
  }))
}
