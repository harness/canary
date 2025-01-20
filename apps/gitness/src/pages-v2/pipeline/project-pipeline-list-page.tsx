import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { noop } from 'lodash-es'
import { parseAsInteger, useQueryState } from 'nuqs'

import { useListSpacePipelinesQuery } from '@harnessio/code-service-client'
import { IPipeline, PipelineListPage } from '@harnessio/ui/views'

import { LinkComponent } from '../../components/LinkComponent'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { usePipelineListStore } from './stores/project-pipeline-list-store'

export default function ProjectPipelineListPage() {
  const routes = useRoutes()
  const { spaceId } = useParams<PathParams>()
  const spaceURL = useGetSpaceURLParam()
  const { setPipelinesData, page, setPage } = usePipelineListStore()
  const [query, setQuery] = useQueryState('query')
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const { data, isLoading, isError } = useListSpacePipelinesQuery({
    queryParams: { page, query: query ?? '' },
    space_ref: spaceURL || ''
  })

  useEffect(() => {
    setQueryPage(page)
  }, [queryPage, page, setPage])

  useEffect(() => {
    if (data) {
      const pipelines = data.body
      const totalPages = parseInt(data.headers?.get('x-total-pages') || '')
      setPipelinesData(
        pipelines.map(pipeline => {
          return {
            id: pipeline.identifier || '',
            name: `${pipeline.identifier} (${pipeline.repo_uid})`,
            meter: []
          }
        }),
        totalPages
      )
    }
  }, [data])

  return (
    <PipelineListPage
      isLoading={isLoading}
      isError={isError}
      usePipelineListStore={usePipelineListStore}
      searchQuery={query}
      setSearchQuery={setQuery}
      handleCreatePipeline={noop}
      useTranslationStore={useTranslationStore}
      LinkComponent={LinkComponent}
      toPipelineDetails={(pipeline: IPipeline) => routes.toExecutions({ spaceId, pipelineId: pipeline.id })}
    />
  )
}
