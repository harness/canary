import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useListPipelinesQuery } from '@harnessio/code-service-client'
import { IPipeline, PipelineListPage } from '@harnessio/ui/views'

import { LinkComponent } from '../../components/LinkComponent'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { parseAsInteger, useQueryState } from '../../framework/hooks/useQueryState'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { PageResponseHeader } from '../../types'
import CreatePipelineDialog from '../pipeline/create-pipeline-dialog'
import { usePipelineListStore } from './stores/repo-pipeline-list-store'
import { apiPipelines2Pipelines } from './transform-utils/pipeline-list-transform'

export default function RepoPipelineListPage() {
  const routes = useRoutes()
  const repoRef = useGetRepoRef()
  const { spaceId, repoId } = useParams<PathParams>()

  const [query, setQuery] = useQueryState('query')
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const { setPipelinesData, page, setPage } = usePipelineListStore()

  const [isCreatePipelineDialogOpen, setCreatePipelineDialogOpen] = useState(false)

  const closeSearchDialog = () => {
    setCreatePipelineDialogOpen(false)
  }

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
      <PipelineListPage
        usePipelineListStore={usePipelineListStore}
        useTranslationStore={useTranslationStore}
        isLoading={isFetching}
        isError={isError}
        errorMessage={error?.message}
        searchQuery={query}
        setSearchQuery={setQuery}
        handleCreatePipeline={() => {
          setCreatePipelineDialogOpen(true)
        }}
        LinkComponent={LinkComponent}
        toPipelineDetails={(pipeline: IPipeline) => routes.toExecutions({ spaceId, repoId, pipelineId: pipeline.id })}
      />
      <CreatePipelineDialog open={isCreatePipelineDialogOpen} onClose={closeSearchDialog} />
    </>
  )
}
