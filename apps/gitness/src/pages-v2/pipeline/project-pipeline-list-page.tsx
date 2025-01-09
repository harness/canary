import { useEffect } from 'react'

import { noop } from 'lodash-es'
import { parseAsInteger, useQueryState } from 'nuqs'

import { useListSpacePipelinesQuery } from '@harnessio/code-service-client'
import { PipelineListPage } from '@harnessio/ui/views'

import { LinkComponent } from '../../components/LinkComponent'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { usePipelineListStore } from './stores/project-pipeline-list-store'

export default function ProjectPipelineListPage() {
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
    />
  )
}
